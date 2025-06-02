import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Checkbox,
    Chip,
    InputAdornment,
    Card,
    CardContent,
    Grid,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    useTheme,
    alpha,
    List,
    ListItem,
    ListItemButton,
    Avatar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    DateRange as DateRangeIcon,
    WorkOutline as WorkIcon,
    ExpandMore as ExpandMoreIcon,
    Link as LinkIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);
    const [openApplyDialog, setOpenApplyDialog] = useState(false);
    const [resumeLink, setResumeLink] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false');
    const token = localStorage.getItem('token');
    const [expandedAccordion, setExpandedAccordion] = useState(false);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        requiredSkills: [],
        vacancy: 0,
        startDate: '',
        endDate: '',
        teamSizeLimit: 0,
        teamLead: '',
        client: {
            name: '',
            contactEmail: '',
            mobile: '',
            ceo: '',
            industry: '',
            location: '',
            website: '',
            address: '',
            gstNumber: '',
            registrationId: ''
        }
    });
    const theme = useTheme();

    useEffect(() => {
        fetchProjects();
        fetchApplications();
    }, []);

    useEffect(() => {
        if (editingProject) {
            setFormData({
                title: editingProject.title || '',
                description: editingProject.description || '',
                department: editingProject.department || '',
                requiredSkills: editingProject.requiredSkills || [],
                vacancy: editingProject.vacancy || 0,
                startDate: editingProject.startDate ? format(new Date(editingProject.startDate), 'yyyy-MM-dd') : '',
                endDate: editingProject.endDate ? format(new Date(editingProject.endDate), 'yyyy-MM-dd') : '',
                teamSizeLimit: editingProject.teamSizeLimit || 0,
                teamLead: editingProject.teamLead || '',
                client: {
                    name: editingProject.client?.name || '',
                    contactEmail: editingProject.client?.contactEmail || '',
                    mobile: editingProject.client?.mobile || '',
                    ceo: editingProject.client?.ceo || '',
                    industry: editingProject.client?.industry || '',
                    location: editingProject.client?.location || '',
                    website: editingProject.client?.website || '',
                    address: editingProject.client?.address || '',
                    gstNumber: editingProject.client?.gstNumber || '',
                    registrationId: editingProject.client?.registrationId || ''
                }
            });
        }
    }, [editingProject]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${BaseUrl}/projects/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const projectsData = Array.isArray(response.data) ? response.data : [];
            setProjects(projectsData);
            if (projectsData.length > 0) {
                await fetchProjectDetails(projectsData[0]._id);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Failed to fetch projects. Please try again later.');
            setProjects([]);
            setSelectedProject(null);
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/project-applications/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications([]);
        }
    };

    const fetchProjectDetails = async (projectId) => {
        if (!projectId) {
            setSelectedProject(null);
            return;
        }

        try {
            setProjectDetailsLoading(true);
            const response = await axios.get(`${BaseUrl}/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setSelectedProject(response.data);
            } else {
                setSelectedProject(null);
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
            setSelectedProject(null);
        } finally {
            setProjectDetailsLoading(false);
        }
    };

    const handleCreateProject = async () => {
        try {
            setSubmitting(true);
            const response = await axios.post(`${BaseUrl}/projects/`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Project created successfully!');
            setProjectModalOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditProject = async () => {
        try {
            setSubmitting(true);
            const response = await axios.put(`${BaseUrl}/projects/${editingProject._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Project updated successfully!');
            setProjectModalOpen(false);
            fetchProjects();
            if (selectedProject?._id === editingProject._id) {
                fetchProjectDetails(editingProject._id);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleApplyProject = async () => {
        try {
            setSubmitting(true);
            await axios.post(
                `${BaseUrl}/project-applications/apply/`,
                {
                    projectId: selectedProject._id,
                    resumeOrPortfolio: resumeLink
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success('Application submitted successfully!');
            setOpenApplyDialog(false);
            setResumeLink('');
            fetchApplications();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    const handleApproveApplication = async (applicationId) => {
        try {
            await axios.put(
                `${BaseUrl}/project-applications/approve/${applicationId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success('Application approved successfully!');
            fetchApplications();
        } catch (error) {
            toast.error('Failed to approve application');
        }
    };

    const handleRejectApplication = async (applicationId) => {
        try {
            await axios.put(
                `${BaseUrl}/project-applications/reject/${applicationId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success('Application rejected successfully!');
            fetchApplications();
        } catch (error) {
            toast.error('Failed to reject application');
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });
            

            if (result.isConfirmed) {
                await axios.delete(`${BaseUrl}/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire(
                    'Deleted!',
                    'Project has been deleted.',
                    'success'
                );
                fetchProjects();
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                'Failed to delete project.',
                'error'
            );
        }
    };

    const filteredProjects = (projects || []).filter(project =>
        project.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const projectApplications = applications.filter(app =>
        selectedProject && app && app.project && app.project._id === selectedProject._id
    );

    const handleProjectClick = (projectId) => {
        if (projectId) {
            fetchProjectDetails(projectId);
        }
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    const ProjectModal = () => (
        <Dialog
            open={projectModalOpen}
            onClose={() => {
                setProjectModalOpen(false);
                setEditingProject(null);
                setFormData({
                    title: '',
                    description: '',
                    department: '',
                    requiredSkills: [],
                    vacancy: 0,
                    startDate: '',
                    endDate: '',
                    teamSizeLimit: 0,
                    teamLead: '',
                    client: {
                        name: '',
                        contactEmail: '',
                        mobile: '',
                        ceo: '',
                        industry: '',
                        location: '',
                        website: '',
                        address: '',
                        gstNumber: '',
                        registrationId: ''
                    }
                });
            }}
            maxWidth="md"
            fullWidth
            PaperProps={{
                elevation: 24,
                sx: {
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: `linear-gradient(to bottom right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.background.paper, 1)})`,
                    overflow: 'hidden',
                }
            }}
        >
            <DialogTitle
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    py: 3,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {editingProject ? <EditIcon /> : <AddIcon />}
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        {editingProject ? 'Edit Project' : 'Create New Project'}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent 
                sx={{ 
                    p: 0,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ 
                                mb: 3, 
                                p: 2, 
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}>
                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                                    Project Information
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Fill in the details below to {editingProject ? 'update' : 'create'} your project
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                multiline
                                rows={4}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Required Skills"
                                value={formData.requiredSkills.join(', ')}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    requiredSkills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                                })}
                                helperText="Enter skills separated by commas"
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vacancy"
                                type="number"
                                value={formData.vacancy}
                                onChange={(e) => setFormData({ ...formData, vacancy: parseInt(e.target.value) })}
                                required
                                variant="outlined"
                                InputProps={{
                                    inputProps: { min: 0 }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Team Size Limit"
                                type="number"
                                value={formData.teamSizeLimit}
                                onChange={(e) => setFormData({ ...formData, teamSizeLimit: parseInt(e.target.value) })}
                                required
                                variant="outlined"
                                InputProps={{
                                    inputProps: { min: 0 }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Team Lead ID"
                                value={formData.teamLead}
                                onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
                                required
                                variant="outlined"
                                helperText="Enter the Employee ObjectId of the team lead"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ 
                                mt: 2, 
                                mb: 3, 
                                p: 2, 
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}>
                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                                    Client Information
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Provide the client details for this project
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Client Name"
                                value={formData.client.name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, name: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Email"
                                type="email"
                                value={formData.client.contactEmail}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, contactEmail: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mobile"
                                value={formData.client.mobile}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, mobile: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="CEO Name"
                                value={formData.client.ceo}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, ceo: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Industry"
                                value={formData.client.industry}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, industry: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={formData.client.location}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, location: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Website"
                                value={formData.client.website}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, website: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="GST Number"
                                value={formData.client.gstNumber}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, gstNumber: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={formData.client.address}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, address: e.target.value }
                                })}
                                multiline
                                rows={2}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Registration ID"
                                value={formData.client.registrationId}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    client: { ...formData.client, registrationId: e.target.value }
                                })}
                                required
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions 
                sx={{ 
                    p: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
            >
                <Button
                    onClick={() => {
                        setProjectModalOpen(false);
                        setEditingProject(null);
                    }}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        px: 3,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={editingProject ? handleEditProject : handleCreateProject}
                    disabled={!formData.title || !formData.description || submitting}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        }
                    }}
                >
                    {submitting ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} color="inherit" />
                            <span>Processing...</span>
                        </Box>
                    ) : (
                        editingProject ? 'Update Project' : 'Create Project'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    py: 6,
                    mb: 4,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='${encodeURIComponent(alpha(theme.palette.common.white, 0.05))}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }
                }}
            >
                <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Box className="flex justify-between items-center">
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                Projects Management
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                View and manage all projects in one place
                            </Typography>
                        </Box>
                        {isAdmin && (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AddIcon />}
                                onClick={() => setProjectModalOpen(true)}
                                sx={{
                                    backgroundColor: 'white',
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.9),
                                    }
                                }}
                            >
                                Add New Project
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Main Content */}
            <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {/* Search Bar */}
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by Project ID or Title"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
                    />
                </Box>

                {loading ? (
                    <Box className="flex justify-center items-center h-64">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box className="flex justify-center items-center h-64">
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 250px)' }}>
                        {/* Projects List - Left Column */}
                        <Card
                            elevation={3}
                            sx={{
                                width: '40%',
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{
                                p: 2,
                                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                    Projects List
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, overflow: 'auto' }}>
                                <List sx={{ p: 0 }}>
                                    {filteredProjects.map((project) => (
                                        <ListItem
                                            key={project._id}
                                            onClick={() => handleProjectClick(project._id)}
                                            sx={{
                                                cursor: 'pointer',
                                                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                backgroundColor: selectedProject?._id === project._id ? alpha(theme.palette.primary.main, 0.1) : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                },
                                                transition: 'background-color 0.2s',
                                            }}
                                        >
                                            <ListItemButton sx={{ p: 2 }}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {project.title}
                                                        </Typography>
                                                        <Chip
                                                            label={project.status}
                                                            size="small"
                                                            color={project.status === 'open' ? 'success' : 'default'}
                                                            sx={{ textTransform: 'capitalize' }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {project.projectId}
                                                        </Typography>
                                                        {isAdmin && (
                                                            <Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Handle edit
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteProject(project._id);
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Card>

                        {/* Project Details - Right Column */}
                        <Card
                            elevation={3}
                            sx={{
                                width: '60%',
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            {projectDetailsLoading ? (
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    height: '100%'
                                }}>
                                    <CircularProgress />
                                </Box>
                            ) : selectedProject ? (
                                <>
                                    <Box sx={{
                                        p: 3,
                                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                                    {selectedProject.title}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Project ID: {selectedProject.projectId}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip
                                                    label={selectedProject.status.toUpperCase()}
                                                    color={selectedProject.status === 'open' ? 'success' : 'default'}
                                                    sx={{ textTransform: 'uppercase' }}
                                                />
                                                {!isAdmin && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => setOpenApplyDialog(true)}
                                                    >
                                                        Apply Now
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="body1" sx={{ mb: 3 }}>
                                                {selectedProject.description}
                                            </Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 2,
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <BusinessIcon color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                                                                <Typography>{selectedProject.department}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 2,
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <GroupIcon color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2" color="textSecondary">Team Size</Typography>
                                                                <Typography>{selectedProject.vacancy} / {selectedProject.teamSizeLimit}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 2,
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <DateRangeIcon color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2" color="textSecondary">Duration</Typography>
                                                                <Typography>
                                                                    {format(new Date(selectedProject.startDate), 'MMM dd, yyyy')} -
                                                                    {format(new Date(selectedProject.endDate), 'MMM dd, yyyy')}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Required Skills</Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {selectedProject.requiredSkills.map((skill, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={skill}
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.primary.main,
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Accordion
                                            expanded={expandedAccordion === 'team'}
                                            onChange={handleAccordionChange('team')}
                                            elevation={0}
                                            sx={{
                                                mb: 2,
                                                backgroundColor: 'transparent',
                                                '&:before': { display: 'none' },
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <GroupIcon color="primary" />
                                                    <Typography variant="h6">Team Members</Typography>
                                                    <Chip
                                                        label={`${selectedProject.assignedEmployees.length}/${selectedProject.teamSizeLimit}`}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    {selectedProject.assignedEmployees.length === 0 ? (
                                                        <Grid item xs={12}>
                                                            <Typography color="textSecondary">No team members assigned yet</Typography>
                                                        </Grid>
                                                    ) : (
                                                        selectedProject.assignedEmployees.map((employee) => (
                                                            <Grid item xs={12} sm={6} key={employee._id}>
                                                                <Paper
                                                                    elevation={0}
                                                                    sx={{
                                                                        p: 2,
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                                        borderRadius: 2,
                                                                        height: '100%',
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                                            <PersonIcon />
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="subtitle1">{employee.name}</Typography>
                                                                            <Typography variant="body2" color="textSecondary">
                                                                                {employee.employeeId}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Paper>
                                                            </Grid>
                                                        ))
                                                    )}
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>

                                        {isAdmin && (
                                            <Accordion
                                                expanded={expandedAccordion === 'applications'}
                                                onChange={handleAccordionChange('applications')}
                                                elevation={0}
                                                sx={{
                                                    backgroundColor: 'transparent',
                                                    '&:before': { display: 'none' },
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <WorkIcon color="primary" />
                                                        <Typography variant="h6">Applications</Typography>
                                                        <Chip
                                                            label={projectApplications.length}
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={2}>
                                                        {projectApplications.length === 0 ? (
                                                            <Grid item xs={12}>
                                                                <Typography color="textSecondary">No applications received yet</Typography>
                                                            </Grid>
                                                        ) : (
                                                            projectApplications.map((application) => (
                                                                <Grid item xs={12} key={application._id}>
                                                                    <Paper
                                                                        elevation={0}
                                                                        sx={{
                                                                            p: 2,
                                                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                                            borderRadius: 2,
                                                                        }}
                                                                    >
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                                                    <PersonIcon />
                                                                                </Avatar>
                                                                                <Box>
                                                                                    <Typography variant="subtitle1">{application.employee.name}</Typography>
                                                                                    <Typography variant="body2" color="textSecondary">
                                                                                        {application.employee.employeeId} • Applied on {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <IconButton
                                                                                    size="small"
                                                                                    href={application.resumeOrPortfolio}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <LinkIcon />
                                                                                </IconButton>
                                                                                {application.status === 'pending' && (
                                                                                    <>
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            color="success"
                                                                                            onClick={() => handleApproveApplication(application._id)}
                                                                                        >
                                                                                            <CheckIcon />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            color="error"
                                                                                            onClick={() => handleRejectApplication(application._id)}
                                                                                        >
                                                                                            <CloseIcon />
                                                                                        </IconButton>
                                                                                    </>
                                                                                )}
                                                                                <Chip
                                                                                    label={application.status}
                                                                                    size="small"
                                                                                    color={
                                                                                        application.status === 'approved' ? 'success' :
                                                                                            application.status === 'rejected' ? 'error' :
                                                                                                'default'
                                                                                    }
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                />
                                                                            </Box>
                                                                        </Box>
                                                                    </Paper>
                                                                </Grid>
                                                            ))
                                                        )}
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 2,
                                        p: 4,
                                    }}
                                >
                                    <WorkIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.3) }} />
                                    <Typography color="textSecondary">
                                        Select a project to view details
                                    </Typography>
                                </Box>
                            )}
                        </Card>
                    </Box>
                )}
            </Box>

            {/* Apply Dialog */}
            <Dialog
                open={openApplyDialog}
                onClose={() => setOpenApplyDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    elevation: 24,
                    sx: {
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        Apply for Project
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Resume/Portfolio Link"
                        variant="outlined"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        required
                        placeholder="Enter Google Drive link to your resume"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenApplyDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyProject}
                        disabled={!resumeLink || submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Project Modal */}
            <ProjectModal />
        </Box>
    );
};

export default Projects; 