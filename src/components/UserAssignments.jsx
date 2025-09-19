import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, LinearProgress, Chip, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserAssignments = () => {
  const token = localStorage.getItem('token');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAttempt, setOpenAttempt] = useState(false);
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({}); // questionId -> answer(string)
  const [submitting, setSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState(null); // {message, score, passed, attemptNumber}
  const [openReport, setOpenReport] = useState(false);
  const [reportAssignment, setReportAssignment] = useState(null);
  const navigate = useNavigate();
  const [attemptStatus, setAttemptStatus] = useState(() => {
    try {
      const raw = localStorage.getItem('assignmentAttemptStatus');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const axiosAuth = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  const getUserFromToken = () => {
    try {
      if (!token) return {};
      const parts = token.split('.');
      if (parts.length < 2) return {};
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      // Common fields: id, _id, sub, email
      return {
        id: payload.id || payload._id || payload.sub,
        email: payload.email || payload.user?.email,
      };
    } catch {
      return {};
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error('You are not authenticated. Please login again.');
        setAssignments([]);
        return;
      }
      // Fetch individual user's report
      const res = await axios.get(`${BaseUrl}/assignments/my-report`, axiosAuth);
      const payload = res.data || {};
      const report = Array.isArray(payload.report) ? payload.report : [];

      // Normalize assignments to a consistent shape used by UI
      const normalized = report.map((row) => ({
        id: row.assignmentId,
        title: row.title,
        description: row.description,
        cutoff: row.cutoff,
        isActive: row.isActive,
        attempts: Array.isArray(row.attempts) ? row.attempts : [],
        // prefer backend-provided count if available; fallback will be fetched below
        questionsCount: typeof row.questionsCount === 'number'
          ? row.questionsCount
          : (Array.isArray(row.questions) ? row.questions.length : undefined),
      }));
      // Fetch missing question counts in parallel where not provided
      const withCounts = await Promise.all(normalized.map(async (a) => {
        if (typeof a.questionsCount === 'number') return a;
        try {
          const details = await axios.get(`${BaseUrl}/assignments/${a.id}`, axiosAuth);
          const count = Array.isArray(details.data?.questions)
            ? details.data.questions.length
            : (typeof details.data?.questionCount === 'number' ? details.data.questionCount : 0);
          return { ...a, questionsCount: count };
        } catch {
          return { ...a, questionsCount: 0 };
        }
      }));
      setAssignments(withCounts);

      // Build attemptStatus from final attempt per assignment
      const nextStatus = { ...attemptStatus };
      for (const a of (withCounts || normalized)) {
        const latest = (a.attempts || []).slice().sort((x, y) => {
          const ax = typeof x.attemptNumber === 'number' ? x.attemptNumber : 0;
          const ay = typeof y.attemptNumber === 'number' ? y.attemptNumber : 0;
          if (ay !== ax) return ay - ax;
          const dx = x.submittedAt ? new Date(x.submittedAt).getTime() : 0;
          const dy = y.submittedAt ? new Date(y.submittedAt).getTime() : 0;
          return dy - dx;
        })[0];
        if (latest) {
          nextStatus[a.id] = {
            passed: !!latest.passed,
            attemptNumber: latest.attemptNumber,
            score: latest.score,
            cutoff: a.cutoff ?? 0,
          };
        } else {
          // No attempts yet — clear any stale cache
          if (nextStatus[a.id]) delete nextStatus[a.id];
        }
      }
      setAttemptStatus(nextStatus);
      try { localStorage.setItem('assignmentAttemptStatus', JSON.stringify(nextStatus)); } catch {}
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const startAttempt = async (assignment) => {
    const id = assignment._id || assignment.id || assignment.assignmentId;
    navigate(`/assignments/${id}/exam`);
  };

  const openAssignmentReport = (assignment) => {
    setReportAssignment(assignment);
    setOpenReport(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const id = active._id || active.id;
      const payload = {
        answers: (active?.questions || []).map((q) => ({
          questionId: q._id || q.id,
          answer: answers[q._id || q.id] ?? ''
        }))
      };
      let res;
      try {
        // Use provided fixed endpoint first
        res = await axios.post(`${BaseUrl}/assignments/68c7fef2744cc5f3510b59be/attempt`, payload, axiosAuth);
      } catch (err) {
        // Fallback to selected assignment id
        res = await axios.post(`${BaseUrl}/assignments/${id}/attempt`, payload, axiosAuth);
      }
      const data = res.data || {};
      setAttemptResult(data);
      const nextStatus = { ...attemptStatus, [id]: { passed: !!data.passed, attemptNumber: data.attemptNumber, score: data.score, cutoff: active?.cutoff ?? 0 } };
      setAttemptStatus(nextStatus);
      localStorage.setItem('assignmentAttemptStatus', JSON.stringify(nextStatus));
      toast.dismiss();
      toast[data.passed ? 'success' : 'error'](`${data.message || (data.passed ? 'Assignment passed' : 'Assignment failed')} • Score: ${data.score}`);
      fetchAssignments();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const calcProgress = () => {
    if (!active?.questions?.length) return 0;
    const answered = Object.keys(answers).length;
    return Math.round((answered / active.questions.length) * 100);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box
        sx={{
          maxWidth: '1800px',
          margin: '0 auto',
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          style={{ position: 'absolute', bottom: -80, left: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Assignments
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '800px' }}>
            Attempt available assignments and view your scores.
          </Typography>
        </Box>
      </Box>
      {assignments?.length ? (
        <Box sx={{
          boxSizing: 'border-box',
          px: { xs: 1, sm: 2 },
          mx: 'auto',
          width: '100%',
          maxWidth: { xs: '100%', md: '1200px' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          alignItems: 'stretch',
          gap: { xs: 1.5, sm: 2 }
        }}>
          {(assignments || []).map((a) => {
            const id = a._id || a.id;
            const status = attemptStatus[id];
            const cutoff = a.cutoff ?? status?.cutoff ?? 0;
            const isPassedCard = status?.passed || (typeof a.score === 'number' && a.score >= cutoff);
            return (
            <Box key={id}>
              <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                <Paper
                  onClick={() => { if (!isPassedCard) startAttempt(a); }}
                  sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, cursor: isPassedCard ? 'default' : 'pointer', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', minHeight: { xs: 140, sm: 150 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ minWidth: 0, flex: '1 1 60%' }}>
                      <Typography variant="h6" fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip size="small" label={`Questions: ${typeof a.questionsCount === 'number' ? a.questionsCount : (a.questions?.length || 0)}`} />
                        <Chip size="small" label={`Cutoff: ${a.cutoff ?? 0}`} />
                        {typeof a.isActive === 'boolean' && (
                          <Chip size="small" label={a.isActive ? 'Active' : 'Inactive'} />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, alignItems: 'center' }}>
                      {(() => {
                        const id = a._id || a.id;
                        const status = attemptStatus[id];
                        const cutoff = a.cutoff ?? status?.cutoff ?? 0;
                        const isPassed = status?.passed || (typeof a.score === 'number' && a.score >= cutoff);
                        if (isPassed) {
                          const score = (status?.score ?? a.score);
                          return (
                            <>
                              {typeof score === 'number' && (
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>Score: {score}</Typography>
                              )}
                              <Chip
                                color="success"
                                label="Passed"
                                sx={{ fontWeight: 600 }}
                              />
                            </>
                          );
                        }
                        if (status && status.passed === false) {
                          return (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ borderRadius: '10px', textTransform: 'none' }}
                              onClick={(e) => { e.stopPropagation(); startAttempt(a); }}
                            >
                              Reattempt
                            </Button>
                          );
                        }
                        return (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ borderRadius: '10px', textTransform: 'none' }}
                            onClick={(e) => { e.stopPropagation(); startAttempt(a); }}
                          >
                            Attempt
                          </Button>
                        );
                      })()}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: '10px', textTransform: 'none' }}
                      onClick={(e) => { e.stopPropagation(); openAssignmentReport(a); }}
                    >
                      Report
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          );})}
        </Box>
      ) : (
        !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                width: '100%'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(49,17,136,0.12), rgba(10,8,30,0.06))',
                  border: '1px solid rgba(49,17,136,0.18)'
                }}>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#311188' }}>A</Typography>
                </Box>
                <Typography variant="h6" fontWeight={700}>No assignments available</Typography>
                <Typography variant="body2" sx={{ maxWidth: 520, opacity: 0.8 }}>
                  There are no assignments assigned to you yet. Check back later or refresh to see new updates.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={fetchAssignments}
                  sx={{ borderRadius: '12px', textTransform: 'none', px: 3 }}
                >
                  Refresh
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )
      )}

      {/* Exam modal removed; navigation now opens a dedicated page */}
      <Dialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.98)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{reportAssignment?.title || 'Assignment Report'}</DialogTitle>
        <DialogContent dividers>
          {(() => {
            const attempts = reportAssignment?.attempts || [];
            if (!attempts.length) {
              return (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  No attempts yet.
                </Typography>
              );
            }
            const sorted = attempts.slice().sort((a, b) => {
              const na = typeof a.attemptNumber === 'number' ? a.attemptNumber : 0;
              const nb = typeof b.attemptNumber === 'number' ? b.attemptNumber : 0;
              return nb - na;
            });
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {sorted.map((att, idx) => (
                  <Paper key={idx} sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>Attempt #{att.attemptNumber}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {att.submittedAt ? new Date(att.submittedAt).toLocaleString() : '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={`Score: ${att.score ?? '—'}`} />
                      <Chip color={att.passed ? 'success' : 'error'} label={att.passed ? 'Passed' : 'Failed'} />
                    </Box>
                  </Paper>
                ))}
              </Box>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: '10px', textTransform: 'none' }} onClick={() => setOpenReport(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAssignments;


