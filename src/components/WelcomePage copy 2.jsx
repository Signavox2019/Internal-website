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

    // Add new animation variants
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

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            bgcolor: '#f8fafc',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <motion.div
                variants={rotateVariants}
                initial="initial"
                animate="animate"
                style={{
                    position: 'fixed',
                    top: '-50%',
                    right: '-50%',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
                    zIndex: 0
                }}
            />
            <motion.div
                variants={rotateVariants}
                initial="initial"
                animate="animate"
                style={{
                    position: 'fixed',
                    bottom: '-50%',
                    left: '-50%',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%)',
                    zIndex: 0,
                    animationDelay: '2s'
                }}
            />

            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, position: 'relative', zIndex: 1 }}>
                {/* Enhanced Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <Box sx={{
                        mb: 4,
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)',
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

                {/* Enhanced Quick Access Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >

                    <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        sx={{ 
                            mb: 6, 
                            color: '#1e293b',
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -12,
                                left: 0,
                                width: '100%',
                                height: 3,
                                background: 'linear-gradient(to right, #3b82f6, transparent)',
                                borderRadius: 2
                            }
                        }}
                        className="tracking-tight"
                    >
                        Quick Access
                    </Typography>
                </motion.div>

                {/* Enhanced Grid Layout for Quick Access */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                >
                    <Box sx={{ 
                        overflowX: 'auto',
                        mb: 8,
                        pb: 2,
                        '&::-webkit-scrollbar': {
                            height: 8
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f5f9'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#94a3b8',
                            borderRadius: 4
                        }
                    }}>
                        <Grid 
                            container 
                            sx={{ 
                                flexWrap: 'nowrap',
                                width: 'max-content',
                                gap: 3
                            }}
                        >
                            {quickLinks.map((link, index) => (
                                <Grid item key={index} sx={{ width: { xs: '220px', md: '250px' } }}>
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: { xs: 3, md: 4 },
                                                borderRadius: 4,
                                                textAlign: 'center',
                                                height: { xs: '180px', md: '200px' },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                border: '1px solid',
                                                borderColor: 'rgba(0,0,0,0.05)',
                                                transition: 'all 0.3s ease',
                                                background: `linear-gradient(135deg, ${link.color}08, white)`,
                                                backdropFilter: 'blur(8px)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    boxShadow: `0 15px 30px -10px ${link.color}30`,
                                                    borderColor: `${link.color}40`,
                                                    background: `linear-gradient(135deg, ${link.color}15, white)`,
                                                    transform: 'translateY(-4px)'
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: 4,
                                                    background: link.color,
                                                    opacity: 0.7
                                                }
                                            }}
                                        >
                                            <motion.div
                                                whileHover={{ 
                                                    rotate: [0, -10, 10, 0],
                                                    scale: 1.1
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${link.color}15`,
                                                        color: link.color,
                                                        width: { xs: 56, md: 64 },
                                                        height: { xs: 56, md: 64 },
                                                        mb: 2,
                                                        boxShadow: `0 8px 16px -6px ${link.color}30`,
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: { xs: '1.75rem', md: '2rem' }
                                                        }
                                                    }}
                                                >
                                                    {link.icon}
                                                </Avatar>
                                            </motion.div>
                                            <Typography 
                                                variant="h6" 
                                                fontWeight="bold"
                                                sx={{
                                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                                    color: '#1e293b'
                                                }}
                                            >
                                                {link.title}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>

                {/* Overview Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        sx={{ 
                            mb: 6, 
                            color: '#1e293b',
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -12,
                                left: 0,
                                width: '100%',
                                height: 3,
                                background: 'linear-gradient(to right, #3b82f6, transparent)',
                                borderRadius: 2
                            }
                        }}
                        className="tracking-tight"
                    >
                        Overview
                    </Typography>
                </motion.div>

                {/* Stats Cards Section */}
                <Box sx={{ mb: 8 }}>
                    <Box sx={{ 
                        overflowX: 'auto',
                        pb: 2,
                        '&::-webkit-scrollbar': {
                            height: 8
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f5f9'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#94a3b8',
                            borderRadius: 4
                        }
                    }}>
                        <Grid 
                            container 
                            sx={{ 
                                flexWrap: 'nowrap',
                                width: 'max-content',
                                gap: 3
                            }}
                        >
                            {statsCards.map((card, index) => (
                                <Grid item key={index} sx={{ width: { xs: '250px', md: '280px' } }}>
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    >
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: 4,
                                                height: { xs: '160px', md: '180px' },
                                                border: '1px solid',
                                                borderColor: 'rgba(0,0,0,0.05)',
                                                background: 'rgba(255,255,255,0.8)',
                                                backdropFilter: 'blur(10px)',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)',
                                                    transform: 'translateY(-5px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ background: card.color, height: 4 }} />
                                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.75rem', md: '2rem' } }}>
                                                            {card.value}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                            {card.title}
                                                        </Typography>
                                                    </Box>
                                                    <Avatar
                                                        sx={{
                                                            width: { xs: 48, md: 56 },
                                                            height: { xs: 48, md: 56 },
                                                            background: 'rgba(255,255,255,0.9)',
                                                            color: '#6366f1',
                                                            boxShadow: '0 8px 16px -6px rgba(99,102,241,0.3)',
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: { xs: '1.5rem', md: '1.75rem' }
                                                            }
                                                        }}
                                                    >
                                                        {card.icon}
                                                    </Avatar>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

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