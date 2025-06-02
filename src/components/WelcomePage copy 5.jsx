import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
    useMediaQuery,
    useTheme,
    Divider,
    Paper,
    Chip,
    IconButton,
    MobileStepper,
    LinearProgress,
} from '@mui/material';
import {
    Dashboard,
    People,
    CreditCard,
    Link as LinkIcon,
    ConfirmationNumber,
    Notifications,
    TrendingUp,
    Lightbulb,
    Favorite,
    AccessTime,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    Assignment as ProjectIcon,
    CheckCircle as ApprovedIcon,
    PendingActions as PendingIcon,
    Block as RejectedIcon,
    Close as DroppedIcon,
    Folder as OpenProjectIcon,
    FolderOff as ClosedProjectIcon,
    BarChart as ChartIcon,
    DonutLarge as DonutIcon,
    Timeline as TimelineIcon,
    Speed as SpeedIcon,
    Code,
    Business,
    SupervisorAccount,
    Support,
    DesignServices,
    Engineering,
    Analytics,
    WorkspacePremium,
    Diversity3,
    Groups,
    Celebration,
    EmojiEvents,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import BaseUrl from '../Api';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from 'chart.js';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import CountUp from 'react-countup';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
);

// Styled Components
const StatsCard = styled(motion.div)(({ theme, gradient }) => ({
    background: gradient || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    color: 'white',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 50%)',
        zIndex: 0,
    },
}));

const IconCircle = styled(Box)(({ theme }) => ({
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'rotate(10deg)',
        background: 'rgba(255, 255, 255, 0.2)',
    },
}));

const GradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
}));

const MetricCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
}));

const ChartContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '& .MuiLinearProgress-bar': {
        borderRadius: 5,
    },
}));

const GradientHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(-45deg, #6366f1, #8b5cf6, #d946ef, #ec4899)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    padding: theme.spacing(8, 0),
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '@keyframes gradient': {
        '0%': {
            backgroundPosition: '0% 50%'
        },
        '50%': {
            backgroundPosition: '100% 50%'
        },
        '100%': {
            backgroundPosition: '0% 50%'
        },
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
    },
}));

const QuickAccessCard = styled(motion.div)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    },
}));

const GlowingIcon = styled(Avatar)(({ theme, color }) => ({
    background: `linear-gradient(135deg, ${color}20, ${color}40)`,
    color: color,
    width: 56,
    height: 56,
    boxShadow: `0 0 20px ${color}40`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));

const RoleCard = styled(motion.div)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    },
}));

const WelcomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const [userData, setUserData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const [employeeStats, setEmployeeStats] = useState({
        total: 0,
        roleWise: {}
    });
    const [ticketStats, setTicketStats] = useState({
        Open: 0,
        Resolved: 0,
        Breached: 0
    });
    const [projectStats, setProjectStats] = useState({
        totalProjects: 0,
        openProjects: 0,
        closedProjects: 0,
        totalApplications: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        dropped: 0
    });

    useEffect(() => {
        // Get user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }

        // Update greeting based on time of day
        const hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good Morning');
        } else if (hours < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        // Fetch project stats
        const fetchProjectStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BaseUrl}/mobility-stats/overview`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setProjectStats(response.data);
            } catch (error) {
                console.error('Error fetching project stats:', error);
            }
        };

        fetchProjectStats();

        return () => clearInterval(timer);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const floatVariants = {
        initial: { y: 0 },
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    const pulseVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const [employeeResponse, ticketResponse] = await Promise.all([
                    axios.get(`${BaseUrl}/employees/count`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`${BaseUrl}/tickets/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                setEmployeeStats(employeeResponse.data);
                setTicketStats({
                    Open: ticketResponse.data.open || 0,
                    Resolved: ticketResponse.data.resolved || 0,
                    Breached: ticketResponse.data.breached || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Add isAdmin check
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Quick links data
    const quickLinks = [
        {
            title: 'Team Members',
            icon: <Groups />,
            color: '#6366f1',
            path: '/employees',
            description: 'Manage your team'
        },
        {
            title: 'Projects',
            icon: <ProjectIcon />,
            color: '#8b5cf6',
            path: '/projects',
            description: 'Track project progress'
        },
        {
            title: 'Support',
            icon: <Support />,
            color: '#ec4899',
            path: '/tickets',
            description: 'Get help and support'
        },
        {
            title: 'Analytics',
            icon: <Analytics />,
            color: '#10b981',
            path: '/analytics',
            description: 'View insights'
        },
    ];

    // Recent activities (mock data)
    const recentActivities = [
        { title: 'New employee onboarded', time: '2 hours ago', icon: <People />, color: '#8b5cf6' },
        { title: 'IT support ticket resolved', time: '4 hours ago', icon: <ConfirmationNumber />, color: '#f59e0b' },
        { title: 'Company meeting scheduled', time: 'Yesterday', icon: <AccessTime />, color: '#10b981' },
        { title: 'New announcement posted', time: '2 days ago', icon: <Notifications />, color: '#ef4444' }
    ];

    const rotateVariants = {
        initial: { rotate: 0 },
        animate: {
            rotate: 360,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const glowVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 0.5,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const statsCardVariants = {
        initial: { y: 20, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    }

    const bounceVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 0, -10],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    }

    // Stats cards data
    const statsCards = [
        {
            title: 'Employee Overview',
            value: employeeStats.total.toString(),
            subStats: [
                { label: 'DevOps', value: employeeStats.roleWise?.DevOps || 0 },
                { label: 'Developer', value: employeeStats.roleWise?.Developer || 0 },
                { label: 'HR', value: employeeStats.roleWise?.HR || 0 }
            ],
            icon: <People />,
            color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            bgPattern: 'radial-gradient(circle at 90% 90%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        },
        {
            title: 'Ticket Status',
            value: Object.values(ticketStats).reduce((a, b) => a + b, 0).toString(),
            subStats: [
                { label: 'Open', value: ticketStats.Open || 0 },
                { label: 'Resolved', value: ticketStats.Resolved || 0 },
                { label: 'Breached', value: ticketStats.Breached || 0 }
            ],
            icon: <ConfirmationNumber />,
            color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            bgPattern: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }
    ];

    // Chart Data
    const doughnutData = {
        labels: ['Open', 'Closed'],
        datasets: [{
            data: [projectStats.openProjects, projectStats.closedProjects],
            backgroundColor: ['#4f46e5', '#6b7280'],
            borderWidth: 0,
        }]
    };

    const applicationData = {
        labels: ['Pending', 'Approved', 'Rejected', 'Dropped'],
        datasets: [{
            label: 'Applications',
            data: [
                projectStats.pending,
                projectStats.approved,
                projectStats.rejected,
                projectStats.dropped
            ],
            backgroundColor: [
                '#f59e0b',
                '#10b981',
                '#ef4444',
                '#6b7280'
            ],
            borderRadius: 8,
        }]
    };

    const successRateData = {
        labels: ['Success Rate', 'Pending Rate'],
        datasets: [{
            data: [
                (projectStats.approved / projectStats.totalApplications) * 100 || 0,
                (projectStats.pending / projectStats.totalApplications) * 100 || 0,
            ],
            backgroundColor: ['#10b981', '#f59e0b'],
            borderWidth: 0,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    const roleIcons = {
        Developer: <Code />,
        Manager: <SupervisorAccount />,
        HR: <People />,
        DevOps: <Engineering />,
        Support: <Support />,
        'UI/UX': <DesignServices />,
        CEO: <Business />,
        CTO: <Engineering />,
        CFO: <Analytics />,
        CMO: <TrendingUp />,
        COO: <SpeedIcon />,
        Testing: <Lightbulb />
    };

    const roleColors = {
        Developer: '#6366f1',
        Manager: '#8b5cf6',
        HR: '#ec4899',
        DevOps: '#10b981',
        Support: '#f59e0b',
        'UI/UX': '#3b82f6',
        CEO: '#ef4444',
        CTO: '#8b5cf6',
        CFO: '#6366f1',
        CMO: '#ec4899',
        COO: '#10b981',
        Testing: '#f59e0b'
    };

    const pieChartData = Object.entries(employeeStats.roleWise || {}).map(([role, count]) => ({
        label: role,
        value: count,
        color: roleColors[role] || '#6366f1'
    }));

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Animated Gradient Header */}
            <GradientHeader>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <Celebration sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }} />
                                Welcome back, {userData?.name || 'User'}!
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 500,
                                    opacity: 0.9,
                                    maxWidth: 600,
                                    lineHeight: 1.6
                                }}
                            >
                                Your gateway to managing teams, projects, and company resources all in one place.
                            </Typography>
                        </Box>
                    </motion.div>
                </Container>
            </GradientHeader>

            <Container maxWidth="xl" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
                {/* Quick Access Section */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {quickLinks.map((link, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <QuickAccessCard
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(link.path)}
                            >
                                <Box sx={{ p: 3 }}>
                                    <GlowingIcon color={link.color}>
                                        {link.icon}
                                    </GlowingIcon>
                                    <Typography
                                        variant="h6"
                                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                                    >
                                        {link.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {link.description}
                                    </Typography>
                                </Box>
                            </QuickAccessCard>
                        </Grid>
                    ))}
                </Grid>

                {/* Employee Overview Section */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <EmojiEvents sx={{ color: '#6366f1', fontSize: '2rem' }} />
                        <Typography variant="h4" fontWeight="bold">
                            Team Overview
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Total Employees Card */}
                        <Grid item xs={12} md={4}>
                            <StatsCard
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                                        Total Team Members
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                        <Typography variant="h2" fontWeight="bold">
                                            <CountUp end={employeeStats.total} duration={2} />
                                        </Typography>
                                        <Typography variant="h5">members</Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                                        Across {Object.keys(employeeStats.roleWise || {}).length} different roles
                                    </Typography>
                                </Box>
                            </StatsCard>
                        </Grid>

                        {/* Team Distribution Chart */}
                        <Grid item xs={12} md={8}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Team Distribution
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    <PieChart
                                        series={[
                                            {
                                                data: pieChartData,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30 },
                                            },
                                        ]}
                                        height={300}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Role Cards */}
                    <Grid container spacing={2} sx={{ mt: 4 }}>
                        {Object.entries(employeeStats.roleWise || {}).map(([role, count], index) => (
                            <Grid item xs={12} sm={6} md={4} key={role}>
                                <RoleCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: `${roleColors[role]}20`,
                                            color: roleColors[role],
                                        }}
                                    >
                                        {roleIcons[role] || <Groups />}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="600">
                                            {role}
                                        </Typography>
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            {count} {count === 1 ? 'member' : 'members'}
                                        </Typography>
                                    </Box>
                                </RoleCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default WelcomePage;


