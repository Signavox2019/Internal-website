import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tooltip,
    CircularProgress,
    Alert,
    Stack,
    Rating,
    LinearProgress,
    MenuItem,
    useTheme,
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    Person,
    Work,
    School,
    Timeline,
    Code,
    Business,
    Assignment,
    Edit,
    Add,
    Close,
    OpenInNew,
    VerifiedUser,
    Star,
    Group,
    TrendingUp,
    Assessment,
    PieChart,
    BarChart,
    Radar,
    ExpandMore,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Bar, Pie, Radar as RadarChart } from 'react-chartjs-2';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    AnimatedBackground,
    StyledCard,
    DetailRow,
    StyledAvatar,
    ProgressBar,
    SkillChip,
    GradientBorderCard,
    TimelineContainer,
    TimelineItem,
    TimelineDot,
    ExperienceCard,
    TechChip,
    StyledAccordion,
    StyledAccordionSummary,
    AnimatedAddButton,
    StyledTextField,
    ChartContainer,
} from './styled';
import styled from '@emotion/styled';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler
);

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '5px',
        background: 'linear-gradient(90deg, #311188, #22c55e)',
    },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    position: 'relative',
    padding: theme.spacing(4),
    borderRadius: '30px',
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.95), rgba(10, 8, 30, 0.95))',
    color: 'white',
    backdropFilter: 'blur(10px)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const SkillsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    '& > div': {
        position: 'relative',
        padding: theme.spacing(3),
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            background: 'rgba(255, 255, 255, 0.15)',
        },
    },
}));

const TimelineWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: '2px',
        background: 'linear-gradient(to bottom, #311188 0%, #22c55e 100%)',
        transform: 'translateX(-50%)',
    },
    [theme.breakpoints.down('sm')]: {
        '&::before': {
            left: '20px',
        },
    },
}));

const EnhancedTimelineItem = styled(Box)(({ theme, align = 'left' }) => ({
    display: 'flex',
    justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
    width: '100%',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#311188',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
    },
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-start',
        paddingLeft: '50px',
        '&::before': {
            left: '20px',
        },
    },
}));

const AnimatedSection = styled(motion.div)({
    width: '100%',
});

