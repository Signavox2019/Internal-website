import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    IconButton,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Avatar,
    Tooltip,
    Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
    People,
    Business,
    Assignment,
    TrendingUp,
    CalendarMonth,
    Groups,
    Engineering,
    Code,
    Support,
    DesignServices,
    Analytics,
    Speed as SpeedIcon,
    Lightbulb,
    NavigateNext,
    NavigateBefore,
    Celebration,
    EmojiEvents,
    WorkspacePremium,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import BaseUrl from '../Api';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement
);

// Styled Components
const GradientHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(-45deg, #6366f1, #8b5cf6, #d946ef, #ec4899)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    padding: theme.spacing(8, 0),
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' }
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

const StatsCard = styled(motion.div)(({ theme, gradient }) => ({
    background: gradient || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    color: 'white',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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

const GlassCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.95)',
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
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    height: '100%',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
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
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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

const WelcomePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [userData, setUserData] = useState(null);
    const [employeeStats, setEmployeeStats] = useState({ total: 0, roleWise: {}, teamWise: {} });
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
    const [dateWiseStats, setDateWiseStats] = useState([]);
    const [startDate, setStartDate] = useState(dayjs().startOf('year'));
    const [endDate, setEndDate] = useState(dayjs().endOf('year'));

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }

        fetchData();
    }, []);

    useEffect(() => {
        fetchDateWiseStats();
    }, [startDate, endDate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [employeeResponse, projectResponse] = await Promise.all([
                axios.get(`${BaseUrl}/employees/count`, { headers }),
                axios.get(`${BaseUrl}/mobility-stats/overview`, { headers })
            ]);

            setEmployeeStats(employeeResponse.data);
            setProjectStats(projectResponse.data);
            console.log(projectResponse.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchDateWiseStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${BaseUrl}/mobility-stats/datewise?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setDateWiseStats(response.data);
        } catch (error) {
            console.error('Error fetching date wise stats:', error);
        }
    };

    // Check for admin access
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

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

    const applicationChartData = {
        labels: dateWiseStats.map(stat => stat.date),
        datasets: [
            {
                label: 'Pending',
                data: dateWiseStats.map(stat => stat.counts.pending || 0),
                borderColor: '#f59e0b',
                backgroundColor: '#f59e0b20',
                fill: true,
            },
            {
                label: 'Approved',
                data: dateWiseStats.map(stat => stat.counts.approved || 0),
                borderColor: '#10b981',
                backgroundColor: '#10b98120',
                fill: true,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#1a1a1a' }}>
            {/* Header Section */}
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

            <Container maxWidth="xl" sx={{ mt: -6, position: 'relative', zIndex: 2, pb: 8 }}>
                {/* Stats Overview */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
                    <StatsCard
                        gradient="linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)"
                        sx={{ flex: '1 1 300px' }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Total Employees
                        </Typography>
                        <Typography variant="h3">
                            <CountUp end={employeeStats.total} duration={2} />
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Across {Object.keys(employeeStats.teamWise || {}).length} teams
                        </Typography>
                    </StatsCard>

                    <StatsCard
                        gradient="linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)"
                        sx={{ flex: '1 1 300px' }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Total Projects
                        </Typography>
                        <Typography variant="h3">
                            <CountUp end={projectStats.totalProjects} duration={2} />
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="body1">
                                Open: {projectStats.openProjects}
                            </Typography>
                            <Typography variant="body1">
                                Closed: {projectStats.closedProjects}
                            </Typography>
                        </Box>
                    </StatsCard>

                    <StatsCard
                        gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
                        sx={{ flex: '1 1 300px' }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Applications
                        </Typography>
                        <Typography variant="h3">
                            <CountUp end={projectStats.totalApplications} duration={2} />
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="body1">
                                Pending: {projectStats.pending}
                            </Typography>
                            <Typography variant="body1">
                                Approved: {projectStats.approved}
                            </Typography>
                        </Box>
                    </StatsCard>
                </Box>

                {/* Charts Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" sx={{ color: 'white', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EmojiEvents />
                        Analytics Overview
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Team Distribution */}
                        <Grid item xs={12} md={6}>
                            <ChartContainer>
                                <Typography variant="h6" gutterBottom>
                                    Team Distribution
                                </Typography>
                                <Box sx={{ flexGrow: 1, height: 300 }}>
                                    <PieChart
                                        series={[{
                                            data: Object.entries(employeeStats.teamWise || {}).map(([team, count]) => ({
                                                id: team,
                                                value: count,
                                                label: team
                                            }))
                                        }]}
                                        height={300}
                                    />
                                </Box>
                            </ChartContainer>
                        </Grid>

                        {/* Role Distribution */}
                        <Grid item xs={12} md={6}>
                            <ChartContainer>
                                <Typography variant="h6" gutterBottom>
                                    Role Distribution
                                </Typography>
                                <Box sx={{ flexGrow: 1, height: 300 }}>
                                    <Bar
                                        data={{
                                            labels: Object.keys(employeeStats.roleWise || {}),
                                            datasets: [{
                                                label: 'Employees',
                                                data: Object.values(employeeStats.roleWise || {}),
                                                backgroundColor: Object.keys(employeeStats.roleWise || {}).map(
                                                    role => roleColors[role] || '#6366f1'
                                                )
                                            }]
                                        }}
                                        options={chartOptions}
                                    />
                                </Box>
                            </ChartContainer>
                        </Grid>

                        {/* Applications Timeline */}
                        <Grid item xs={12}>
                            <ChartContainer>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3, alignItems: 'center' }}>
                                    <Typography variant="h6">
                                        Applications Timeline
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Start Date"
                                                value={startDate}
                                                onChange={setStartDate}
                                                sx={{ bgcolor: 'white', borderRadius: 1 }}
                                            />
                                            <DatePicker
                                                label="End Date"
                                                value={endDate}
                                                onChange={setEndDate}
                                                sx={{ bgcolor: 'white', borderRadius: 1 }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                                <Box sx={{ flexGrow: 1, height: 400 }}>
                                    <Line data={applicationChartData} options={chartOptions} />
                                </Box>
                            </ChartContainer>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default WelcomePage;
