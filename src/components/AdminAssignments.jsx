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

  Chip,

  Divider,

  FormControl,

  InputLabel,

  Select,

  MenuItem,

  Tabs,
  Tab,
  Pagination,
  Autocomplete,
} from '@mui/material';

import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Assignment as AssignmentIcon, Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import axios from 'axios';

import BaseUrl from '../Api';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';


const emptyAssignment = {

  title: '',

  description: '',

  cutoff: '',

  questions: [

    { text: '', type: 'MCQ', options: [''], correctAnswer: '', marks: 1 }

  ],

};



const AdminAssignments = () => {

  const token = localStorage.getItem('token');



  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [openEditor, setOpenEditor] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyAssignment);

  
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [reports, setReports] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [reportPage, setReportPage] = useState(1);
  const [reportPageSize, setReportPageSize] = useState(10);
  const [openAttempts, setOpenAttempts] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [attemptsSearch, setAttemptsSearch] = useState('');

  // Employees and per-employee status (for Report tab)
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [statusData, setStatusData] = useState(null); // { completedAssignments: [], remainingAssignments: [] }
  const [statusLoading, setStatusLoading] = useState(false);

  // Computed total marks based on question marks
  const totalMarks = useMemo(() => {
    try {
      return (form?.questions || []).reduce((sum, q) => sum + (Number(q?.marks) || 0), 0);
    } catch {
      return 0;
    }
  }, [form?.questions]);


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


  const fetchReport = async () => {
    try {
      setReportLoading(true);
      const res = await axios.get(`${BaseUrl}/assignments/68c7fef2744cc5f3510b59be/report`, axiosAuth);
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load report');
    } finally {
      setReportLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const res = await axios.get(`${BaseUrl}/employees/`, axiosAuth);
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load employees');
    } finally {
      setEmployeesLoading(false);
    }
  };

  const fetchEmployeeStatus = async (employeeId) => {
    if (!employeeId) return;
    try {
      setStatusLoading(true);
      const res = await axios.get(`${BaseUrl}/assignments/status/${employeeId}`, axiosAuth);
      setStatusData(res.data || null);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load employee status');
    } finally {
      setStatusLoading(false);
    }
  };

  const openAssignmentAttempts = async (assignmentId) => {
    try {
      setAttemptsLoading(true);
      const res = await axios.get(`${BaseUrl}/assignments/${assignmentId}/attempts`, axiosAuth);
      setAttempts(Array.isArray(res.data) ? res.data : []);
      setOpenAttempts(true);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load attempts');
    } finally {
      setAttemptsLoading(false);
    }
  };


  const openCreate = () => {

    setEditingId(null);

    setForm({ ...emptyAssignment, questions: [{ text: '', type: 'MCQ', options: [''], correctAnswer: '', marks: 1 }] });

    setOpenEditor(true);

  };



  const openEdit = (assignment) => {

    setEditingId(assignment._id || assignment.id);

    setForm({

      title: assignment.title || '',

      description: assignment.description || '',

      cutoff: (typeof assignment.cutoff === 'number' ? assignment.cutoff : ''),

      questions: assignment.questions?.length ? assignment.questions : [{ text: '', type: 'MCQ', options: [''], correctAnswer: '', marks: 1 }],

    });

    setOpenEditor(true);

  };



  const handleSave = async () => {

    try {

      setSaving(true);

      const payload = { ...form, totalMarks };

      if (editingId) {

        // Try fixed endpoint first; if not found, fall back to the specific editingId
        try {
          await axios.put(`${BaseUrl}/assignments/68c8f328e7a39f613b3d42cb`, payload, axiosAuth);
          toast.success('Assignment updated');
        } catch (err) {
          if (err?.response?.status === 404) {
        await axios.put(`${BaseUrl}/assignments/${editingId}`, payload, axiosAuth);

        toast.success('Assignment updated');

          } else {
            throw err;
          }
        }
      } else {

        await axios.post(`${BaseUrl}/assignments`, payload, axiosAuth);

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

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      // Try fixed endpoint first; if not found, delete the clicked assignment
      try {
        await axios.delete(`${BaseUrl}/assignments/68c7eb53c3b4559e9950ebcd`, axiosAuth);
        toast.success('Assignment deleted');
      } catch (err) {
        if (err?.response?.status === 404) {
      await axios.delete(`${BaseUrl}/assignments/${assignmentId}`, axiosAuth);

      toast.success('Assignment deleted');

        } else {
          throw err;
        }
      }
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


  const handleOpenDetails = async (assignmentId) => {
    try {
      setDetailsLoading(true);
      const res = await axios.get(`${BaseUrl}/assignments/${assignmentId}`, axiosAuth);
      setDetails(res.data);
      setOpenDetails(true);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load assignment details');
    } finally {
      setDetailsLoading(false);
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

      questions: [...(prev.questions || []), { text: '', type: 'MCQ', options: [''], correctAnswer: '', marks: 1 }],

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

      if (q.type === 'MAQ') {
        // For MAQ, keep only remaining correct answers
        const current = Array.isArray(q.correctAnswer) ? q.correctAnswer : (q.correctAnswer ? [q.correctAnswer] : []);
        q.correctAnswer = current.filter((ans) => q.options.includes(ans));
      } else if (q.type === 'MCQ' || q.type === 'TrueFalse') {
        if (!q.options.includes(q.correctAnswer)) {
          q.correctAnswer = q.options[0] || '';
        }
      }

      next.questions = [...next.questions];

      next.questions[qIndex] = q;

      return next;

    });

  };



  const handleQuestionTypeChange = (qIndex, newType) => {

    setForm((prev) => {

      const next = { ...prev };

      const q = { ...next.questions[qIndex] };

      q.type = newType;

      if (newType === 'TrueFalse') {

        q.options = ['True', 'False'];

        q.correctAnswer = 'True';

      } else if (newType === 'MCQ') {

        q.options = q.options?.length ? q.options : [''];

        q.correctAnswer = q.options[0] || '';

      } else if (newType === 'MAQ') {

        q.options = q.options?.length ? q.options : [''];
        // Initialize as array; keep only valid answers
        const current = Array.isArray(q.correctAnswer) ? q.correctAnswer : (q.correctAnswer ? [q.correctAnswer] : []);
        q.correctAnswer = current.filter((ans) => q.options.includes(ans));

      } else {

        q.options = [];

        q.correctAnswer = '';

      }

      next.questions = [...next.questions];

      next.questions[qIndex] = q;

      return next;

    });

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

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>

            Manage Assignments

          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '800px' }}>

            Create, edit, and manage assignments. Review submissions and performance.

          </Typography>

        </Box>

        <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'flex-start' } }}>
          <Tabs
            value={currentTab}
            onChange={(_, v) => { setCurrentTab(v); if (v === 1) fetchReport(); }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: { xs: '40px', sm: '48px' },
              '& .MuiTab-root': {
                minHeight: { xs: '40px', sm: '48px' },
                fontSize: { xs: '12px', sm: '14px' },
                textTransform: 'none',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                mr: 1,
              },
              '& .MuiTabs-indicator': {
                height: 3,
                background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)'
              }
            }}
          >
            <Tab label="All Assignments" />
            <Tab label="Report" />
          </Tabs>
        </Box>
      </Box>

      {/* Search/Create and Employee dropdown row (stacked) */}
      <Box sx={{ maxWidth: '1800px', mx: 'auto', px: { xs: 1, sm: 2 }, mb: 2 }}>
        {/* Top row: search + create for All Assignments */}
        {currentTab === 0 && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
            <TextField
              placeholder="Search assignments..."
              value={assignmentSearch}
              onChange={(e) => setAssignmentSearch(e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
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
              Create Assignment
            </Button>
          </Box>
        )}
        {/* Second row: employee dropdown in Report tab, placed just below */}
        {currentTab === 1 && (
          <Box sx={{ mt: 1.5, position: 'relative', zIndex: 5, width: { xs: '100%', sm: 420, md: 520 } }}>
            <Autocomplete
              size="small"
              fullWidth
              loading={employeesLoading}
              options={employees || []}
              onOpen={() => { if (!employees?.length) fetchEmployees(); }}
              value={(employees || []).find((e) => (e._id || e.id) === selectedEmployeeId) || null}
              onChange={(_, val) => {
                const id = val ? (val._id || val.id) : '';
                setSelectedEmployeeId(id);
                if (id) fetchEmployeeStatus(id);
              }}
              getOptionLabel={(opt) => (opt?.name ? `${opt.name}${opt.email ? ` • ${opt.email}` : ''}` : '')}
              isOptionEqualToValue={(a, b) => (a?._id || a?.id) === (b?._id || b?.id)}
              renderInput={(params) => (
                <TextField {...params} label="Search an employee" placeholder="Type name or email" />
              )}
            />
          </Box>
        )}
      </Box>


      {currentTab === 0 && (assignments || []).filter((a) => (a.title || '').toLowerCase().includes(assignmentSearch.toLowerCase()) || (a.description || '').toLowerCase().includes(assignmentSearch.toLowerCase())).length ? (
        <Box sx={{
          boxSizing: 'border-box',
          px: { xs: 1, sm: 2 },
          mx: 'auto',
          width: '100%',
          maxWidth: { xs: '100%', md: '1200px' },
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))'
          },
          alignItems: 'stretch',
          gap: { xs: 1.5, sm: 2 },
          overflowX: 'hidden'
        }}>
          {(assignments || [])
            .filter((a) => (a.title || '').toLowerCase().includes(assignmentSearch.toLowerCase()) || (a.description || '').toLowerCase().includes(assignmentSearch.toLowerCase()))
            .map((a) => (
            <Box key={a._id || a.id} sx={{ width: '100%' }}>
              <Paper onClick={() => handleOpenDetails(a._id || a.id)} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, cursor: 'pointer', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', minHeight: { xs: 140, sm: 150 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                  <Box sx={{ minWidth: 0, flex: '1 1 60%' }}>
                    <Typography variant="h6" fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.0, flexWrap: 'wrap', minWidth: 0 }}>
                      <Chip size="small" label={`Questions: ${a.questions?.length || 0}`} />

                      <Chip size="small" label={`Cutoff: ${typeof a.cutoff === 'number' ? a.cutoff : '—'}`} />

                      {typeof a.isActive === 'boolean' && (

                        <Chip size="small" label={a.isActive ? 'Active' : 'Inactive'} />

                      )}

                    </Box>

                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton onClick={() => openEdit(a)}><EditIcon /></IconButton>

                    <IconButton color="error" onClick={() => handleDelete(a._id || a.id)}><DeleteIcon /></IconButton>

                  </Box>

                </Box>

                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                  <Button size="small" variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none' }} onClick={() => openAssignmentAttempts(a._id || a.id)}>Report</Button>
                </Box>
              </Paper>

            </Box>
          ))}

        </Box>
      ) : currentTab === 0 ? (
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

      ) : (
        <Box sx={{ boxSizing: 'border-box', px: { xs: 1, sm: 2 }, mx: 'auto', width: '100%', maxWidth: { xs: '100%', md: '1200px' } }}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,255,255,0.98))', backdropFilter: 'blur(14px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
              <Typography variant="h6" fontWeight={800}>Employee Assignment Report</Typography>
              {selectedEmployeeId && (
                <Chip color="primary" variant="outlined" label={(employees || []).find(e => (e._id || e.id) === selectedEmployeeId)?.name || ''} />
              )}
            </Box>

            {!selectedEmployeeId && (
              <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed #e5e7eb', borderRadius: 2, background: 'rgba(99,102,241,0.04)' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>Select an employee to view their report</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Use the dropdown above to choose an employee. You’ll see completed and remaining assignments here.</Typography>
              </Box>
            )}

            {selectedEmployeeId && (
              <Box>
                {statusLoading ? (
                  <Typography>Loading employee report…</Typography>
                ) : !statusData ? (
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>No data available.</Typography>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Paper sx={{ p: 2, borderRadius: 2, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="subtitle1" fontWeight={800}>Completed</Typography>
                          <Chip color="success" label={(statusData.completedAssignments || []).length} />
                        </Box>
                        <List dense>
                          {(statusData.completedAssignments || []).map((a) => (
                            <Box key={a._id} sx={{ mb: 1.25, p: 1.25, borderRadius: 2, border: '1px solid #e5e7eb', background: 'white' }}>
                              <Typography sx={{ fontWeight: 700 }}>{a.title}</Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>{a.description}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.75 }}>
                                <Chip size="small" label={`Cutoff: ${typeof a.cutoff === 'number' ? a.cutoff : '—'}`} />
                                <Chip size="small" label={`Questions: ${a.questions?.length || 0}`} />
                                {typeof a.totalMarks === 'number' && <Chip size="small" color="primary" label={`Total: ${a.totalMarks}`} />}
                              </Box>
                            </Box>
                          ))}
                          {!(statusData.completedAssignments || []).length && (
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>No completed assignments.</Typography>
                          )}
                        </List>
                      </Paper>
                    </Box>
                    <Box>
                      <Paper sx={{ p: 2, borderRadius: 2, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="subtitle1" fontWeight={800}>Remaining</Typography>
                          <Chip color="primary" label={(statusData.remainingAssignments || []).length} />
                        </Box>
                        <List dense>
                          {(statusData.remainingAssignments || []).map((a) => (
                            <Box key={a._id} sx={{ mb: 1.25, p: 1.25, borderRadius: 2, border: '1px solid #e5e7eb', background: 'white' }}>
                              <Typography sx={{ fontWeight: 700 }}>{a.title}</Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>{a.description}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.75 }}>
                                <Chip size="small" label={`Cutoff: ${typeof a.cutoff === 'number' ? a.cutoff : '—'}`} />
                                <Chip size="small" label={`Questions: ${a.questions?.length || 0}`} />
                                {typeof a.totalMarks === 'number' && <Chip size="small" color="primary" label={`Total: ${a.totalMarks}`} />}
                              </Box>
                            </Box>
                          ))}
                          {!(statusData.remainingAssignments || []).length && (
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>No pending assignments.</Typography>
                          )}
                        </List>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      )}

      <Dialog open={openEditor} onClose={() => setOpenEditor(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)', color: 'white', py: 2, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ color: 'white' }}>{editingId ? 'Edit Assignment' : 'Create Assignment'}</Typography>
            <IconButton onClick={() => setOpenEditor(false)} size="small">
              <CloseIcon className='text-white' />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2}>

            <Grid item xs={12} md={12}>
              <TextField

                label="Title"

                fullWidth

                value={form.title}

                onChange={(e) => setForm({ ...form, title: e.target.value })}

                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField

                label="Description"

                fullWidth

                multiline

                rows={3}

                value={form.description}

                onChange={(e) => setForm({ ...form, description: e.target.value })}

                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField

                label="Total Marks"

                fullWidth

                value={totalMarks}

                disabled

                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

            </Grid>

            <Grid item xs={12} md={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>

                <Typography variant="subtitle1" fontWeight={600}>Questions</Typography>

              </Box>

              <List dense>

                {(form.questions || []).map((q, qi) => (

                  <Box key={qi} sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid #eee', background: 'rgba(255,255,255,0.9)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip size="small" label={`Q${qi + 1}`} />
                      <Button size="small" color="error" onClick={() => removeQuestion(qi)}>Remove</Button>

                    </Box>

                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                    <TextField

                      label="Question Text"

                      fullWidth

                      value={q.text}

                      onChange={(e) => updateQuestion(qi, { text: e.target.value })}

                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>

                          <InputLabel>Type</InputLabel>

                          <Select

                            label="Type"

                            value={q.type}

                            onChange={(e) => handleQuestionTypeChange(qi, e.target.value)}

                            sx={{ borderRadius: '10px' }}
                          >

                            <MenuItem value="MCQ">MCQ</MenuItem>

                            <MenuItem value="MAQ">MAQ</MenuItem>

                            <MenuItem value="TrueFalse">True/False</MenuItem>

                            <MenuItem value="ShortAnswer">Short Answer</MenuItem>

                            <MenuItem value="Blank">Blank</MenuItem>

                          </Select>

                        </FormControl>

                      </Grid>

                      <Grid item xs={6}>
                        <TextField

                          label="Marks"

                          type="number"

                          fullWidth

                          value={q.marks ?? 1}

                          onChange={(e) => updateQuestion(qi, { marks: Number(e.target.value) })}

                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        />

                      </Grid>

                    </Grid>

                    {(q.type === 'MCQ' || q.type === 'MAQ' || q.type === 'TrueFalse') && (

                      <Box sx={{ mt: 1 }}>
                        <Divider sx={{ my: 1 }} />

                        <Typography variant="caption">Options</Typography>

                        <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        {(q.options || []).map((opt, oi) => (

                            <Grid key={oi} item xs={12} sm={q.type === 'TrueFalse' ? 6 : 12}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField

                              fullWidth

                              value={opt}

                              onChange={(e) => updateOption(qi, oi, e.target.value)}

                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                            />

                            <Button

                              variant={(q.type === 'MAQ'
                                ? (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt))
                                : (q.correctAnswer === opt)) ? 'contained' : 'outlined'}

                              onClick={() => {
                                if (q.type === 'MAQ') {
                                  const current = Array.isArray(q.correctAnswer) ? q.correctAnswer : (q.correctAnswer ? [q.correctAnswer] : []);
                                  const set = new Set(current);
                                  if (set.has(opt)) set.delete(opt); else set.add(opt);
                                  updateQuestion(qi, { correctAnswer: Array.from(set) });
                                } else {
                                  updateQuestion(qi, { correctAnswer: opt });
                                }
                              }}

                                  sx={{ borderRadius: '10px' }}
                            >

                              Correct

                            </Button>

                            {(q.type === 'MCQ' || q.type === 'MAQ') && (

                                  <Button color="error" onClick={() => removeOption(qi, oi)} sx={{ borderRadius: '10px' }}>Del</Button>
                            )}

                          </Box>

                            </Grid>
                        ))}

                        </Grid>
                        {(q.type === 'MCQ' || q.type === 'MAQ') && (

                          <Button size="small" sx={{ mt: 1 }} onClick={() => addOption(qi)}>Add Option</Button>

                        )}

                      </Box>
                    )}

                    {(q.type === 'ShortAnswer' || q.type === 'Blank') && (

                      <TextField

                        sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        label="Correct Answer"

                        fullWidth

                        value={q.correctAnswer}

                        onChange={(e) => updateQuestion(qi, { correctAnswer: e.target.value })}

                      />

                    )}

                  </Box>

                ))}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="small" variant="outlined" onClick={addQuestion} sx={{ borderRadius: '10px' }}>Add Question</Button>
                </Box>
              </List>

            </Grid>

            {/* Cutoff under questions */}
            <Grid item xs={12} md={12}>
              <Divider sx={{ my: 1.5 }} />
              <TextField
                label="Cutoff"
                type="number"
                fullWidth
                value={form.cutoff ?? ''}
                onChange={(e) => setForm({ ...form, cutoff: Number(e.target.value) })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>

          </Grid>

        </DialogContent>

        <DialogActions sx={{ p: 3, background: 'linear-gradient(135deg, rgba(249,250,251,0.9), rgba(255,255,255,0.9))' }}>
          <Button onClick={() => setOpenEditor(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <LoadingButton loading={saving} variant="contained" onClick={handleSave} sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)', '&:hover': { background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)' } }}>Save</LoadingButton>
        </DialogActions>
      </Dialog>

      

      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)', color: 'white', py: 2.5, px: 3 }}>
          {details?.title || 'Assignment Details'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {detailsLoading ? (
            <Typography>Loading...</Typography>
          ) : details ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{details.description}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`Cutoff: ${typeof details.cutoff === 'number' ? details.cutoff : '—'}`} />
                {typeof details.isActive === 'boolean' && (
                  <Chip label={details.isActive ? 'Active' : 'Inactive'} />
                )}
                <Chip label={`Questions: ${details.questions?.length || 0}`} />
                <Chip label={`Assigned: ${details.assignedTo?.length || 0}`} />
              </Box>
              <Divider sx={{ my: 2 }} />
              <List dense>
                {(details.questions || []).map((q, i) => (
                  <Box key={i} sx={{ mb: 1.5, p: 1.5, border: '1px solid #eee', borderRadius: 2 }}>
                    <Typography variant="subtitle2">Q{i + 1}: {q.text}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      <Chip size="small" label={q.type} />
                      <Chip size="small" label={`Marks: ${q.marks ?? 1}`} />
                      {q.correctAnswer && (
                        <Chip size="small" color="success" label={`Answer: ${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}`} />
                      )}
                    </Box>
                    {!!q.options?.length && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption">Options:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                          {q.options.map((o, oi) => (
                            <Chip key={oi} size="small" label={o} />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </List>
            </Box>
          ) : (
            <Typography variant="body2">No details available</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setOpenDetails(false)} sx={{ borderRadius: '10px' }}>Close</Button>
        </DialogActions>

      </Dialog>



      {/* Attempts Modal */}
      <Dialog open={openAttempts} onClose={() => setOpenAttempts(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)', color: 'white', py: 2, px: 2 }}>
          Assignment Attempts
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {attemptsLoading ? (
            <Typography>Loading...</Typography>
          ) : (
          <>
            <Box sx={{ mb: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search attempts by name, email, score or status..."
                value={attemptsSearch}
                onChange={(e) => setAttemptsSearch(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>
            <List dense>
              {(attempts || [])
                .filter((t) => {
                  const q = (attemptsSearch || '').toLowerCase();
                  if (!q) return true;
                  const name = (t.employee?.name || '').toLowerCase();
                  const email = (t.employee?.email || '').toLowerCase();
                  const score = typeof t.score === 'number' ? String(t.score) : '';
                  const status = t.passed ? 'passed' : 'failed';
                  return name.includes(q) || email.includes(q) || score.includes(q) || status.includes(q);
                })
                .map((t) => (
                <Box key={t._id} sx={{ mb: 1.5, p: { xs: 1, sm: 1.5 }, border: '1px solid #eee', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={t.employee?.name || 'User'} />
                      <Typography variant="body2" color="text.secondary">{t.employee?.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip color={t.passed ? 'success' : 'error'} label={t.passed ? 'Passed' : 'Failed'} />
                      <Chip label={`Score: ${t.score}`} />
                      <Chip label={`Attempt #${t.attemptNumber}`} />
                      <Typography variant="caption" color="text.secondary">{new Date(t.completedAt).toLocaleString()}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              {!attempts?.length && (
                <Typography variant="body2">No attempts yet.</Typography>
              )}
            </List>
          </>

          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setOpenAttempts(false)} sx={{ borderRadius: '10px' }}>Close</Button>
        </DialogActions>

      </Dialog>

    </Box>

  );

};



export default AdminAssignments;