const SkillPath = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        skills: [],
        experience: '',
        bloodGroup: '',
        certifications: [],
        previousCompanies: [],
        previousProjects: [],
    });
    const [submitting, setSubmitting] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const token = localStorage.getItem('token');
    const isAdmin = JSON.parse(localStorage.getItem('userData'))?.isAdmin;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch employee profile
            const profileResponse = await axios.get(`${BaseUrl}/employees/profile`, { headers });
            setEmployeeData(profileResponse.data.employee);

            // If admin, fetch all employees
            if (isAdmin) {
                const allEmployeesResponse = await axios.get(`${BaseUrl}/employees`, { headers });
                setAllEmployees(allEmployeesResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        try {
            setSubmitting(true);

            // Debug logging
            // console.log('BaseUrl:', BaseUrl);
            // console.log('Employee ID:', employeeData._id);
            // console.log('Update URL:', `${BaseUrl}/employee/update-professional/${employeeData._id}`);

            const response = await axios.put(
                `${BaseUrl}/employees/update-professional/${employeeData._id}`,  // Updated endpoint
                {
                    skills: editForm.skills,
                    experience: editForm.experience,
                    bloodGroup: editForm.bloodGroup,
                    previousCompanies: editForm.previousCompanies,
                    previousProjects: editForm.previousProjects,
                    certifications: editForm.certifications
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Server Response:', response.data); // Debug logging

            if (response.data && response.data.employee) {
                setEmployeeData(response.data.employee);
                setEditModalOpen(false);
                toast.success('Profile updated successfully');
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url
            });
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Chart data preparation for admin view
    const prepareChartData = () => {
        if (!isAdmin || !allEmployees.length) return null;

        // Skills distribution
        const skillsData = {
            labels: ['Advanced', 'Intermediate', 'Beginner'],
            datasets: [{
                data: [
                    allEmployees.reduce((acc, emp) => acc + emp.skills.filter(s => s.level === 'Advanced').length, 0),
                    allEmployees.reduce((acc, emp) => acc + emp.skills.filter(s => s.level === 'Intermediate').length, 0),
                    allEmployees.reduce((acc, emp) => acc + emp.skills.filter(s => s.level === 'Beginner').length, 0),
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
            }],
        };

        // Team distribution
        const teamData = {
            labels: [...new Set(allEmployees.map(emp => emp.team))],
            datasets: [{
                label: 'Team Distribution',
                data: [...new Set(allEmployees.map(emp => emp.team))].map(team =>
                    allEmployees.filter(emp => emp.team === team).length
                ),
                backgroundColor: 'rgba(49, 17, 136, 0.6)',
            }],
        };

        return { skillsData, teamData };
    };

    if (loading) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            }}>
                <CircularProgress sx={{ color: '#311188' }} />
            </Box>
        );
    }

    const chartData = prepareChartData();

    return (
        <PageContainer>
            <Container maxWidth="xl">
                <AnimatedSection
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <ProfileSection>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 4, 
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <StyledAvatar 
                                src={employeeData?.profileImage}
                                sx={{ 
                                    width: 120, 
                                    height: 120,
                                    border: '4px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                {employeeData?.name?.charAt(0)}
                            </StyledAvatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h3" gutterBottom fontWeight="bold">
                                    {employeeData?.name}
                                </Typography>
                                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                                    {employeeData?.role} • {employeeData?.team}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={employeeData?.employeeId}
                                        icon={<Person />}
                                        sx={{ background: 'rgba(255,255,255,0.1)' }}
                                    />
                                    <Chip
                                        label={employeeData?.experience}
                                        icon={<Work />}
                                        sx={{ background: 'rgba(255,255,255,0.1)' }}
                                    />
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => {
                                    setEditForm({
                                        skills: employeeData.skills || [],
                                        experience: employeeData.experience || '',
                                        previousCompanies: employeeData.previousCompanies || [],
                                        previousProjects: employeeData.previousProjects || [],
                                        certifications: employeeData.certifications || [],
                                        bloodGroup: employeeData.bloodGroup || '',
                                    });
                                    setEditModalOpen(true);
                                }}
                                sx={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.2)',
                                    }
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </ProfileSection>

                    {/* Skills Section */}
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h4" gutterBottom sx={{ 
                            color: '#311188',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: '60px',
                                height: '3px',
                                background: 'linear-gradient(90deg, #311188, #22c55e)',
                                borderRadius: '2px',
                            }
                        }}>
                            Skills & Expertise
                        </Typography>
                        <SkillsGrid>
                            {employeeData?.skills?.map((skill, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Box>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            {skill.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 60 : 30}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: 'rgba(49, 17, 136, 0.1)',
                                                        '& .MuiLinearProgress-bar': {
                                                            background: 'linear-gradient(90deg, #311188, #22c55e)',
                                                            borderRadius: 4,
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="primary">
                                                {skill.level}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            ))}
                        </SkillsGrid>
                    </Box>

                    {/* Experience Timeline */}
                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h4" gutterBottom sx={{ 
                            color: '#311188',
                            mb: 6,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: '60px',
                                height: '3px',
                                background: 'linear-gradient(90deg, #311188, #22c55e)',
                                borderRadius: '2px',
                            }
                        }}>
                            Professional Journey
                        </Typography>
                        <TimelineWrapper>
                            {employeeData?.previousCompanies?.map((company, index) => (
                                <EnhancedTimelineItem key={index} align={index % 2 === 0 ? 'left' : 'right'}>
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        style={{ width: '45%' }}
                                    >
                                        <Box sx={{
                                            p: 3,
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '15px',
                                            boxShadow: '0 4px 20px rgba(49, 17, 136, 0.05)',
                                        }}>
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                {company.companyName}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                {company.role}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {format(new Date(company.startDate), 'MMM yyyy')} - 
                                                {format(new Date(company.endDate), 'MMM yyyy')}
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {company.technologiesUsed?.map((tech, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={tech}
                                                        size="small"
                                                        sx={{
                                                            background: 'rgba(49, 17, 136, 0.1)',
                                                            color: '#311188',
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </EnhancedTimelineItem>
                            ))}
                        </TimelineWrapper>
                    </Box>

                    {/* Projects Section */}
                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h4" gutterBottom sx={{ 
                            color: '#311188',
                            mb: 4,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: '60px',
                                height: '3px',
                                background: 'linear-gradient(90deg, #311188, #22c55e)',
                                borderRadius: '2px',
                            }
                        }}>
                            Project Experience
                        </Typography>
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 4,
                        }}>
                            {employeeData?.previousProjects?.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Box sx={{
                                        p: 3,
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '15px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #311188, #22c55e)',
                                        },
                                    }}>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            {project.projectName}
                                        </Typography>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            {project.client}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            {project.description}
                                        </Typography>
                                        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {project.technologiesUsed?.map((tech, i) => (
                                                <Chip
                                                    key={i}
                                                    label={tech}
                                                    size="small"
                                                    sx={{
                                                        background: 'rgba(49, 17, 136, 0.1)',
                                                        color: '#311188',
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                </AnimatedSection>
            </Container>

            {/* Edit Profile Modal with enhanced styling */}
            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        [theme.breakpoints.down('sm')]: {
                            margin: '16px',
                            width: 'calc(100% - 32px)',
                            maxHeight: 'calc(100% - 32px)',
                        },
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                    color: 'white',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Edit Professional Details</Typography>
                        <IconButton
                            onClick={() => setEditModalOpen(false)}
                            sx={{ color: 'white' }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {/* Skills Section */}
                        <StyledAccordion defaultExpanded>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Skills
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.skills.map((skill, index) => (
                                    <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Skill Name"
                                            value={skill.name}
                                            onChange={(e) => {
                                                const newSkills = [...editForm.skills];
                                                newSkills[index].name = e.target.value;
                                                setEditForm({ ...editForm, skills: newSkills });
                                            }}
                                            sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}
                                        />
                                        <StyledTextField
                                            select
                                            label="Level"
                                            value={skill.level}
                                            onChange={(e) => {
                                                const newSkills = [...editForm.skills];
                                                newSkills[index].level = e.target.value;
                                                setEditForm({ ...editForm, skills: newSkills });
                                            }}
                                            sx={{ width: { xs: '100%', sm: 200 } }}
                                        >
                                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                                <MenuItem key={level} value={level}>
                                                    {level}
                                                </MenuItem>
                                            ))}
                                        </StyledTextField>
                                        <IconButton
                                            onClick={() => {
                                                const newSkills = editForm.skills.filter((_, i) => i !== index);
                                                setEditForm({ ...editForm, skills: newSkills });
                                            }}
                                            sx={{
                                                alignSelf: 'center',
                                                color: theme.palette.error.main,
                                                '&:hover': {
                                                    background: theme.palette.error.light,
                                                },
                                            }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Box>
                                ))}
                                <AnimatedAddButton
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            skills: [...editForm.skills, { name: '', level: 'Beginner', endorsedBy: [] }]
                                        });
                                    }}
                                >
                                    Add Skill
                                </AnimatedAddButton>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Certifications Section */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Certifications
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.certifications.map((cert, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.5)' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Certification Name"
                                                    value={cert.name}
                                                    onChange={(e) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index].name = e.target.value;
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Issuer"
                                                    value={cert.issuer}
                                                    onChange={(e) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index].issuer = e.target.value;
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="Issue Date"
                                                    value={cert.issueDate ? new Date(cert.issueDate) : null}
                                                    onChange={(newDate) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index].issueDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Certificate URL"
                                                    value={cert.certificateUrl}
                                                    onChange={(e) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index].certificateUrl = e.target.value;
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <IconButton
                                                    onClick={() => {
                                                        const newCerts = editForm.certifications.filter((_, i) => i !== index);
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <AnimatedAddButton
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            certifications: [...editForm.certifications, {
                                                name: '',
                                                issuer: '',
                                                issueDate: new Date().toISOString(),
                                                certificateUrl: ''
                                            }]
                                        });
                                    }}
                                >
                                    Add Certification
                                </AnimatedAddButton>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Work Experience Section */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Work Experience
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.previousCompanies.map((company, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.5)' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Company Name"
                                                    value={company.companyName}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].companyName = e.target.value;
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Role"
                                                    value={company.role}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].role = e.target.value;
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={company.startDate ? new Date(company.startDate) : null}
                                                    onChange={(newDate) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].startDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={company.endDate ? new Date(company.endDate) : null}
                                                    onChange={(newDate) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].endDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Location"
                                                    value={company.location}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].location = e.target.value;
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    label="Technologies Used"
                                                    value={company.technologiesUsed?.join(', ')}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].technologiesUsed = e.target.value.split(',').map(t => t.trim());
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    helperText="Enter technologies separated by commas"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <IconButton
                                                    onClick={() => {
                                                        const newCompanies = editForm.previousCompanies.filter((_, i) => i !== index);
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <AnimatedAddButton
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            previousCompanies: [...editForm.previousCompanies, {
                                                companyName: '',
                                                role: '',
                                                startDate: new Date().toISOString(),
                                                endDate: new Date().toISOString(),
                                                location: '',
                                                technologiesUsed: []
                                            }]
                                        });
                                    }}
                                >
                                    Add Work Experience
                                </AnimatedAddButton>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Project Experience Section */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Project Experience
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.previousProjects.map((project, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.5)' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Project Name"
                                                    value={project.projectName}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].projectName = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Client"
                                                    value={project.client}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].client = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label="Description"
                                                    value={project.description}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].description = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={project.startDate ? new Date(project.startDate) : null}
                                                    onChange={(newDate) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].startDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={project.endDate ? new Date(project.endDate) : null}
                                                    onChange={(newDate) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].endDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Team Size"
                                                    type="number"
                                                    value={project.teamSize}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].teamSize = parseInt(e.target.value);
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Project URL"
                                                    value={project.projectUrl}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].projectUrl = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    label="Technologies Used"
                                                    value={project.technologiesUsed?.join(', ')}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].technologiesUsed = e.target.value.split(',').map(t => t.trim());
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    helperText="Enter technologies separated by commas"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    label="Responsibilities"
                                                    value={project.responsibilities?.join(', ')}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].responsibilities = e.target.value.split(',').map(r => r.trim());
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    helperText="Enter responsibilities separated by commas"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <IconButton
                                                    onClick={() => {
                                                        const newProjects = editForm.previousProjects.filter((_, i) => i !== index);
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <AnimatedAddButton
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            previousProjects: [...editForm.previousProjects, {
                                                projectName: '',
                                                client: '',
                                                description: '',
                                                startDate: new Date().toISOString(),
                                                endDate: new Date().toISOString(),
                                                teamSize: 1,
                                                projectUrl: '',
                                                technologiesUsed: [],
                                                responsibilities: []
                                            }]
                                        });
                                    }}
                                >
                                    Add Project
                                </AnimatedAddButton>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Basic Information */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Basic Information
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="Experience"
                                            value={editForm.experience}
                                            onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="Blood Group"
                                            value={editForm.bloodGroup}
                                            onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </StyledAccordion>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setEditModalOpen(false)}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        onClick={handleEditSubmit}
                        loading={submitting}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                            color: 'white',
                        }}
                    >
                        Save Changes
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default SkillPath; 