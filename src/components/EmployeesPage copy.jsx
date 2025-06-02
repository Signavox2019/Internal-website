import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, TextField, InputAdornment, Card, CardContent,
    Avatar, Grid, Chip, IconButton, Tooltip, CircularProgress, Tabs, Tab,
    Fade, Zoom, Grow, useTheme, alpha, Button, Menu, MenuItem, Divider,
    ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, FormHelperText, Switch, FormControlLabel,
    Paper, Backdrop, Modal, Skeleton, Stack
} from '@mui/material';
import {
    Search, FilterList, Email, Badge, Work, Business, Bloodtype,
    MoreVert, Phone, LocationOn, LinkedIn, GitHub, Twitter, Instagram,
    Edit, Delete, AdminPanelSettings, People, Visibility, Close,
    CheckCircle, Cancel, ArrowBack, PersonAdd, Save, ContactMail
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import BaseUrl from '../Api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeesPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTeam, setFilterTeam] = useState('all');
    const [currentTab, setCurrentTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        employeeId: '',
        role: '',
        team: '',
        bloodGroup: '',
        status: 'Active',
        isAdmin: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Add new state for registration form
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        password: '',
        status: 'Active',
        role: '',
        team: 'Technical',
        employeeId: '',
        profile: '',
        bloodGroup: ''
    });

    // Add state for register modal
    const [registerOpen, setRegisterOpen] = useState(false);

    // Get token from localStorage
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isAdmin = userData.isAdmin || false;

    // Redirect non-admin users
    useEffect(() => {
        if (!isAdmin) {
            navigate('/welcome');
            toast.error("You don't have permission to access this page");
        }
    }, [isAdmin, navigate]);



    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12
            }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20
            }
        }
    };

    // Fetch employees data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                // Check if token exists
                if (!token) {
                    setError('Authentication token is missing. Please log in again.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${BaseUrl}/employees`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEmployees(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching employees:', err);
                // More specific error message based on status code
                if (err.response && err.response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    // Optionally redirect to login page
                    // window.location.href = '/login';
                } else {
                    setError('Failed to load employees data. Please try again later.');
                }
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchEmployees();
        }
    }, [token, isAdmin]);

    // Get unique teams for filtering
    const teams = ['Operations', 'Technical', 'Finance', 'Marketing', 'Other'];

    // Filter employees based on search term and team filter
    const filteredEmployees = employees.filter(employee => {
        if (!employee) return false; // Skip null employees

        const matchesSearch =
            (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTeam = filterTeam === 'all' || employee.team === filterTeam;

        // Filter by status based on current tab with null check
        const matchesStatus =
            (currentTab === 0) || // All employees
            (currentTab === 1 && employee.status === 'Active') || // Active employees
            (currentTab === 2 && employee.status && employee.status !== 'Active'); // Inactive employees with null check

        return matchesSearch && matchesTeam && matchesStatus;
    });

    // Handle menu open/close
    const handleMenuOpen = (event, employee) => {
        setAnchorEl(event.currentTarget);
        setSelectedEmployee(employee);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    // Get team color
    const getTeamColor = (team) => {
        switch (team) {
            case 'Operations': return '#3b82f6';
            case 'Technical': return '#8b5cf6';
            case 'Finance': return '#10b981';
            case 'Marketing': return '#f59e0b';
            case 'Other': return '#6b7280';
            default: return '#6b7280';
        }
    };

    // Get random gradient for cards
    const getGradient = (index) => {
        const gradients = [
            'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
            'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)'
        ];
        return gradients[index % gradients.length];
    };

    // Fetch employee details
    const fetchEmployeeDetails = async (id) => {
        try {
            setLoadingDetails(true);
            const response = await axios.get(`${BaseUrl}/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEmployeeDetails(response.data);
            setLoadingDetails(false);
            return response.data;
        } catch (err) {
            console.error('Error fetching employee details:', err);
            toast.error('Failed to load employee details');
            setLoadingDetails(false);
            return null;
        }
    };

    // Handle view details
    const handleViewDetails = async (employee) => {
        const details = await fetchEmployeeDetails(employee._id);
        if (details) {
            setDetailsOpen(true);
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!editForm.name.trim()) errors.name = 'Name is required';
        if (!editForm.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
            errors.email = 'Email is invalid';
        }
        if (!editForm.employeeId.trim()) errors.employeeId = 'Employee ID is required';
        if (!editForm.role.trim()) errors.role = 'Role is required';
        if (!editForm.team) errors.team = 'Team is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle edit employee
    const handleEditEmployee = async (employee) => {
        const details = await fetchEmployeeDetails(employee._id);
        if (details) {
            setEmployeeDetails(details);
            setEditForm({
                name: details.name || '',
                email: details.email || '',
                employeeId: details.employeeId || '',
                role: details.role || '',
                team: details.team || '',
                bloodGroup: details.bloodGroup || '',
                status: details.status || 'Active',
                isAdmin: details.isAdmin || false
            });
            setEditOpen(true);
        }
    };

    // Add registration form validation
    const validateRegisterForm = () => {
        const errors = {};
        if (!registerForm.name.trim()) errors.name = 'Name is required';
        if (!registerForm.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
            errors.email = 'Email is invalid';
        }
        if (!registerForm.password.trim()) errors.password = 'Password is required';
        if (!registerForm.employeeId.trim()) errors.employeeId = 'Employee ID is required';
        if (!registerForm.role.trim()) errors.role = 'Role is required';
        if (!registerForm.team) errors.team = 'Team is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle register form change
    const handleRegisterFormChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle employee registration
    const handleRegisterEmployee = async (e) => {
        e.preventDefault();
        if (!validateRegisterForm()) return;

        try {
            setSubmitting(true);
            const response = await axios.post(
                `${BaseUrl}/auth/register`,
                registerForm,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Add new employee to the list
            setEmployees(prev => [...prev, response.data]);
            toast.success('Employee registered successfully');
            setRegisterOpen(false); // Close modal after successful registration
            
            // Reset form
            setRegisterForm({
                name: '',
                email: '',
                password: '',
                status: 'Active',
                role: '',
                team: 'Technical',
                employeeId: '',
                profile: '',
                bloodGroup: ''
            });
        } catch (err) {
            console.error('Error registering employee:', err);
            toast.error(err.response?.data?.message || 'Failed to register employee');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle form change
    const handleFormChange = (e) => {
        const { name, value, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'isAdmin' ? checked : value
        }));

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle submit edit
    const handleSubmitEdit = async (e) => {
        if (e) e.preventDefault(); // Prevent form submission if event exists
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const response = await axios.put(
                `${BaseUrl}/employees/profile/${employeeDetails._id}`,
                editForm,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update employees list
            setEmployees(prev =>
                prev.map(emp =>
                    emp._id === employeeDetails._id ? response.data : emp
                )
            );

            toast.success('Employee updated successfully');
            setEditOpen(false); // Close modal after successful update
        } catch (err) {
            console.error('Error updating employee:', err);
            toast.error('Failed to update employee');
        } finally {
            setSubmitting(false);
        }
    };

    // Enhanced Edit Modal
    // Add bloodGroups array
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    // Enhanced Edit Modal with React.memo to prevent unnecessary re-renders
    const EditEmployeeModal = React.memo(() => {
        const statusOptions = ['Active', 'Inactive'];

        const handleClose = () => {
            setEditOpen(false);
            setFormErrors({}); // Clear form errors when closing
        };

        return (
            <Dialog
                open={editOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 100%)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.8)',
                    }
                }}
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 400 }}
            >
                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Decorative Elements */}
                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0) 70%)',
                        zIndex: 0
                    }} />
                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                        position: 'absolute',
                        bottom: -80,
                        left: -80,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0) 70%)',
                        zIndex: 0
                    }} />

                    {/* Header */}
                    <DialogTitle sx={{
                        p: 0,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 3,
                            pb: 1,
                            background: 'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)',
                            borderBottom: '1px solid rgba(255,255,255,0.8)',
                        }}>
                            <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: 48,
                                        height: 48,
                                        boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                                    }}
                                >
                                    {employeeDetails?.name?.charAt(0) || 'E'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" sx={{
                                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                    }}>
                                        Edit Employee Profile
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {employeeDetails?.employeeId}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                onClick={() => setEditOpen(false)}
                                sx={{
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    {/* Content */}
                    <DialogContent sx={{ p: 3, mt: 2, position: 'relative', zIndex: 1 }}>
                        {/* <Grid container spacing={3}> */}
                        {/* <Grid item xs={12} md={6}> */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <TextField
                                label="Full Name"
                                name="name"
                                value={editForm.name}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Badge sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        },
                                    }
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <TextField
                                label="Email Address"
                                name="email"
                                value={editForm.email}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        },
                                    }
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <TextField
                                label="Employee ID"
                                name="employeeId"
                                value={editForm.employeeId}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.employeeId}
                                helperText={formErrors.employeeId}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ContactMail sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        },
                                    }
                                }}
                            />
                        </motion.div>
                        {/* </Grid> */}

                        {/* <Grid item xs={12} md={6}> */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            <TextField
                                label="Role"
                                name="role"
                                value={editForm.role}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.role}
                                helperText={formErrors.role}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Work sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        },
                                    }
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            <FormControl
                                fullWidth
                                variant="outlined"
                                error={!!formErrors.team}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        },
                                    }
                                }}
                            >
                                <InputLabel>Team</InputLabel>
                                <Select
                                    name="team"
                                    value={editForm.team}
                                    onChange={handleFormChange}
                                    label="Team"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Business sx={{ color: 'primary.main', mr: 1 }} />
                                        </InputAdornment>
                                    }
                                >
                                    {teams.map((team) => (
                                        <MenuItem key={team} value={team}>
                                            <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        bgcolor: getTeamColor(team),
                                                        mr: 1
                                                    }}
                                                />
                                                {team}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.team && <FormHelperText>{formErrors.team}</FormHelperText>}
                            </FormControl>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: 'rgba(255,255,255,0.8)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.9)',
                                                },
                                            }
                                        }}
                                    >
                                        <InputLabel>Blood Group</InputLabel>
                                        <Select
                                            name="bloodGroup"
                                            value={editForm.bloodGroup}
                                            onChange={handleFormChange}
                                            label="Blood Group"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Bloodtype sx={{ color: '#ef4444', mr: 1 }} />
                                                </InputAdornment>
                                            }
                                        >
                                            {bloodGroups.map((group) => (
                                                <MenuItem key={group} value={group}>{group}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: 'rgba(255,255,255,0.8)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.9)',
                                                },
                                            }
                                        }}
                                    >
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={editForm.status}
                                            onChange={handleFormChange}
                                            label="Status"
                                        >
                                            {statusOptions.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                bgcolor: status === 'Active' ? '#10b981' :
                                                                    status === 'Inactive' ? '#6b7280' :
                                                                        status === 'On Leave' ? '#f59e0b' : '#ef4444',
                                                                mr: 1
                                                            }}
                                                        />
                                                        {status}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </motion.div>
                        {/* </Grid> */}

                        {/* <Grid item xs={12}> */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    mt: 1,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(59,130,246,0.05)',
                                    border: '1px dashed rgba(59,130,246,0.3)'
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editForm.isAdmin}
                                            onChange={handleFormChange}
                                            name="isAdmin"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AdminPanelSettings color="primary" />
                                            <Typography>Admin Privileges</Typography>
                                        </Box>
                                    }
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Admins have full access to manage all employees and system settings.
                                </Typography>
                            </Paper>
                        </motion.div>
                        {/* </Grid> */}
                        {/* </Grid> */}
                    </DialogContent>

                    {/* Actions */}
                    <DialogActions sx={{
                        p: 3,
                        pt: 1,
                        position: 'relative',
                        zIndex: 1,
                        justifyContent: 'space-between'
                    }}>
                        <Button
                            onClick={() => setEditOpen(false)}
                            variant="outlined"
                            startIcon={<Close />}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                color: 'text.secondary',
                                borderColor: 'divider'
                            }}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            onClick={handleSubmitEdit}
                            loading={submitting}
                            variant="contained"
                            startIcon={<Save />}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1,
                                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                                }
                            }}
                        >
                            Save Changes
                        </LoadingButton>
                    </DialogActions>
                </Box>
            </Dialog>
        );
    }, (prevProps, nextProps) => true); // Always return true to prevent re-renders

    // Handle delete employee
    const handleDeleteEmployee = (employee) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${employee.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete!',
            backdrop: `rgba(0,0,0,0.4)`,
            customClass: {
                container: 'swal-container',
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BaseUrl}/employees/${employee._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Remove from employees list
                    setEmployees(prev => prev.filter(emp => emp._id !== employee._id));

                    toast.success('Employee deleted successfully');
                } catch (err) {
                    console.error('Error deleting employee:', err);
                    toast.error('Failed to delete employee');
                }
            }
        });
    };

    // Loading state
    // if (loading) {
    //     return (
    //         <Box sx={{
    //             display: 'flex',
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //             height: '80vh',
    //             flexDirection: 'column',
    //             gap: 3
    //         }}>
    //             <motion.div
    //                 initial={{ opacity: 0, scale: 0.5 }}
    //                 animate={{ opacity: 1, scale: 1 }}
    //                 transition={{ duration: 0.5 }}
    //             >
    //                 <CircularProgress size={60} thickness={4} color="primary" />
    //             </motion.div>
    //             <Typography variant="h6" color="text.secondary">
    //                 Loading team members...
    //             </Typography>
    //         </Box>
    //     );
    // }

    // Error state
    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                flexDirection: 'column',
                gap: 3
            }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    // If not admin, don't render the page
    if (!isAdmin) {
        return null;
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            pt: { xs: 2, md: 4 },
            pb: 6
        }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <Container maxWidth="xl">
                {/* Admin Badge */}
                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Chip
                        icon={<AdminPanelSettings />}
                        label="Admin View"
                        color="primary"
                        variant="outlined"
                        sx={{
                            fontWeight: 'bold',
                            borderWidth: 2,
                            '& .MuiChip-icon': { color: 'primary.main' }
                        }}
                    />
                </Box>

                {/* Enhanced Header Section */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        mb: 6
                    }}>
                        <Typography
                            variant="h3"
                            sx={{
                                mb: 2,
                                background: 'linear-gradient(45deg, #1e293b, #3b82f6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: 'bold',
                                fontSize: { xs: '2rem', md: '3rem' },
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Team Directory
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#64748b',
                                maxWidth: '600px',
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                lineHeight: 1.6
                            }}
                        >
                            Manage and explore the talented individuals who make Signavox extraordinary
                        </Typography>
                    </Box>
                </motion.div>

                {/* Enhanced Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        alignItems: { md: 'center' },
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.5)'
                    }}>
                        <TextField
                            placeholder="Search by name, role, ID or email..."
                            variant="outlined"
                            fullWidth
                            sx={{
                                maxWidth: { md: '1000px' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: theme.palette.primary.main }} />
                                    </InputAdornment>
                                )
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Tooltip title="Filter by team">
                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ minWidth: 200 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<FilterList />}
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        fullWidth
                                        sx={{
                                            textTransform: 'none',
                                            justifyContent: 'space-between',
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: 2
                                        }}
                                    >
                                        {filterTeam === 'all' ? 'All Teams' : filterTeam}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{
                                            sx: {
                                                mt: 1,
                                                width: 200,
                                                maxHeight: 300,
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                                borderRadius: 2
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                setFilterTeam('all');
                                                handleMenuClose();
                                            }}
                                            selected={filterTeam === 'all'}
                                        >
                                            All Teams
                                        </MenuItem>
                                        <Divider />
                                        {teams.map((team) => (
                                            <MenuItem
                                                key={team}
                                                onClick={() => {
                                                    setFilterTeam(team);
                                                    handleMenuClose();
                                                }}
                                                selected={filterTeam === team}
                                            >
                                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            bgcolor: getTeamColor(team)
                                                        }}
                                                    />
                                                    {team}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </Tooltip>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PersonAdd />}
                                onClick={() => setRegisterOpen(true)}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3,
                                    // width: 'full',
                                    py: 1.5,
                                    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                                    background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
                                        boxShadow: '0 6px 15px rgba(59, 130, 246, 0.4)',
                                    }
                                }}
                            >
                                Add Employee
                            </Button>
                        </Box>
                    </Box>
                </motion.div>

                {/* Tabs for filtering by status */}
                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ mb: 4 }}>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: theme.palette.primary.main,
                                height: 3,
                                borderRadius: 1.5
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: alpha(theme.palette.text.primary, 0.7),
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main
                                }
                            },
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Tab label={`All Employees (${employees.length})`} />
                        <Tab label={`Active (${employees.filter(e => e.status === 'Active').length})`} />
                        <Tab label={`Inactive (${employees.filter(e => e.status !== 'Active').length})`} />
                    </Tabs>
                </Box>

                {/* Employee Cards Grid - Compact & Modern Design */}
                <AnimatePresence>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredEmployees.length > 0 ? (
                            <Grid container spacing={3}>
                                {filteredEmployees.map((employee, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={employee._id || index}>
                                        <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                                            <motion.div
                                                variants={itemVariants}
                                                whileHover={{
                                                    y: -8,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <Card
                                                    elevation={0}
                                                    // onClick={() => handleViewDetails(employee)}
                                                    sx={{
                                                        height: '100%',
                                                        borderRadius: 4,
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                        transition: 'all 0.3s ease',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(10px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.5)',
                                                        // cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            // boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',

                                                            boxShadow: '0 15px 35px -12px rgba(0,0,0,0.2)',
                                                            transform: 'translateY(-8px)',
                                                            '& .card-actions': {
                                                                opacity: 1,
                                                                transform: 'translateY(0)'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {/* Status indicator */}
                                                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ position: 'absolute', top: 15, right: 15, zIndex: 2 }}>
                                                        <Tooltip title={employee.status || 'Status'}>
                                                            <Box
                                                                sx={{
                                                                    width: 14,
                                                                    height: 14,
                                                                    borderRadius: '50%',
                                                                    bgcolor: employee.status === 'Active' ? '#10b981' : '#ef4444',
                                                                    boxShadow: '0 0 0 3px white',
                                                                    animation: employee.status === 'Active' ? 'pulse 2s infinite' : 'none',
                                                                    '@keyframes pulse': {
                                                                        '0%': {
                                                                            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)'
                                                                        },
                                                                        '70%': {
                                                                            boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)'
                                                                        },
                                                                        '100%': {
                                                                            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)'
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </Box>

                                                    {/* Card Header with Gradient */}
                                                    <Box
                                                        sx={{
                                                            height: 80,
                                                            background: getGradient(index),
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                left: 0,
                                                                right: 0,
                                                                height: '30%',
                                                                background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                                                            }
                                                        }}
                                                    />

                                                    {/* Avatar */}
                                                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        mt: -5
                                                    }}>
                                                        <Avatar
                                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || '')}&background=${encodeURIComponent(getGradient(index).split(' ')[2].slice(1, 7))}&color=fff&size=128`}
                                                            sx={{
                                                                width: 90,
                                                                height: 90,
                                                                border: '4px solid white',
                                                                boxShadow: '0 8px 20px -8px rgba(0,0,0,0.3)',
                                                                transition: 'all 0.3s ease',
                                                                background: getGradient(index),
                                                                '&:hover': {
                                                                    transform: 'scale(1.05)',
                                                                    boxShadow: '0 10px 25px -10px rgba(0,0,0,0.4)',
                                                                }
                                                            }}
                                                        />
                                                    </Box>

                                                    <CardContent sx={{ pt: 2, pb: 3, px: 3, textAlign: 'center' }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                mb: 0.5,
                                                                color: '#1e293b',
                                                                fontSize: '1.1rem',
                                                                lineHeight: 1.3,
                                                                height: '2.6rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            {employee.name}
                                                        </Typography>

                                                        <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ mb: 2 }}>
                                                            <Chip
                                                                label={employee.role}
                                                                size="small"
                                                                icon={<Work sx={{ fontSize: 14 }} />}
                                                                sx={{
                                                                    mb: 1,
                                                                    mr: 0.5,
                                                                    height: 28,
                                                                    fontSize: '0.8rem',
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    color: theme.palette.primary.main,
                                                                    fontWeight: 500,
                                                                    borderRadius: 2,
                                                                    '& .MuiChip-icon': { fontSize: 14 }
                                                                }}
                                                            />

                                                            <Chip
                                                                label={employee.team}
                                                                size="small"
                                                                icon={<Business sx={{ fontSize: 14 }} />}
                                                                sx={{
                                                                    mb: 1,
                                                                    height: 28,
                                                                    fontSize: '0.8rem',
                                                                    bgcolor: alpha(getTeamColor(employee.team), 0.1),
                                                                    color: getTeamColor(employee.team),
                                                                    fontWeight: 500,
                                                                    borderRadius: 2,
                                                                    '& .MuiChip-icon': { fontSize: 14 }
                                                                }}
                                                            />
                                                        </Box>

                                                        <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 1,
                                                            mb: 2,
                                                            alignItems: 'flex-start',
                                                            textAlign: 'left',
                                                            px: 1
                                                        }}>
                                                            <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Email sx={{ fontSize: 16, color: alpha(theme.palette.text.primary, 0.6) }} />
                                                                <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.8), fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                                                    {employee.email}
                                                                </Typography>
                                                            </Box>

                                                            <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Badge sx={{ fontSize: 16, color: alpha(theme.palette.text.primary, 0.6) }} />
                                                                <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.8), fontSize: '0.85rem' }}>
                                                                    {employee.employeeId}
                                                                </Typography>
                                                            </Box>

                                                            {employee.bloodGroup && (
                                                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Bloodtype sx={{ fontSize: 16, color: alpha(theme.palette.text.primary, 0.6) }} />
                                                                    <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.8), fontSize: '0.85rem' }}>
                                                                        {employee.bloodGroup}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        {/* Card Actions - Visible on hover */}
                                                        <Box
                                                            className="card-actions"
                                                            sx={{
                                                                mt: 1,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                gap: 1,
                                                                opacity: 0,
                                                                transform: 'translateY(10px)',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            <Tooltip title="View Details">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => handleViewDetails(employee)}
                                                                    sx={{
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                        }
                                                                    }}
                                                                >
                                                                    <Visibility sx={{ fontSize: 18 }} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Edit Employee">
                                                                <IconButton
                                                                    size="small"
                                                                    color="info"
                                                                    onClick={() => handleEditEmployee(employee)}
                                                                    sx={{
                                                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.info.main, 0.2),
                                                                        }
                                                                    }}
                                                                >
                                                                    <Edit sx={{ fontSize: 18 }} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Delete Employee">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteEmployee(employee)}
                                                                    sx={{
                                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.error.main, 0.2),
                                                                        }
                                                                    }}
                                                                >
                                                                    <Delete sx={{ fontSize: 18 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Zoom>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                py: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2
                            }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <People sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.5) }} />
                                    </Box>
                                </motion.div>
                                <Typography variant="h6" color="text.secondary">
                                    No employees found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
                                    Try adjusting your search or filter criteria to find what you're looking for.
                                </Typography>
                            </Box>
                        )}
                    </motion.div>
                </AnimatePresence>


                {/* Employee Details Modal */}
                <Dialog
                    open={detailsOpen}
                    onClose={() => setDetailsOpen(false)}
                    maxWidth="md"
                    fullWidth
                    TransitionComponent={Fade}
                    transitionDuration={400}
                    sx={{
                        overflow: 'hidden',
                        '& .MuiDialog-paper': {
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            overflow: 'visible',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1)',
                            transition: 'transform 0.3s ease-in-out',

                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: '-2px',
                                borderRadius: '26px',
                                padding: '2px',
                                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                            }
                        },
                        '& .MuiBackdrop-root': {
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            backdropFilter: 'blur(5px)',
                        }
                    }}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50px',
                                right: '-50px',
                                width: '100px',
                                height: '100px',
                                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)',
                                borderRadius: '50%',
                                zIndex: -1,
                            }
                        }
                    }}
                    slotProps={{
                        backdrop: {
                            sx: {
                                animation: 'fadeIn 0.5s ease-out',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0 },
                                    to: { opacity: 1 }
                                }
                            }
                        }
                    }}

                >
                    <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Gradient Header with Better Alignment */}
                        <Box
                            sx={{
                                position: 'relative',
                                height: 250,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                borderRadius: '24px 24px 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: 'white',
                                px: 3,

                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Avatar
                                    src={employeeDetails ? `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeDetails.name || '')}&background=8b5cf6&color=fff&size=256` : ''}
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        border: '4px solid white',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                        mb: 1,
                                        zIndex: 2
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                style={{ textAlign: 'center' }}
                            >
                                <Typography variant="h4" fontWeight="bold" sx={{
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    mb: 1
                                }}>
                                    {employeeDetails?.name}
                                </Typography>
                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    justifyContent: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    <Chip
                                        icon={<Work sx={{ color: 'inherit !important' }} />}
                                        label={employeeDetails?.role}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            backdropFilter: 'blur(4px)',
                                            '& .MuiChip-label': { px: 2 }
                                        }}
                                    />
                                    <Chip
                                        icon={<Business sx={{ color: 'inherit !important' }} />}
                                        label={employeeDetails?.team}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            backdropFilter: 'blur(4px)',
                                            '& .MuiChip-label': { px: 2 }
                                        }}
                                    />
                                </Box>
                            </motion.div>
                        </Box>

                        {/* Content Section with Improved Grid Layout */}
                        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4, mt: -2, width: '100%' }}>
                            <Grid container spacing={4} sx={{ width: '100%', margin: 0 }}>
                                {/* Contact Information Card */}
                                <Grid item xs={12} md={6}>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                height: '100%',
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                                                borderRadius: 3,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.1)}`
                                                }
                                            }}
                                        >
                                            <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                mb: 3
                                            }}>
                                                <Avatar sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: 'primary.main',
                                                    width: 44,
                                                    height: 44
                                                }}>
                                                    <ContactMail sx={{ fontSize: 24 }} />
                                                </Avatar>
                                                <Typography variant="h6" color="primary.main" fontWeight="600">
                                                    Contact Details
                                                </Typography>
                                            </Box>

                                            <Stack spacing={3}>
                                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 2
                                                }}>
                                                    <Email color="primary" />
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Email Address
                                                        </Typography>
                                                        <Typography color="text.primary" fontWeight="500">
                                                            {employeeDetails?.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 2
                                                }}>
                                                    <Badge color="primary" />
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Employee ID
                                                        </Typography>
                                                        <Typography color="text.primary" fontWeight="500">
                                                            {employeeDetails?.employeeId}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </motion.div>
                                </Grid>

                                {/* Additional Information Card */}
                                <Grid item xs={12} md={6}>
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                height: '100%',
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                                                borderRadius: 3,
                                                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 10px 40px ${alpha(theme.palette.secondary.main, 0.1)}`
                                                }
                                            }}
                                        >
                                            <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                mb: 3
                                            }}>
                                                <Avatar sx={{
                                                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                    color: 'secondary.main',
                                                    width: 44,
                                                    height: 44
                                                }}>
                                                    <Work sx={{ fontSize: 24 }} />
                                                </Avatar>
                                                <Typography variant="h6" color="secondary.main" fontWeight="600">
                                                    Additional Details
                                                </Typography>
                                            </Box>

                                            <Stack spacing={3}>
                                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 2
                                                }}>
                                                    <Bloodtype color="error" />
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Blood Group
                                                        </Typography>
                                                        <Chip
                                                            label={employeeDetails?.bloodGroup || 'Not specified'}
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 2
                                                }}>
                                                    <AdminPanelSettings color={employeeDetails?.isAdmin ? "primary" : "disabled"} />
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Admin Access
                                                        </Typography>
                                                        <Chip
                                                            label={employeeDetails?.isAdmin ? 'Yes' : 'No'}
                                                            size="small"
                                                            color={employeeDetails?.isAdmin ? 'primary' : 'default'}
                                                            variant={employeeDetails?.isAdmin ? 'filled' : 'outlined'}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            </Grid>

                            {/* Action Buttons with Better Alignment */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                                    mt: 4,
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                    pt: 2,
                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setDetailsOpen(false)}
                                        startIcon={<Close />}
                                        sx={{
                                            borderRadius: 2,
                                            borderWidth: 2,
                                            px: 3,
                                            '&:hover': {
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setDetailsOpen(false);
                                            handleEditEmployee(employeeDetails);
                                        }}
                                        startIcon={<Edit />}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
                                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                                            }
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>
                            </motion.div>
                        </Container>
                    </Box>
                </Dialog>


                {/* Render the Edit Modal */}
                {editOpen && <EditEmployeeModal />}

                {/* Register Employee Modal */}
                <Dialog
                    open={registerOpen}
                    onClose={() => setRegisterOpen(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            overflow: 'hidden',
                            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 100%)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(255,255,255,0.8)',
                        }
                    }}
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 400 }}
                >
                    <DialogTitle>
                        <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEdit();
                }} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            pb: 2
                        }}>
                            <Typography variant="h5" fontWeight="bold">
                                Register New Employee
                            </Typography>
                            <IconButton onClick={() => setRegisterOpen(false)}>
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box component="form" onSubmit={handleRegisterEmployee} sx={{ mt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={registerForm.name}
                                        onChange={handleRegisterFormChange}
                                        error={!!formErrors.name}
                                        helperText={formErrors.name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={registerForm.email}
                                        onChange={handleRegisterFormChange}
                                        error={!!formErrors.email}
                                        helperText={formErrors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={registerForm.password}
                                        onChange={handleRegisterFormChange}
                                        error={!!formErrors.password}
                                        helperText={formErrors.password}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Employee ID"
                                        name="employeeId"
                                        value={registerForm.employeeId}
                                        onChange={handleRegisterFormChange}
                                        error={!!formErrors.employeeId}
                                        helperText={formErrors.employeeId}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Role"
                                        name="role"
                                        value={registerForm.role}
                                        onChange={handleRegisterFormChange}
                                        error={!!formErrors.role}
                                        helperText={formErrors.role}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={!!formErrors.team}>
                                        <InputLabel>Team</InputLabel>
                                        <Select
                                            name="team"
                                            value={registerForm.team}
                                            onChange={handleRegisterFormChange}
                                            label="Team"
                                        >
                                            {teams.map((team) => (
                                                <MenuItem key={team} value={team}>
                                                    {team}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formErrors.team && (
                                            <FormHelperText>{formErrors.team}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Blood Group</InputLabel>
                                        <Select
                                            name="bloodGroup"
                                            value={registerForm.bloodGroup}
                                            onChange={handleRegisterFormChange}
                                            label="Blood Group"
                                        >
                                            {bloodGroups.map((group) => (
                                                <MenuItem key={group} value={group}>
                                                    {group}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={registerForm.status}
                                            onChange={handleRegisterFormChange}
                                            label="Status"
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setRegisterOpen(false)}>Cancel</Button>
                        <LoadingButton
                            loading={submitting}
                            variant="contained"
                            onClick={handleRegisterEmployee}
                        >
                            Register Employee
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

            </Container>




        </Box>
    );
};

export default EmployeesPage;