import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, useTheme, useMediaQuery, Grid, IconButton } from '@mui/material';
import { 
  VerifiedUser,
  Speed as SpeedIcon,
  Psychology,
  Groups,
  TaskAlt,
  HeadsetMic,
  ArrowForward,
  ArrowBack,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold'
}));

const FeatureCard = styled(motion.div)(({ theme, color }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
    zIndex: 0,
    opacity: 0,
    transition: 'opacity 0.4s ease'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '24px',
    padding: '2px',
    background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 0,
    transition: 'opacity 0.4s ease'
  },
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    '&::before': {
      opacity: 1
    },
    '&::after': {
      opacity: 0.5
    },
    '& .feature-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
      color: 'white'
    },
    '& .feature-content': {
      transform: 'translateY(-5px)'
    }
  }
}));

const FeatureIcon = styled(Box)(({ theme, color }) => ({
  width: 90,
  height: 90,
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${color}15`,
  color: color,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: -2,
    borderRadius: '26px',
    padding: '2px',
    background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 0,
    transition: 'opacity 0.4s ease'
  },
  '& .MuiSvgIcon-root': {
    fontSize: 45,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  '&:hover::before': {
    opacity: 0.5
  }
}));

const FeatureContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const CarouselSlide = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '30px',
  overflow: 'hidden',
  willChange: 'transform, opacity',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
    zIndex: 1
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
    zIndex: 1,
    opacity: 0.5
  }
}));

const FloatingElement = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  zIndex: 0
}));

const AnimatedGradient = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)',
  zIndex: 0,
  opacity: 0.5
}));

const carouselSlides = [
  {
    title: "Welcome to Signavox",
    subtitle: "Your comprehensive solution for employee management and task tracking",
    gradient: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    overlay: "linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 203, 243, 0.2) 100%)"
  },
  {
    title: "Streamline Your Workflow",
    subtitle: "Efficient task management and employee tracking at your fingertips",
    gradient: "linear-gradient(45deg, #3F51B5 30%, #7986CB 90%)",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    overlay: "linear-gradient(135deg, rgba(63, 81, 181, 0.2) 0%, rgba(121, 134, 203, 0.2) 100%)"
  },
  {
    title: "Boost Productivity",
    subtitle: "Smart analytics and insights to drive your business forward",
    gradient: "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    overlay: "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(129, 199, 132, 0.2) 100%)"
  }
];

const features = [
  {
    icon: <VerifiedUser />,
    title: 'Secure Access',
    description: 'Enterprise-grade security with role-based access control',
    color: '#2196F3',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    icon: <SpeedIcon />,
    title: 'Fast & Efficient',
    description: 'Optimized performance for quick response times',
    color: '#00BCD4',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    icon: <Psychology />,
    title: 'Smart Analytics',
    description: 'Comprehensive insights and reporting tools',
    color: '#3F51B5',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    icon: <Groups />,
    title: 'Employee Management',
    description: 'Streamlined employee onboarding and management',
    color: '#4CAF50',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    icon: <TaskAlt />,
    title: 'Task Management',
    description: 'Efficient task tracking and assignment system',
    color: '#FF9800',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    icon: <HeadsetMic />,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and assistance',
    color: '#E91E63',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      navigate('/cards');
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Add new animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };


  const paginate = (newDirection) => {
    setPage([(page + newDirection + carouselSlides.length) % carouselSlides.length, newDirection]);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' }}>
        <AnimatedGradient
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <FloatingElement
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: 300,
            height: 300,
            top: '10%',
            left: '10%',
          }}
        />
        <FloatingElement
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: 200,
            height: 200,
            bottom: '20%',
            right: '15%',
          }}
        />
      </Box>

      {/* Hero Section with Full-width Carousel */}
      <Box sx={{ 
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        height: '80vh',
        overflow: 'hidden'
      }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            <CarouselSlide>
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Box
                  component="img"
                  src={carouselSlides[page].image}
                  alt={carouselSlides[page].title}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.9)',
                    willChange: 'transform'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: carouselSlides[page].overlay,
                    zIndex: 1
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ 
                  position: 'relative',
                  zIndex: 2,
                  textAlign: 'center',
                  px: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  p: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '20px',
                    padding: '2px',
                    background: carouselSlides[page].gradient,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0.5
                  }
                }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Typography 
                      variant="h1" 
                      component="h1"
                      sx={{ 
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        mb: 2,
                        background: carouselSlides[page].gradient,
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      {carouselSlides[page].title}
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Typography 
                      variant="h4" 
                      color="text.secondary"
                      sx={{ 
                        mb: 4,
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        maxWidth: '800px',
                        mx: 'auto',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {carouselSlides[page].subtitle}
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => navigate('/cards')}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: carouselSlides[page].gradient,
                        color: 'white',
                        px: 6,
                        py: 2,
                        borderRadius: '30px',
                        fontSize: '1.2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                          transform: 'translateX(-100%)',
                          transition: 'transform 0.6s ease'
                        },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
                          '&::before': {
                            transform: 'translateX(100%)'
                          }
                        }
                      }}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </CarouselSlide>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <IconButton
          onClick={() => paginate(-1)}
          sx={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-50%) scale(1.1)'
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={() => paginate(1)}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-50%) scale(1.1)'
            }
          }}
        >
          <ArrowForward />
        </IconButton>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: 2
          }}
        >
          {carouselSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => {
                const newDirection = index > page ? 1 : -1;
                setPage([index, newDirection]);
              }}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: page === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                  background: 'white'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -20,
                  left: -20,
                  right: -20,
                  bottom: -20,
                  background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0) 70%)',
                  borderRadius: '50%',
                  zIndex: -1
                }
              }}
            >
              Our Features
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 4,
                  background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                  borderRadius: 2
                }
              }}
            >
              Discover the powerful tools and features that make Signavox the perfect solution for your business
            </Typography>
          </Box>
        </motion.div>

        <Grid 
          container 
          spacing={4} 
          sx={{
            position: 'relative',
            // maxWidth: '1400px',
            width: '100%',
            mx: 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0) 70%)',
              borderRadius: '50%',
              zIndex: 0
            }
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6}
              md={4} 
              key={index}
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'center',
                // '&:nth-of-type(odd)': {
                //   transform: 'translateY(20px)',
                //   transition: 'transform 0.3s ease',
                //   '&:hover': {
                //     transform: 'translateY(10px)'
                //   }
                // },
                // '&:nth-of-type(even)': {
                //   transform: 'translateY(-20px)',
                //   transition: 'transform 0.3s ease',
                //   '&:hover': {
                //     transform: 'translateY(-10px)'
                //   }
                // }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ width: '100%', maxWidth: '350px' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      '& .feature-image': {
                        transform: 'scale(1.1)',
                        filter: 'brightness(0.8)'
                      },
                      '& .feature-content': {
                        transform: 'translateY(-10px)'
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: 220,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={feature.image}
                      alt={feature.title}
                      className="feature-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'all 0.5s ease'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to bottom, ${feature.color}15, ${feature.color}80)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: feature.color,
                          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            background: feature.color,
                            color: 'white'
                          }
                        }}
                      >
                        {feature.icon}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    className="feature-content"
                    sx={{
                      p: 4,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)'
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        color: feature.color,
                        fontWeight: 600,
                        mb: 2,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: 40,
                          height: 3,
                          background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                          borderRadius: '2px'
                        }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mt: { xs: 8, md: 12 },
            p: { xs: 4, md: 8 },
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)',
              zIndex: 0
            }
          }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 3,
                position: 'relative',
                zIndex: 1
              }}
            >
              Ready to Transform Your Workplace?
            </Typography>
            <Typography 
              variant="h5"
              color="text.secondary"
              sx={{ 
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                position: 'relative',
                zIndex: 1
              }}
            >
              Join thousands of companies already using Signavox to streamline their operations
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/cards')}
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                px: 6,
                py: 2,
                borderRadius: '30px',
                fontSize: '1.2rem',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.6s ease'
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
                  '&::before': {
                    transform: 'translateX(100%)'
                  }
                }
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LandingPage; 