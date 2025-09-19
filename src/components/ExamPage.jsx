import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, RadioGroup, FormControlLabel, Radio, TextField, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel as MuiFormControlLabel, CircularProgress, Divider, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({}); // questionId -> answer (string for MCQ/TrueFalse/ShortAnswer/Blank, array for MAQ)
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // {message, score, passed, attemptNumber}
  const [showInstructions, setShowInstructions] = useState(true);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [starting, setStarting] = useState(false);

  const axiosAuth = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/assignments/${id}`, axiosAuth);
        setExam(res.data || {});
      } catch (e) {
        console.error(e);
        toast.error(e.response?.data?.message || 'Failed to load exam');
      } finally {}
    };
    loadExam();
  }, [id, axiosAuth]);

  const calcProgress = () => {
    if (!exam?.questions?.length) return 0;
    const answered = exam.questions.filter(q => {
      const answer = answers[q._id || q.id];
      if (q.type === 'MAQ') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer && answer.toString().trim() !== '';
    }).length;
    return Math.round((answered / exam.questions.length) * 100);
  };

  // Helper function to handle MAQ checkbox changes
  const handleMAQChange = (questionId, option, checked) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        // Add option if not already selected
        if (!currentAnswers.includes(option)) {
          return { ...prev, [questionId]: [...currentAnswers, option] };
        }
      } else {
        // Remove option if unchecked
        return { ...prev, [questionId]: currentAnswers.filter(ans => ans !== option) };
      }
      return prev;
    });
  };

  const submitExam = async () => {
    try {
      setSubmitting(true);
      const answersPayload = (exam?.questions || []).map((q) => {
        const qid = q._id || q.id;
        if (q.type === 'MAQ') {
          const raw = Array.isArray(answers[qid]) ? answers[qid] : [];
          // Keep exact labels; trim whitespace; unique
          const cleaned = raw
            .map((v) => (v ?? '').toString().trim())
            .filter((v) => v.length > 0);
          const uniq = Array.from(new Set(cleaned));
          return { questionId: qid, answer: uniq };
        }
        const val = answers[qid];
        if (q.type === 'ShortAnswer' || q.type === 'Blank') {
          const str = (val ?? '').toString().trim().toLowerCase();
          return { questionId: qid, answer: str };
        }
        // MCQ/TrueFalse: keep exact option label
        const str = (val ?? '').toString().trim();
        return { questionId: qid, answer: str };
      }).filter((entry) => {
        // Include only answered questions per backend sample
        if (Array.isArray(entry.answer)) return entry.answer.length > 0;
        return entry.answer !== '';
      });
      const payload = { answers: answersPayload };
      let res;
      try {
        // Try fixed endpoint first per backend requirement
        res = await axios.post(`${BaseUrl}/assignments/68cbcfb4ebacbf0fd8aab71a/attempt`, payload, axiosAuth);
      } catch (err) {
        // Fallback to dynamic id
        res = await axios.post(`${BaseUrl}/assignments/${id}/attempt`, payload, axiosAuth);
      }
      const data = res.data || {};
      setResult(data);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const handleSubmit = () => setConfirmOpen(true);

  // Simple pie-like chart using conic-gradient without extra deps
  const ScorePie = ({ score = 0, total = 0 }) => {
    const safeTotal = Math.max(0, Number(total) || 0);
    const safeScore = Math.max(0, Number(score) || 0);
    const fraction = safeTotal > 0 ? Math.min(1, safeScore / safeTotal) : 0;
    const degrees = fraction * 360;
    const gradient = `conic-gradient(#10b981 ${degrees}deg, #e5e7eb 0)`;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: gradient,
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'white',
            display: 'grid',
            placeItems: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <Typography variant="h5" fontWeight={800}>{safeScore}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Score</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading || starting) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '100vh', p: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <CircularProgress size={88} thickness={4} />
          <Box sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(#6366f1 0deg, transparent 120deg)'
          }} />
        </Box>
        <Typography sx={{ mt: 2, fontWeight: 600, opacity: 0.8 }}>{starting ? 'Preparing your exam…' : 'Loading…'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '1000px', mx: 'auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      {!showInstructions && !result && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={800}>{exam?.title || 'Exam'}</Typography>
          <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderRadius: '10px', textTransform: 'none' }}>Back</Button>
        </Box>
      )}

      {showInstructions && !result && (
        <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
          <Box sx={{
            px: { xs: 3, sm: 4 },
            py: 3,
            background: 'linear-gradient(135deg, rgba(49,17,136,0.95) 0%, rgba(10,8,30,0.95) 100%)',
            color: 'white',
            position: 'relative'
          }}>
            <Chip label="Instructions" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
            <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>Exam Guidelines</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Please read before starting</Typography>
            <Box sx={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          </Box>
          <Box sx={{ p: { xs: 3, sm: 4 }, background: 'rgba(255,255,255,0.98)' }}>
            <Box component="ul" sx={{ pl: 3, lineHeight: 1.9, mb: 0, listStyleType: 'disc', listStylePosition: 'outside', '& li': { display: 'list-item', marginBottom: 0.75 } }}>
              {(exam?.instructions && Array.isArray(exam.instructions) ? exam.instructions : [
                'Ensure a stable internet connection before starting the exam.',
                'Do not refresh or navigate away during the exam.',
                'Each question may have a single correct answer unless specified.',
                'Your answers are saved when you submit the exam.',
              ]).map((text, i) => (
                <li key={i}><Typography>{text}</Typography></li>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <MuiFormControlLabel
              control={<Checkbox checked={acceptedRules} onChange={(e) => setAcceptedRules(e.target.checked)} />}
              label="I have read and agree to the exam instructions"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderRadius: '10px', textTransform: 'none' }}>Cancel</Button>
              <Button
                variant="contained"
                disabled={!acceptedRules}
                onClick={() => {
                  setStarting(true);
                  setTimeout(() => {
                    setStarting(false);
                    setShowInstructions(false);
                  }, 5000);
                }}
                sx={{ borderRadius: '10px', textTransform: 'none' }}
              >
                Start Exam
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {!showInstructions && !result && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>{exam?.description}</Typography>
          {exam?.questions?.map((q, i) => (
            <Box key={q._id || i} sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography fontWeight={600}>{i + 1}. {q.text}</Typography>
                {typeof q.marks === 'number' && <Chip size="small" label={`Marks: ${q.marks}`} />}
              </Box>
              {(['MCQ','TrueFalse'].includes(q.type)) ? (
                <RadioGroup
                  value={answers[q._id || q.id] ?? ''}
                  onChange={(e) => setAnswers({ ...answers, [q._id || q.id]: e.target.value })}
                >
                  {(q.options || []).map((opt, oi) => (
                    <FormControlLabel key={oi} value={opt} control={<Radio />} label={opt} />
                  ))}
                </RadioGroup>
              ) : q.type === 'MAQ' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {(q.options || []).map((opt, oi) => (
                    <MuiFormControlLabel
                      key={oi}
                      control={
                        <Checkbox
                          checked={(answers[q._id || q.id] || []).includes(opt)}
                          onChange={(e) => handleMAQChange(q._id || q.id, opt, e.target.checked)}
                        />
                      }
                      label={opt}
                    />
                  ))}
                </Box>
              ) : (
                <TextField
                  fullWidth
                  placeholder={q.type === 'Blank' ? 'Enter the missing value' : 'Type your answer'}
                  value={answers[q._id || q.id] ?? ''}
                  onChange={(e) => setAnswers({ ...answers, [q._id || q.id]: e.target.value })}
                />
              )}
            </Box>
          ))}

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Progress: {calcProgress()}%</Typography>
            {Array.isArray(exam?.questions) && (
              <Chip size="small" color="primary" label={`Total Marks: ${exam.questions.reduce((s,q)=> s + (Number(q?.marks)||0), 0)}`} />
            )}
          </Box>
          <LinearProgress variant="determinate" value={calcProgress()} sx={{ mt: 1 }} />

          <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button onClick={() => setConfirmOpen(false)} sx={{ borderRadius: '10px', textTransform: 'none' }}>Review</Button>
            <LoadingButton loading={submitting} variant="contained" onClick={handleSubmit} sx={{ borderRadius: '10px', textTransform: 'none' }}>
              Submit Exam
            </LoadingButton>
          </Box>
        </Paper>
      )}

      {!loading && result && (
        <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Your Result</Typography>
          <ScorePie
            score={result?.score ?? 0}
            total={typeof result?.totalMarks === 'number'
              ? result.totalMarks
              : (Array.isArray(exam?.questions) ? exam.questions.reduce((s,q)=> s + (Number(q?.marks)||0), 0) : 0)}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/assignments')} sx={{ borderRadius: '10px', textTransform: 'none' }}>Back to Assignments</Button>
          </Box>
        </Paper>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Submit Exam?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to submit your answers?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <LoadingButton loading={submitting} variant="contained" onClick={submitExam}>Submit</LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamPage;


