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
    Paper
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
    AccessTime
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const WelcomePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const [userData, setUserData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');

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

    // Quick links data
    const quickLinks = [
        { icon: <Dashboard />, title: 'Dashboard', color: '#3b82f6' },
        { icon: <People />, title: 'Employees', color: '#8b5cf6' },
        { icon: <CreditCard />, title: 'Cards', color: '#ec4899' },
        { icon: <LinkIcon />, title: 'Quick Links', color: '#10b981' },
        { icon: <ConfirmationNumber />, title: 'Tickets', color: '#f59e0b' },
        { icon: <Notifications />, title: 'Notifications', color: '#ef4444' }
    ];

    // Recent activities (mock data)
    const recentActivities = [
        { title: 'New employee onboarded', time: '2 hours ago', icon: <People />, color: '#8b5cf6' },
        { title: 'IT support ticket resolved', time: '4 hours ago', icon: <ConfirmationNumber />, color: '#f59e0b' },
        { title: 'Company meeting scheduled', time: 'Yesterday', icon: <AccessTime />, color: '#10b981' },
        { title: 'New announcement posted', time: '2 days ago', icon: <Notifications />, color: '#ef4444' }
    ];

    // Stats cards data
    const statsCards = [
        { title: 'Active Employees', value: '124', icon: <People />, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { title: 'Open Tickets', value: '8', icon: <ConfirmationNumber />, color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' },
        { title: 'Company Updates', value: '3', icon: <TrendingUp />, color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
        { title: 'Resources', value: '42', icon: <Lightbulb />, color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>

            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
                {/* Welcome Header with enhanced animations */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <Box sx={{
                        mb: 4,
                        p: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Animated decorative elements */}
                        <motion.div
                            variants={floatVariants}
                            initial="initial"
                            animate="animate"
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
                            variants={floatVariants}
                            initial="initial"
                            animate="animate"
                            style={{
                                position: 'absolute',
                                bottom: -80,
                                left: -80,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                zIndex: 0,
                                animationDelay: '1s'
                            }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {greeting}, {userData?.name || 'User'}!
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                            <Typography variant="h6" sx={{ maxWidth: '800px' }}>
                                Welcome to your Signavox portal. Access all your company resources, information, and tools in one place.
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>

                {/* Quick Access Links with enhanced animations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1e293b' }}>
                        Quick Access
                    </Typography>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                >
                    <Grid container spacing={2} sx={{ mb: 6 }}>
                        {quickLinks.map((link, index) => (
                            <Grid item xs={6} sm={4} md={2} key={index}>
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 4,
                                            textAlign: 'center',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '1px solid',
                                            borderColor: 'rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                borderColor: `${link.color}40`,
                                                background: `linear-gradient(135deg, ${link.color}15, ${link.color}05)`,
                                            }
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: `${link.color}20`,
                                                color: link.color,
                                                width: 56,
                                                height: 56,
                                                mb: 2
                                            }}
                                        >
                                            {link.icon}
                                        </Avatar>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {link.title}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>

                {/* Stats Cards with enhanced animations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1e293b' }}>
                        Overview
                    </Typography>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {statsCards.map((card, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{
                                        y: -5,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            height: '100%',
                                            border: '1px solid',
                                            borderColor: 'rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)',
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            background: card.color,
                                            height: 8
                                        }} />
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        background: 'rgba(255,255,255,0.9)',
                                                        color: '#6366f1',
                                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                                    }}
                                                >
                                                    {card.icon}
                                                </Avatar>
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="bold"
                                                    sx={{ ml: 'auto', color: '#1e293b' }}
                                                >
                                                    {card.value}
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle1" color="text.secondary">
                                                {card.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>

                {/* Recent Activities with enhanced animations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1e293b' }}>
                        Recent Activities
                    </Typography>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        {recentActivities.map((activity, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{
                                        x: 5,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid',
                                            borderColor: 'rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                borderColor: `${activity.color}40`,
                                                background: `linear-gradient(135deg, ${activity.color}05, white)`,
                                            }
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: `${activity.color}20`,
                                                color: activity.color,
                                                width: 48,
                                                height: 48,
                                                mr: 2
                                            }}
                                        >
                                            {activity.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                {activity.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {activity.time}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

        </Box>

    );
};

export default WelcomePage;