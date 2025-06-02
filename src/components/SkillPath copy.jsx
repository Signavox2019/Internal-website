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
import { styled } from '@mui/material/styles';
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

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
}));

const SkillChip = styled(Chip)(({ theme, level }) => ({
    borderRadius: '12px',
    fontWeight: 500,
    background: level === 'Advanced' 
        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
        : level === 'Intermediate'
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
        : 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
}));

const DetailRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(49, 17, 136, 0.02)',
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    border: '4px solid white',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(49, 17, 136, 0.1)',
    '& .MuiLinearProgress-bar': {
        background: value >= 75
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : value >= 50
            ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
            : 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
}));

const ChartContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    height: '100%',
}));

const GradientBorderCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '24px',
        padding: '2px',
        background: 'linear-gradient(45deg, #311188, #0A081E)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
    },
    '&:hover': {
        transform: 'translateY(-5px)',
        '&::before': {
            background: 'linear-gradient(45deg, #22c55e, #311188)',
        },
    },
    transition: 'all 0.3s ease',
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        width: '50%',
        height: '50%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(49, 17, 136, 0.1) 0%, transparent 70%)',
        animation: 'pulse 15s infinite',
    },
    '&::before': {
        top: '-10%',
        right: '-10%',
    },
    '&::after': {
        bottom: '-10%',
        left: '-10%',
        animationDelay: '-7.5s',
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1) translate(0, 0)',
        },
        '50%': {
            transform: 'scale(1.2) translate(5%, 5%)',
        },
        '100%': {
            transform: 'scale(1) translate(0, 0)',
        },
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.95)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
        },
        '&.Mui-focused': {
            background: 'rgba(255, 255, 255, 1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(49, 17, 136, 0.15)',
        },
    },
}));

// Add new styled components
const StyledAccordion = styled((props) => (
    <Accordion {...props} />
))(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px !important',
    marginBottom: theme.spacing(2),
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        margin: `${theme.spacing(2)} 0`,
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    borderRadius: '12px',
    '&.Mui-expanded': {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.05) 0%, rgba(10, 8, 30, 0.05) 100%)',
}));

const AnimatedAddButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '8px 24px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(49, 17, 136, 0.2)',
    },
}));

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
        <>
            <AnimatedBackground />
            <Box sx={{
                minHeight: '100vh',
                px: { xs: 2, sm: 4, md: 8 },
                py: 4,
                position: 'relative',
            }}>
                <ToastContainer />
                <Container maxWidth="xl">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <GradientBorderCard sx={{ mb: 4 }}>
                            <Box sx={{
                                p: { xs: 2, sm: 3, md: 4 },
                                background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                                color: 'white',
                            }}>
                                <Grid container spacing={3} alignItems="center">
                                    <Grid item>
                                        <StyledAvatar src={employeeData?.profileImage}>
                                            {employeeData?.name?.charAt(0)}
                                        </StyledAvatar>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h4" gutterBottom fontWeight="bold">
                                            {employeeData?.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                            {employeeData?.role} • {employeeData?.team}
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                                            {employeeData?.isTeamLead && (
                                                <Chip
                                                    label="Team Lead"
                                                    icon={<VerifiedUser />}
                                                    sx={{ background: 'rgba(255,255,255,0.1)' }}
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item>
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
                                                borderRadius: '12px',
                                                background: 'rgba(255,255,255,0.1)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'rgba(255,255,255,0.2)',
                                                }
                                            }}
                                        >
                                            Edit Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </GradientBorderCard>
                    </motion.div>

                    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                        {/* Skills Section */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#311188',
                                        fontWeight: 600,
                                    }}>
                                        <Code /> Skills & Expertise
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {employeeData?.skills?.map((skill, index) => (
                                            <Box key={index} sx={{ mb: 2 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                }}>
                                                    <Typography variant="subtitle2">
                                                        {skill.name}
                                                    </Typography>
                                                    <SkillChip
                                                        label={skill.level}
                                                        level={skill.level}
                                                        size="small"
                                                    />
                                                </Box>
                                                <ProgressBar
                                                    variant="determinate"
                                                    value={
                                                        skill.level === 'Advanced' ? 90 :
                                                        skill.level === 'Intermediate' ? 60 : 30
                                                    }
                                                />
                                                {skill.endorsedBy?.length > 0 && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                        Endorsed by {skill.endorsedBy.length} {skill.endorsedBy.length === 1 ? 'person' : 'people'}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Certifications Section */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#311188',
                                        fontWeight: 600,
                                    }}>
                                        <School /> Certifications
                                    </Typography>
                                    <List>
                                        {employeeData?.certifications?.map((cert, index) => (
                                            <ListItem
                                                key={index}
                                                sx={{
                                                    borderRadius: 2,
                                                    mb: 1,
                                                    '&:hover': {
                                                        background: 'rgba(49, 17, 136, 0.02)',
                                                    }
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <VerifiedUser sx={{ color: '#311188' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={cert.name}
                                                    secondary={`${cert.issuer} • ${format(new Date(cert.issueDate), 'MMM yyyy')}`}
                                                />
                                                {cert.certificateUrl && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => window.open(cert.certificateUrl, '_blank')}
                                                    >
                                                        <OpenInNew />
                                                    </IconButton>
                                                )}
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Previous Companies Section */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#311188',
                                        fontWeight: 600,
                                    }}>
                                        <Business /> Work Experience
                                    </Typography>
                                    <Timeline>
                                        {employeeData?.previousCompanies?.map((company, index) => (
                                            <Box key={index} sx={{ mb: 3 }}>
                                                <DetailRow>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {company.companyName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {company.role} • {company.location}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {format(new Date(company.startDate), 'MMM yyyy')} - 
                                                            {format(new Date(company.endDate), 'MMM yyyy')}
                                                        </Typography>
                                                        <Box sx={{ mt: 1 }}>
                                                            {company.technologiesUsed?.map((tech, i) => (
                                                                <Chip
                                                                    key={i}
                                                                    label={tech}
                                                                    size="small"
                                                                    sx={{
                                                                        mr: 1,
                                                                        mb: 1,
                                                                        background: 'rgba(49, 17, 136, 0.1)',
                                                                        color: '#311188',
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </DetailRow>
                                            </Box>
                                        ))}
                                    </Timeline>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Previous Projects Section */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#311188',
                                        fontWeight: 600,
                                    }}>
                                        <Assignment /> Project Experience
                                    </Typography>
                                    {employeeData?.previousProjects?.map((project, index) => (
                                        <Box key={index} sx={{ mb: 3 }}>
                                            <DetailRow>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {project.projectName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {project.role} • {project.client}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                                        {project.description}
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {project.technologiesUsed?.map((tech, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={tech}
                                                                size="small"
                                                                sx={{
                                                                    mr: 1,
                                                                    mb: 1,
                                                                    background: 'rgba(49, 17, 136, 0.1)',
                                                                    color: '#311188',
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                    <List dense>
                                                        {project.responsibilities?.map((resp, i) => (
                                                            <ListItem key={i} sx={{ px: 0 }}>
                                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                                    <Star sx={{ fontSize: 16, color: '#311188' }} />
                                                                </ListItemIcon>
                                                                <ListItemText primary={resp} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            </DetailRow>
                                        </Box>
                                    ))}
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Analytics Section (Admin Only) */}
                        {isAdmin && chartData && (
                            <>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 4 }}>
                                        <Chip
                                            label="Team Analytics"
                                            icon={<Assessment />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                                                color: 'white',
                                                '& .MuiChip-icon': { color: 'white' },
                                            }}
                                        />
                                    </Divider>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <ChartContainer>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#311188', mb: 3 }}>
                                            <PieChart sx={{ mr: 1 }} /> Skill Level Distribution
                                        </Typography>
                                        <Box sx={{ height: 300 }}>
                                            <Pie data={chartData.skillsData} options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                            }} />
                                        </Box>
                                    </ChartContainer>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <ChartContainer>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#311188', mb: 3 }}>
                                            <BarChart sx={{ mr: 1 }} /> Team Distribution
                                        </Typography>
                                        <Box sx={{ height: 300 }}>
                                            <Bar data={chartData.teamData} options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            stepSize: 1,
                                                        },
                                                    },
                                                },
                                            }} />
                                        </Box>
                                    </ChartContainer>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Container>

                {/* Edit Profile Modal */}
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
            </Box>
        </>
    );
};

export default SkillPath; 