import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const emptyAssignment = {
  title: '',
  description: '',
  totalMarks: 100,
  questions: [
    // { prompt: '', options: [''], correctIndex: 0, marks: 1 }
  ],
  dueDate: '',
};

const AdminAssignments = () => {
  const token = localStorage.getItem('token');

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyAssignment);
  const [submissions, setSubmissions] = useState([]);
  const [openSubmissions, setOpenSubmissions] = useState(false);

  const axiosAuth = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl}/assignments`, axiosAuth);
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

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyAssignment, questions: [{ prompt: '', options: [''], correctIndex: 0, marks: 1 }] });
    setOpenEditor(true);
  };

  const openEdit = (assignment) => {
    setEditingId(assignment._id || assignment.id);
    setForm({
      title: assignment.title || '',
      description: assignment.description || '',
      totalMarks: assignment.totalMarks ?? 100,
      questions: assignment.questions?.length ? assignment.questions : [{ prompt: '', options: [''], correctIndex: 0, marks: 1 }],
      dueDate: assignment.dueDate ? assignment.dueDate.substring(0, 16) : '',
    });
    setOpenEditor(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${BaseUrl}/assignments/${editingId}`, form, axiosAuth);
        toast.success('Assignment updated');
      } else {
        await axios.post(`${BaseUrl}/assignments`, form, axiosAuth);
        toast.success('Assignment created');
      }
      setOpenEditor(false);
      fetchAssignments();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`${BaseUrl}/assignments/${assignmentId}`, axiosAuth);
      toast.success('Assignment deleted');
      fetchAssignments();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  const handleViewSubmissions = async (assignmentId) => {
    try {
      const res = await axios.get(`${BaseUrl}/assignments/${assignmentId}/submissions`, axiosAuth);
      setSubmissions(res.data || []);
      setOpenSubmissions(true);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load submissions');
    }
  };

  const updateQuestion = (index, updater) => {
    setForm((prev) => {
      const next = { ...prev };
      next.questions = [...(prev.questions || [])];
      next.questions[index] = { ...next.questions[index], ...updater };
      return next;
    });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), { prompt: '', options: [''], correctIndex: 0, marks: 1 }],
    }));
  };

  const removeQuestion = (index) => {
    setForm((prev) => ({
      ...prev,
      questions: (prev.questions || []).filter((_, i) => i !== index),
    }));
  };

  const updateOption = (qIndex, optIndex, value) => {
    setForm((prev) => {
      const next = { ...prev };
      const q = { ...next.questions[qIndex] };
      const options = [...(q.options || [])];
      options[optIndex] = value;
      q.options = options;
      next.questions = [...next.questions];
      next.questions[qIndex] = q;
      return next;
    });
  };

  const addOption = (qIndex) => {
    setForm((prev) => {
      const next = { ...prev };
      const q = { ...next.questions[qIndex] };
      q.options = [...(q.options || []), ''];
      next.questions = [...next.questions];
      next.questions[qIndex] = q;
      return next;
    });
  };

  const removeOption = (qIndex, optIndex) => {
    setForm((prev) => {
      const next = { ...prev };
      const q = { ...next.questions[qIndex] };
      q.options = (q.options || []).filter((_, i) => i !== optIndex);
      if (q.correctIndex >= q.options.length) q.correctIndex = 0;
      next.questions = [...next.questions];
      next.questions[qIndex] = q;
      return next;
    });
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
            Manage Assignments
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '800px' }}>
            Create, edit, and manage assignments. Review submissions and performance.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
            textTransform: 'none',
            px: 3,
            '&:hover': { background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)' }
          }}
        >
          New Assignment
        </Button>
      </Box>

      {assignments?.length ? (
        <Grid container spacing={2}>
          {(assignments || []).map((a) => (
            <Grid item xs={12} md={6} key={a._id || a.id}>
              <Paper sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>{a.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>{a.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                      <Chip size="small" label={`Questions: ${a.questions?.length || 0}`} />
                      <Chip size="small" label={`Total: ${a.totalMarks ?? 0}`} />
                      {a.dueDate && <Chip size="small" label={`Due: ${new Date(a.dueDate).toLocaleString()}`} />}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none' }} onClick={() => handleViewSubmissions(a._id || a.id)}>Submissions</Button>
                    <IconButton onClick={() => openEdit(a)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(a._id || a.id)}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              </Paper>
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
                position: 'relative',
                overflow: 'hidden',
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
                  <AssignmentIcon sx={{ color: '#311188' }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>No assignments yet</Typography>
                <Typography variant="body2" sx={{ maxWidth: 520, opacity: 0.8 }}>
                  Create your first assignment to get started. You can add questions, set marks and a due date, and start collecting submissions.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreate}
                  sx={{
                    mt: 1,
                    borderRadius: '12px',
                    textTransform: 'none',
                    px: 3,
                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)' }
                  }}
                >
                  Create Assignment
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )
      )}

      <Dialog open={openEditor} onClose={() => setOpenEditor(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Assignment' : 'New Assignment'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Title"
                fullWidth
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Due Date"
                type="datetime-local"
                fullWidth
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Total Marks"
                type="number"
                fullWidth
                value={form.totalMarks}
                onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>Questions</Typography>
                <Button size="small" onClick={addQuestion}>Add Question</Button>
              </Box>
              <List dense>
                {(form.questions || []).map((q, qi) => (
                  <Box key={qi} sx={{ mb: 2, p: 1.5, borderRadius: 1, border: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">Q{qi + 1}</Typography>
                      <Button size="small" color="error" onClick={() => removeQuestion(qi)}>Remove</Button>
                    </Box>
                    <TextField
                      label="Prompt"
                      fullWidth
                      value={q.prompt}
                      onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
                      sx={{ mt: 1 }}
                    />
                    <TextField
                      label="Marks"
                      type="number"
                      fullWidth
                      value={q.marks ?? 1}
                      onChange={(e) => updateQuestion(qi, { marks: Number(e.target.value) })}
                      sx={{ mt: 1 }}
                    />
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption">Options</Typography>
                    {(q.options || []).map((opt, oi) => (
                      <Box key={oi} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <TextField
                          fullWidth
                          value={opt}
                          onChange={(e) => updateOption(qi, oi, e.target.value)}
                        />
                        <Button
                          variant={q.correctIndex === oi ? 'contained' : 'outlined'}
                          onClick={() => updateQuestion(qi, { correctIndex: oi })}
                        >
                          Correct
                        </Button>
                        <Button color="error" onClick={() => removeOption(qi, oi)}>Del</Button>
                      </Box>
                    ))}
                    <Button size="small" sx={{ mt: 1 }} onClick={() => addOption(qi)}>Add Option</Button>
                  </Box>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditor(false)}>Cancel</Button>
          <LoadingButton loading={saving} variant="contained" onClick={handleSave}>Save</LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openSubmissions} onClose={() => setOpenSubmissions(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submissions</DialogTitle>
        <DialogContent dividers>
          <List dense>
            {(submissions || []).map((s, i) => (
              <ListItem key={i} sx={{ px: 0 }}>
                <ListItemText
                  primary={s.user?.name || s.userName || 'User'}
                  secondary={`Score: ${s.score ?? 0} / ${s.total ?? 0} • ${new Date(s.submittedAt || s.createdAt).toLocaleString()}`}
                />
                <ListItemSecondaryAction>
                  <Chip label={s.status || 'Submitted'} size="small" />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {!submissions?.length && (
              <Typography variant="body2">No submissions yet.</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmissions(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAssignments;


