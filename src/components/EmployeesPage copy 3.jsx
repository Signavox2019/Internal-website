import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Grid, Card, Avatar,
    Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, FormControl, InputLabel, Select, MenuItem,
    IconButton, Chip, InputAdornment, Tooltip, CircularProgress,
    useTheme, alpha, Zoom, Paper, Tab, Tabs
} from '@mui/material';
import {
    Add, Search, FilterList, Edit, Delete, Person,
    Email, Badge, Work, Group, Bloodtype, Close,
    Visibility, VisibilityOff, ArrowUpward, Save
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import BaseUrl from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    width: '350px',
    height: '260px', // Fixed height for all cards
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        '& .card-overlay': {
            opacity: 1,
        },
    },
}));

const CardOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'flex-end',
    padding: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
    borderRadius: '12px',
    fontWeight: 600,
    ...(status === 'Active' && {
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.main,
    }),
    ...(status === 'Inactive' && {
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
    }),
}));

const RoleChip = styled(Chip)(({ theme }) => ({
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 600,
}));

const TeamChip = styled(Chip)(({ theme }) => ({
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    color: theme.palette.secondary.main,
    fontWeight: 600,
}));

const StyledSearchBar = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(3),
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
        transform: 'translateY(-2px)',
    }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
    borderRadius: '16px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #2b5a9e 0%, #d9764a 100%)',
    color: 'white',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(43, 90, 158, 0.25)',
        background: 'linear-gradient(135deg, #1e4b8f 0%, #c85f2f 100%)',
    }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        overflow: 'hidden',
    },
    '& .MuiDialogTitle-root': {
        padding: theme.spacing(3),
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(3),
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    minHeight: 53,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
    '& .MuiTab-wrapper': {
        display: 'flex',
        alignItems: 'center',
    },
    '& .count-chip': {
        marginLeft: theme.spacing(1),
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        fontWeight: 600,
        height: 'auto',
        padding: '0 8px',
        fontSize: '0.85rem',
        borderRadius: 12,
    },
}));

