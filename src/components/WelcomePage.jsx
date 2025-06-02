import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Chip,
    Card,
    CardContent,
    IconButton,
    Divider,
    useTheme,
    LinearProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';
import {
    People,
    Assignment,
    WorkOutline,
    LocalHospital,
    DonutLarge,
    BarChart as BarChartIcon,
    Visibility,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import LoadingScreen from './LoadingScreen';

const glowVariants = {
    initial: { opacity: 0.5 },
    animate: {
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
        }
    }
};

const skillsProgressData = [
    { skill: 'React', progress: 85 },
    { skill: 'Node.js', progress: 75 },
    { skill: 'Python', progress: 70 },
    { skill: 'AWS', progress: 65 },
    { skill: 'Docker', progress: 80 },
];

const employeeGrowthData = [
    { month: 'Jan', employees: 50 },
    { month: 'Feb', employees: 55 },
    { month: 'Mar', employees: 58 },
    { month: 'Apr', employees: 62 },
    { month: 'May', employees: 65 },
    { month: 'Jun', employees: 70 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const WelcomePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const theme = useTheme();
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [employeeStats, setEmployeeStats] = useState(null);
    const [projectStats, setProjectStats] = useState(null);
    const [ticketStats, setTicketStats] = useState(null);
    const [mobilityStats, setMobilityStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [projectApplications, setProjectApplications] = useState([]);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [ticketYearlyStats, setTicketYearlyStats] = useState(null);
    const [availableYears] = useState([2025]); // Add more years as needed
    const [monthlyProjectData, setMonthlyProjectData] = useState([
        { month: 'Jan', completed: 4, ongoing: 3, upcoming: 2 },
        { month: 'Feb', completed: 3, ongoing: 4, upcoming: 3 },
        { month: 'Mar', completed: 5, ongoing: 2, upcoming: 4 },
        { month: 'Apr', completed: 6, ongoing: 3, upcoming: 2 },
        { month: 'May', completed: 4, ongoing: 5, upcoming: 3 },
        { month: 'Jun', completed: 7, ongoing: 2, upcoming: 4 },
    ]);
    const [teamDistributionData, setTeamDistributionData] = useState([
        { name: 'Development', value: 35 },
        { name: 'Design', value: 20 },
        { name: 'QA', value: 15 },
        { name: 'Management', value: 10 },
        { name: 'DevOps', value: 20 },
    ]);

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

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        setUserData(storedUserData);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };

                const [employeeRes, ticketRes, projectsRes, projectAppsRes, mobilityRes, ticketYearRes] = await Promise.all([
                    axios.get(`${BaseUrl}/employees/count`, { headers }),
                    axios.get(`${BaseUrl}/tickets/stats`, { headers }),
                    axios.get(`${BaseUrl}/projects`, { headers }),
                    axios.get(`${BaseUrl}/project-applications`, { headers }),
                    axios.get(`${BaseUrl}/mobility-stats/overview`, { headers }),
                    axios.get(`${BaseUrl}/tickets/status-counts/${selectedYear}`, { headers })
                ]);

                setEmployeeStats(employeeRes.data);
                setTicketStats(ticketRes.data);
                setProjects(projectsRes.data);
                setProjectApplications(projectAppsRes.data);
                setMobilityStats(mobilityRes.data);
                setTicketYearlyStats(ticketYearRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                // Ensure the loading screen shows for at least 3 seconds
                setTimeout(() => {
                    setInitialLoading(false);
                }, 500);
            }
        };

        fetchData();
    }, [selectedYear]);

    useEffect(() => {
        if (employeeStats?.roleWise) {
            const roleData = Object.entries(employeeStats.roleWise).map(([name, value]) => ({
                name,
                value: (value / employeeStats.total) * 100
            }));
            setTeamDistributionData(roleData);
        }
    }, [employeeStats]);

    const MetricCard = ({ icon: Icon, title, value, color }) => (
        <Card
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
                width: '100%',
                minHeight: { xs: '120px', sm: '140px' },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <CardContent sx={{
                p: { xs: 2, sm: 3 },
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                '&:last-child': { pb: { xs: 2, sm: 3 } }
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    gap: { xs: 1.5, sm: 2 }
                }}>
                    <Avatar
                        sx={{
                            bgcolor: `${color}15`,
                            color: color,
                            width: { xs: 45, sm: 52 },
                            height: { xs: 45, sm: 52 },
                        }}
                    >
                        <Icon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                lineHeight: 1.2,
                                mb: 0.5
                            }}
                        >
                            {value}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    if (initialLoading) {
        return <LoadingScreen />;
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2, sm: 3, md: 4 },
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            }}
        >
            {/* Animated background elements */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' }}>
                <motion.div
                    animate={{
                        rotate: 360,
                        transition: { duration: 60, repeat: Infinity, ease: "linear" }
                    }}
                    style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-50%',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
                    }}
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        transition: { duration: 50, repeat: Infinity, ease: "linear" }
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '-50%',
                        left: '-50%',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%)',
                    }}
                />
            </Box>

            <Container
                maxWidth={false}
                sx={{
                    width: '100%',
                    maxWidth: '1800px',
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 3, md: 4 }
                }}
            >
                {/* Enhanced Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <Box sx={{
                        mb: 0,
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        // background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)',
                        background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',

                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Enhanced Decorative Elements */}
                        <motion.div
                            variants={glowVariants}
                            initial="initial"
                            animate="animate"
                            style={{
                                position: 'absolute',
                                top: '-150px',
                                right: '-150px',
                                width: '400px',
                                height: '400px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                                borderRadius: '50%',
                                filter: 'blur(20px)',
                                zIndex: 0
                            }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {/* Animated decorative elements */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: -100,
                                        right: -100,
                                        width: 300,
                                        height: 300,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        zIndex: 0
                                    }}
                                />
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        transition: { duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }
                                    }}
                                    style={{
                                        position: 'absolute',
                                        bottom: -80,
                                        left: -80,
                                        width: 200,
                                        height: 200,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        zIndex: 0
                                    }}
                                />
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{
                                        fontSize: { xs: '1.75rem', md: '2.5rem' },
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {greeting},
                                    <motion.span
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        style={{
                                            background: 'linear-gradient(to right, #fff, #e0e7ff)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        {userData?.name || 'User'}!
                                    </motion.span>
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        opacity: 0.9,
                                        mb: 2,
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }}
                                >
                                    {currentTime.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        maxWidth: '800px',
                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                        lineHeight: 1.6
                                    }}
                                >
                                    Welcome to your Signavox portal. Access all your company resources,
                                    information, and tools in one place.
                                </Typography>
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>

                {/* Metrics Grid */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 2, sm: 3 },
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'stretch'
                    }}
                >
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' },
                            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' },
                            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' }
                        }}
                    >
                        <MetricCard
                            icon={People}
                            title="Total Employees"
                            value={loading ? '...' : employeeStats?.total || '0'}
                            color="#3b82f6"
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' },
                            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' },
                            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' }
                        }}
                    >
                        <MetricCard
                            icon={Assignment}
                            title="Open Projects"
                            value={loading ? '...' : mobilityStats?.projects?.open || '0'}
                            color="#10b981"
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' },
                            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' },
                            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' }
                        }}
                    >
                        <MetricCard
                            icon={WorkOutline}
                            title="Pending Applications"
                            value={loading ? '...' : mobilityStats?.applications?.pending || '0'}
                            color="#f59e0b"
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' },
                            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' },
                            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' }
                        }}
                    >
                        <MetricCard
                            icon={LocalHospital}
                            title="Open Tickets"
                            value={loading ? '...' : ticketStats?.open || '0'}
                            color="#8b5cf6"
                        />
                    </Box>
                </Box>

                {/* Charts Grid - Top Row */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 2, sm: 3 },
                        width: '100%',
                        mb: { xs: 2, sm: 3 }
                    }}
                >
                    {/* Ticket Statistics */}
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' },
                            minWidth: { xs: '100%', lg: 'calc(50% - 12px)' },
                            maxWidth: { xs: '100%', lg: 'calc(50% - 12px)' },
                            display: 'flex'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderRadius: { xs: 2, sm: 3, md: 4 },
                                height: { xs: '350px', sm: '450px' },
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                    '&::before': {
                                        opacity: 1
                                    }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderRadius: 'inherit',
                                    border: '2px solid transparent',
                                    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.2), rgba(10, 8, 30, 0.2)) border-box',
                                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease-in-out'
                                }
                            }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BarChartIcon sx={{ color: '#3b82f6', fontSize: '28px' }} />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #311188, #0A081E)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Ticket Statistics
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            value={selectedYear}
                                            label="Year"
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            sx={{
                                                bgcolor: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(0,0,0,0.1)',
                                                },
                                            }}
                                        >
                                            {availableYears.map((year) => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton 
                                        onClick={() => navigate('/tickets')}
                                        sx={{ 
                                            color: '#3b82f6',
                                            '&:hover': {
                                                background: 'rgba(59, 130, 246, 0.1)'
                                            }
                                        }}
                                    >
                                        <Visibility />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1, width: '100%', minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress sx={{ color: '#3b82f6' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Loading ticket statistics...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={ticketYearlyStats?.data.map(item => ({
                                                ...item,
                                                month: new Date(2025, item.month - 1).toLocaleString('default', { month: 'short' })
                                            })) || []}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                            <XAxis 
                                                dataKey="month" 
                                                tick={{ fill: '#666', fontSize: 12 }}
                                                axisLine={{ stroke: '#ddd' }}
                                            />
                                            <YAxis
                                                tick={{ fill: '#666', fontSize: 12 }}
                                                axisLine={{ stroke: '#ddd' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="Open" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Breached" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </Paper>
                    </Box>

                    {/* Team Distribution */}
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' },
                            minWidth: { xs: '100%', lg: 'calc(50% - 12px)' },
                            maxWidth: { xs: '100%', lg: 'calc(50% - 12px)' },
                            display: 'flex'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderRadius: { xs: 2, sm: 3, md: 4 },
                                height: { xs: '350px', sm: '450px' },
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                }
                            }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DonutLarge sx={{ color: '#8b5cf6', fontSize: '28px' }} />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #311188, #0A081E)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Team Distribution
                                    </Typography>
                                </Box>
                                <IconButton 
                                    onClick={() => navigate('/employees')}
                                    sx={{ 
                                        color: '#8b5cf6',
                                        '&:hover': {
                                            background: 'rgba(139, 92, 246, 0.1)'
                                        }
                                    }}
                                >
                                    <Visibility />
                                </IconButton>
                            </Box>
                            <Box sx={{ flex: 1, width: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress sx={{ color: '#8b5cf6' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Loading team distribution...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <ResponsiveContainer width="100%" height="90%">
                                        <PieChart>
                                            <Pie
                                                data={employeeStats?.roleWise ? 
                                                    Object.entries(employeeStats.roleWise).map(([name, value]) => ({
                                                        name,
                                                        value
                                                    })) : []
                                                }
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="60%"
                                                outerRadius="80%"
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({
                                                    cx,
                                                    cy,
                                                    midAngle,
                                                    innerRadius,
                                                    outerRadius,
                                                    value,
                                                    name
                                                }) => {
                                                    const RADIAN = Math.PI / 180;
                                                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="#666"
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            style={{ fontSize: '12px' }}
                                                        >
                                                            {`${name} (${value})`}
                                                        </text>
                                                    );
                                                }}
                                            >
                                                {employeeStats?.roleWise &&
                                                    Object.entries(employeeStats.roleWise).map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                            stroke="rgba(255,255,255,0.8)"
                                                            strokeWidth={2}
                                                        />
                                                    ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                {/* Bottom Charts Row */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 2, sm: 3 },
                        width: '100%'
                    }}
                >
                   

                    {/* Projects Overview */}
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                            minWidth: { xs: '100%', md: 'calc(50% - 12px)' },
                            maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }
                        }}
                    >
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderRadius: { xs: 2, sm: 3, md: 4 },
                                height: { xs: '350px', sm: '450px' },
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                }
                            }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Assignment sx={{ color: '#10b981', fontSize: '28px' }} />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #311188, #0A081E)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Projects Overview
                                    </Typography>
                                </Box>
                                <IconButton 
                                    onClick={() => navigate('/job-feed')}
                                    sx={{ 
                                        color: '#10b981',
                                        '&:hover': {
                                            background: 'rgba(16, 185, 129, 0.1)'
                                        }
                                    }}
                                >
                                    <Visibility />
                                </IconButton>
                            </Box>
                            <Box sx={{ flex: 1, width: '100%', minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress sx={{ color: '#10b981' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Loading projects overview...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={projects.map(project => ({
                                                title: project.title,
                                                assigned: project.assignedEmployees?.length || 0,
                                                remaining: project.teamSizeLimit - (project.assignedEmployees?.length || 0),
                                            }))}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                            <XAxis 
                                                dataKey="title" 
                                                tick={{ fill: '#666', fontSize: 12 }}
                                                axisLine={{ stroke: '#ddd' }}
                                            />
                                            <YAxis
                                                tick={{ fill: '#666', fontSize: 12 }}
                                                axisLine={{ stroke: '#ddd' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Legend />
                                            <defs>
                                                <linearGradient id="assignedGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                                </linearGradient>
                                                <linearGradient id="remainingGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <Area 
                                                type="monotone" 
                                                dataKey="assigned" 
                                                stroke="#10b981" 
                                                strokeWidth={2}
                                                fill="url(#assignedGradient)"
                                                dot={{ fill: '#10b981', strokeWidth: 2 }}
                                                activeDot={{ r: 8 }}
                                                name="Assigned"
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="remaining" 
                                                stroke="#3b82f6" 
                                                strokeWidth={2}
                                                fill="url(#remainingGradient)"
                                                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                                                activeDot={{ r: 8 }}
                                                name="Available"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </Paper>
                    </Box>

                    {/* Project Applications */}
                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                            minWidth: { xs: '100%', md: 'calc(50% - 12px)' },
                            maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }
                        }}
                    >
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderRadius: { xs: 2, sm: 3, md: 4 },
                                height: { xs: '350px', sm: '450px' },
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                }
                            }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WorkOutline sx={{ color: '#f59e0b', fontSize: '28px' }} />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #311188, #0A081E)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Project Applications
                                    </Typography>
                                </Box>
                                <IconButton 
                                    onClick={() => navigate('/job-feed')}
                                    sx={{ 
                                        color: '#f59e0b',
                                        '&:hover': {
                                            background: 'rgba(245, 158, 11, 0.1)'
                                        }
                                    }}
                                >
                                    <Visibility />
                                </IconButton>
                            </Box>
                            <Box sx={{ flex: 1, width: '100%', minHeight: 0, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress sx={{ color: '#f59e0b' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Loading project applications...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                                        {projectApplications.map((application) => (
                                            <Box
                                                key={application._id}
                                                sx={{
                                                    mb: 2,
                                                    p: 2,
                                                    borderRadius: 2,
                                                    background: 'rgba(0,0,0,0.03)',
                                                    '&:hover': {
                                                        background: 'rgba(0,0,0,0.05)',
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="600">
                                                        {application.project.title}
                                                    </Typography>
                                                    <Chip
                                                        label={application.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: application.status === 'approved' ? '#10b981' : 
                                                                    application.status === 'pending' ? '#f59e0b' : '#ef4444',
                                                            color: 'white'
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {application.employee.name} ({application.employee.employeeId})
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default WelcomePage;
