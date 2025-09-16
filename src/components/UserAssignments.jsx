import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, LinearProgress, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const UserAssignments = () => {
  const token = localStorage.getItem('token');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAttempt, setOpenAttempt] = useState(false);
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const axiosAuth = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl}/assignments/available`, axiosAuth);
      setAssignments(res.data || []);
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

  const startAttempt = (assignment) => {
    setActive(assignment);
    setAnswers({});
    setOpenAttempt(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = { answers };
      const id = active._id || active.id;
      const res = await axios.post(`${BaseUrl}/assignments/${id}/attempt`, payload, axiosAuth);
      toast.success('Submission successful');
      setOpenAttempt(false);
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
        <Grid container spacing={2}>
          {(assignments || []).map((a) => (
            <Grid item xs={12} md={6} key={a._id || a.id}>
              <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                <Paper sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                <Typography variant="h6" fontWeight={600}>{a.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>{a.description}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                  <Chip size="small" label={`Questions: ${a.questions?.length || 0}`} />
                  <Chip size="small" label={`Total: ${a.totalMarks ?? 0}`} />
                  {a.dueDate && <Chip size="small" color={new Date(a.dueDate) < new Date() ? 'error' : 'default'} label={`Due: ${new Date(a.dueDate).toLocaleString()}`} />}
                  {a.score != null && <Chip size="small" color="success" label={`Score: ${a.score}/${a.totalMarks ?? 0}`} />}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => startAttempt(a)}
                    disabled={a.submitted || (a.dueDate && new Date(a.dueDate) < new Date())}
                    sx={{ borderRadius: '12px', textTransform: 'none' }}
                  >
                    {a.submitted ? 'Submitted' : 'Attempt'}
                  </Button>
                  {a.resultUrl && (
                    <Button variant="outlined" sx={{ borderRadius: '12px', textTransform: 'none' }} onClick={() => window.open(a.resultUrl, '_blank')}>View Result</Button>
                  )}
                </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
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

      <Dialog
        open={openAttempt}
        onClose={() => setOpenAttempt(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle>{active?.title}</DialogTitle>
        <DialogContent dividers>
          {active?.questions?.map((q, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography fontWeight={600}>{i + 1}. {q.prompt}</Typography>
              <RadioGroup
                value={answers[i] ?? ''}
                onChange={(e) => setAnswers({ ...answers, [i]: Number(e.target.value) })}
              >
                {(q.options || []).map((opt, oi) => (
                  <FormControlLabel key={oi} value={oi} control={<Radio />} label={opt} />
                ))}
              </RadioGroup>
            </Box>
          ))}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Progress: {calcProgress()}%</Typography>
            <LinearProgress variant="determinate" value={calcProgress()} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: '12px', textTransform: 'none', px: 2.5 }} onClick={() => setOpenAttempt(false)}>Cancel</Button>
          <LoadingButton
            loading={submitting}
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)' }
            }}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAssignments;