const EmployeesPage = () => {
    const theme = useTheme();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterTeam, setFilterTeam] = useState('all');
    const [currentTab, setCurrentTab] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        employeeId: '',
        role: '',
        team: '',
        bloodGroup: '',
        status: 'Active',
    });

    const roles = ['CEO', 'HR', 'Manager', 'Developer', 'DevOps', 'BDE', 'Other'];
    const teams = ['Operations', 'Technical', 'Finance', 'Marketing', 'Other'];
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEmployees();
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEmployees(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to fetch employees');
            setLoading(false);
        }
    };

    const handleEditEmployee = (employee) => {
        if (!employee) {
            toast.error('Invalid employee data');
            return;
        }

        setIsEditMode(true);
        setSelectedEmployee(employee);
        setFormData({
            name: employee.name || '',
            email: employee.email || '',
            employeeId: employee.employeeId || '',
            role: employee.role || '',
            team: employee.team || '',
            bloodGroup: employee.bloodGroup || '',
            status: employee.status || 'Active',
            _id: employee._id
        });
        setOpenDialog(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Email validation
        const validateEmail = (email) => {
            return email.toLowerCase().endsWith('@signavoxtechnologies.com');
        };

        if (!validateEmail(formData.email)) {
            toast.error('Email must end with @signavoxtechnologies.com');
            setSubmitting(false);
            handleCloseDialog();
            return;
        }

        try {
            if (isEditMode) {
                if (!selectedEmployee?._id) {
                    throw new Error('No employee selected for editing');
                }

                const editData = {
                    _id: selectedEmployee._id,
                    name: formData.name,
                    email: formData.email,
                    employeeId: formData.employeeId,
                    role: formData.role,
                    team: formData.team,
                    bloodGroup: formData.bloodGroup,
                    status: formData.status
                };

                console.log("Sending edit request with data:", editData);
                
                try {
                    const response = await axios.put(
                        `${BaseUrl}/employees/profile/${selectedEmployee._id}`,
                        editData,
                        { 
                            headers: { 
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            } 
                        }
                    );

                    console.log("Full Edit Response:", response);

                    if (response && (response.status === 200 || response.status === 201)) {
                        const updatedEmployee = response.data || editData;
                        
                        setEmployees(prevEmployees => 
                            prevEmployees.map(emp => 
                                emp._id === selectedEmployee._id ? updatedEmployee : emp
                            )
                        );
                        toast.success('Employee updated successfully!');
                        handleCloseDialog();
                        return;
                    }
                    
                    console.error('Invalid response structure:', response);
                    throw new Error('Failed to update employee');
                } catch (error) {
                    if (error.response) {
                        throw new Error(error.response.data?.message || 'Server returned an error');
                    } else if (error.request) {
                        throw new Error('No response received from server');
                    } else {
                        throw error;
                    }
                }
            } else {
                const registerData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    employeeId: formData.employeeId,
                    role: formData.role,
                    team: formData.team,
                    bloodGroup: formData.bloodGroup
                };

                console.log("Sending registration request with data:", registerData);
                
                try {
                    const response = await axios.post(
                        `${BaseUrl}/auth/register`, 
                        registerData,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );

                    console.log("Registration Response:", response);

                    if (response && (response.status === 200 || response.status === 201)) {
                        if (response.data) {
                            setEmployees(prevEmployees => [...prevEmployees, response.data]);
                            toast.success('Employee registered successfully!');
                            handleCloseDialog();
                            return;
                        }
                        throw new Error('Server response missing employee data');
                    }
                    
                    throw new Error('Registration failed with status: ' + response.status);
                } catch (error) {
                    if (error.response) {
                        throw new Error(error.response.data?.message || 'Registration failed');
                    } else if (error.request) {
                        throw new Error('No response received from server');
                    } else {
                        throw error;
                    }
                }
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            console.error('Full error object:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                data: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            
            let errorMessage = 'Failed to save employee';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditMode(false);
        setSelectedEmployee(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            employeeId: '',
            role: '',
            team: '',
            bloodGroup: '',
            status: 'Active',
        });
    };

    const handleDeleteEmployee = (employeeId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: theme.palette.grey[500],
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BaseUrl}/employees/${employeeId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setEmployees(employees.filter(emp => emp._id !== employeeId));
                    toast.success('Employee deleted successfully!');
                } catch (error) {
                    console.error('Error deleting employee:', error);
                    toast.error('Failed to delete employee');
                }
            }
        });
    };

    const filteredEmployees = employees.filter(employee => {
        if (!employee) return false;

        const matchesSearch = (employee.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (employee.employeeId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || employee.role === filterRole;
        const matchesTeam = filterTeam === 'all' || employee.team === filterTeam;
        const matchesStatus = currentTab === 0 ||
            (currentTab === 1 && employee.status === 'Active') ||
            (currentTab === 2 && employee.status === 'Inactive');
        return matchesSearch && matchesRole && matchesTeam && matchesStatus;
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const CardActions = ({ employee }) => (
        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <IconButton
                size="small"
                sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                        bgcolor: alpha('#fff', 0.9),
                        transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleEditEmployee(employee);
                }}
            >
                <Edit fontSize="small" />
            </IconButton>
            <IconButton
                size="small"
                sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                        bgcolor: alpha('#fff', 0.9),
                        transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEmployee(employee._id);
                }}
            >
                <Delete fontSize="small" />
            </IconButton>
        </Box>
    );

    const employeeCounts = {
        all: employees.length,
        active: employees.filter(emp => emp.status === 'Active').length,
        inactive: employees.filter(emp => emp.status === 'Inactive').length
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            py: 4,
            background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f3ff 100%)',
        }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <Container maxWidth="xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{
                        mb: 4,
                        p: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #2b5a9e 0%, #d9764a 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Employee Directory
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                                Manage your organization's workforce efficiently. Add, view, and manage employee information in one place.
                            </Typography>
                        </Box>
                        
                        {/* Animated background elements */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    transition: { duration: 50, repeat: Infinity, ease: "linear" }
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '-100%',
                                    left: '-100%',
                                    width: '200%',
                                    height: '200%',
                                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)',
                                }}
                            />
                        </Box>
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <StyledSearchBar>
                        <TextField
                            fullWidth
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                }
                            }}
                        />
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                label="Filter by Role"
                                sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                            >
                                <MenuItem value="all">All Roles</MenuItem>
                                {roles.map(role => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Filter by Team</InputLabel>
                            <Select
                                value={filterTeam}
                                onChange={(e) => setFilterTeam(e.target.value)}
                                label="Filter by Team"
                                sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                            >
                                <MenuItem value="all">All Teams</MenuItem>
                                {teams.map(team => (
                                    <MenuItem key={team} value={team}>{team}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <AnimatedButton
                            startIcon={<Add />}
                            onClick={() => setOpenDialog(true)}
                        >
                            Add Employee
                        </AnimatedButton>
                    </StyledSearchBar>
                </motion.div>

                <Paper sx={{ 
                    my: 3, 
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Tabs
                        value={currentTab}
                        onChange={(e, newValue) => setCurrentTab(newValue)}
                        sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider',
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                                background: 'linear-gradient(90deg, #2b5a9e 0%, #d9764a 100%)',
                            },
                        }}
                    >
                        <StyledTab 
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    All Employees
                                    <Box component="span" className="count-chip">
                                        {employeeCounts?.all || 0}
                                    </Box>
                                </Box>
                            }
                        />
                        <StyledTab 
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Active
                                    <Box component="span" className="count-chip" sx={{ 
                                        backgroundColor: alpha('#22c55e', 0.1),
                                        color: '#22c55e'
                                    }}>
                                        {employeeCounts?.active || 0}
                                    </Box>
                                </Box>
                            }
                        />
                        <StyledTab 
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Inactive
                                    <Box component="span" className="count-chip" sx={{ 
                                        backgroundColor: alpha('#ef4444', 0.1),
                                        color: '#ef4444'
                                    }}>
                                        {employeeCounts?.inactive || 0}
                                    </Box>
                                </Box>
                            }
                        />
                    </Tabs>
                </Paper>

                <Grid container spacing={3}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        filteredEmployees.map((employee) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={employee._id} sx={{ display: 'flex' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ width: '100%' }}
                                >
                                    <StyledCard>
                                        <Box sx={{ 
                                            p: 3, 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            height: '100%'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'primary.main',
                                                        fontSize: '1.5rem',
                                                    }}
                                                >
                                                    {employee?.name?.charAt(0) || '?'}
                                                </Avatar>
                                                <Box sx={{ ml: 2 }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        {employee?.name || 'Unknown'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {employee?.employeeId || 'No ID'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <RoleChip label={employee?.role || 'No Role'} />
                                                <TeamChip label={employee?.team || 'No Team'} sx={{ ml: 1 }} />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <Email sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                {employee?.email || 'No Email'}
                                            </Typography>

                                            <Box sx={{ 
                                                mt: 'auto', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                flexWrap: 'wrap'
                                            }}>
                                                <Chip
                                                    icon={<Bloodtype />}
                                                    label={employee?.bloodGroup || 'No Blood Group'}
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                />
                                                <StatusChip
                                                    label={employee?.status || 'Unknown'}
                                                    status={employee?.status || 'Unknown'}
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>

                                        <CardOverlay className="card-overlay">
                                            <CardActions employee={employee} />
                                        </CardOverlay>
                                    </StyledCard>
                                </motion.div>
                            </Grid>
                        ))
                    )}
                </Grid>

                <StyledDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            bgcolor: 'background.paper',
                            backgroundImage: 'linear-gradient(135deg, rgba(43, 90, 158, 0.05) 0%, rgba(217, 118, 74, 0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            background: 'linear-gradient(135deg, #2b5a9e 0%, #d9764a 100%)',
                            color: 'white',
                            py: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: 'white',
                                color: '#2b5a9e',
                                width: 40,
                                height: 40,
                            }}
                        >
                            {isEditMode ? <Edit /> : <Add />}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" component="div">
                                {isEditMode ? 'Edit Employee' : 'Register New Employee'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                {isEditMode ? 'Update employee information' : 'Add a new employee to the system'}
                            </Typography>
                        </Box>
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            p: 3,
                            '& .MuiTextField-root, & .MuiFormControl-root': {
                                mb: 2.5,
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#2b5a9e',
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                            <TextField
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {!isEditMode && (
                                <TextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Badge color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                            <TextField
                                label="Employee ID"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Badge color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl required>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    label="Role"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Work color="action" sx={{ mr: 1 }} />
                                        </InputAdornment>
                                    }
                                >
                                    {roles.map(role => (
                                        <MenuItem key={role} value={role}>{role}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl required>
                                <InputLabel>Team</InputLabel>
                                <Select
                                    name="team"
                                    value={formData.team}
                                    onChange={handleInputChange}
                                    label="Team"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Group color="action" sx={{ mr: 1 }} />
                                        </InputAdornment>
                                    }
                                >
                                    {teams.map(team => (
                                        <MenuItem key={team} value={team}>{team}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl required>
                                <InputLabel>Blood Group</InputLabel>
                                <Select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleInputChange}
                                    label="Blood Group"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Bloodtype color="action" sx={{ mr: 1 }} />
                                        </InputAdornment>
                                    }
                                >
                                    {bloodGroups.map(group => (
                                        <MenuItem key={group} value={group}>{group}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {isEditMode && (
                                <FormControl>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        label="Status"
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </DialogContent>

                    <DialogActions
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, rgba(43, 90, 158, 0.05) 0%, rgba(217, 118, 74, 0.05) 100%)',
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={handleCloseDialog}
                            variant="outlined"
                            startIcon={<Close />}
                            sx={{
                                borderRadius: 2,
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            onClick={handleSubmit}
                            loading={submitting}
                            variant="contained"
                            startIcon={isEditMode ? <Save /> : <Add />}
                            sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #2b5a9e 0%, #d9764a 100%)',
                                px: 4,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1e4b8f 0%, #c85f2f 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 16px -4px rgba(43, 90, 158, 0.25)',
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            {isEditMode ? 'Save Changes' : 'Register Employee'}
                        </LoadingButton>
                    </DialogActions>
                </StyledDialog>

                <Zoom in={showScrollTop}>
                    <Box
                        onClick={scrollToTop}
                        role="presentation"
                        sx={{
                            position: 'fixed',
                            bottom: 30,
                            right: 30,
                            zIndex: 2,
                        }}
                    >
                        <Tooltip title="Scroll to top">
                            <IconButton
                                sx={{
                                    bgcolor: 'background.paper',
                                    boxShadow: 3,
                                    '&:hover': {
                                        bgcolor: 'background.paper',
                                    }
                                }}
                            >
                                <ArrowUpward />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Zoom>
            </Container>
        </Box>
    );
};

export default EmployeesPage; 