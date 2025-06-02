import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Container,
  Grid,
  Avatar,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Dashboard,
  Article,
  Announcement,
  ConfirmationNumber,
  Link as LinkIcon,
  LockOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import BaseUrl from '../Api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../assets/signavox-logo.png';
import CompanyName from '../assets/signavox.png';
// import { useAuth } from '../context/AuthContext';
// import { useToast } from '../context/ToastContext';

// Import your company logo
// import SignavoxLogo from '../assets/signavox-logo.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/auth/login`, formData);

      // Save token, role and isAdmin to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.employee.role);
      localStorage.setItem('isAdmin', response.data.employee.isAdmin);
      localStorage.setItem('userData', JSON.stringify(response.data.employee));

      // Show success toast
      toast.success(`Welcome back, ${response.data.employee.name}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/welcome');
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);

      // Show error toast
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Features list with icons
  const features = [
    // { icon: <Dashboard className="text-blue-200 text-3xl" />, title: "Centralized Dashboard", description: "Access all company resources from one place" },
    { icon: <Article className="text-blue-200 text-3xl" />, title: "Latest News", description: "Stay updated with company announcements" },
    { icon: <LinkIcon className="text-blue-200 text-3xl" />, title: "Quick Links", description: "Fast access to important resources" },
    { icon: <ConfirmationNumber className="text-blue-200 text-3xl" />, title: "Support Tickets", description: "Submit and track support requests" },
    { icon: <Announcement className="text-blue-200 text-3xl" />, title: "Company Info", description: "Access important company information" }
  ];

  // Calculate parallax effect based on mouse position
  const calcParallaxX = (depth = 10) => {
    const centerX = window.innerWidth / 2;
    return (mousePosition.x - centerX) / depth;
  };

  const calcParallaxY = (depth = 10) => {
    const centerY = window.innerHeight / 2;
    return (mousePosition.y - centerY) / depth;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  return (
    <Box className="h-screen w-full flex overflow-hidden relative">
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Full-screen background with parallax effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80')`,
        }}
        animate={{
          x: calcParallaxX(30),
          y: calcParallaxY(30),
          scale: 1.1
        }}
        transition={{ type: "spring", stiffness: 10 }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/90 z-10"></div>

      {/* Animated floating particles */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, Math.random() * 0.3 + 0.1, 0.1],
              scale: [1, Math.random() * 0.5 + 1, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <Box className="relative z-20 h-full w-full flex flex-col lg:flex-row">
        {/* Left side - Company info */}
        <Box className={`${isMobile ? 'hidden' : 'flex'} lg:w-3/5 flex-col justify-between p-4 lg:p-12 text-white`}>
          <motion.div
            className=" space-x-4 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo placeholder - replace with your actual logo */}
            {/* <motion.img
              src={Logo}
              alt="Signavox Logo"
              className="w-16 h-16 p-1 rounded-full bg-white flex items-center justify-center shadow-lg shadow-blue-500/30"
              // whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            /> */}
            <Typography
              variant="h2"
              className="font-extrabold text-white tracking-tight flex items-center"
              sx={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em'
              }}
            >
              <span className="text-white">Sign</span>
              <motion.img
                src={Logo}
                alt="Signavox Icon"
                className="w-10 h-11 mt-2.5 object-contain"
              />
              <span className="text-white">vox</span>
            </Typography>
            <Typography variant="body1" className="text-blue-100 text-xl font-light">
              Your All-in-One Company Portal
            </Typography>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-2 "
          >
            <Typography variant="h3" className="font-bold text-4xl mb-6 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
                Everything you need,
              </span>
              <br />
              <span className="text-white">all in one place</span>
            </Typography>
            <Typography variant="body1" className="text-blue-100 pt-4 text-xl leading-relaxed">
              Signavox brings together all your company resources, information, and tools in a single,
              easy-to-use platform designed to boost productivity and collaboration.
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-0 px-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  variants={itemVariants}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                  <motion.div
                    className="relative flex items-start space-x-4 p-6 rounded-2xl backdrop-blur-sm border border-white/10 bg-white/5"
                    whileHover={{
                      scale: 1.02,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 backdrop-blur-sm shadow-inner shadow-white/10">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <Typography
                        variant="h6"
                        className="font-semibold text-xl mb-2 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent"
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-blue-100 opacity-90 leading-relaxed"
                      >
                        {feature.description}
                      </Typography>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>


          <motion.div 
            className="text-sm text-blue-200 mt-16 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div>© {new Date().getFullYear()} Signavox. All rights reserved.</div>
            <div className="flex space-x-4">
              <span className="hover:text-white cursor-pointer transition-colors duration-300">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors duration-300">Terms of Service</span>
            </div>
          </motion.div>
        </Box>

        {/* Right side - Login form */}
        <Box className={`w-full ${isMobile ? 'w-full' : 'lg:w-2/5'} flex items-center justify-center p-8 md:p-12`}>
          <Container maxWidth="sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              {/* Glassmorphism login form */}
              <motion.div
                className="backdrop-blur-xl bg-white/10 p-8 md:p-10 rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                whileHover={{ boxShadow: "0 15px 40px rgba(0,0,0,0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-4"
                  >
                    <Avatar className="bg-gradient-to-r from-blue-500 to-indigo-600 w-20 h-20 shadow-lg shadow-blue-500/30">
                      <LockOutlined className="text-3xl" />
                    </Avatar>
                  </motion.div>
                  <Typography variant="h3" className="font-bold text-white mb-2">
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" className="text-blue-100 opacity-80  mx-auto">
                    Sign in to access your Signavox portal and all your company resources
                  </Typography>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      className="input-field"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email className="text-blue-200" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '16px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                        '& .MuiOutlinedInput-input': {
                          color: 'white',
                          padding: '16px 14px',
                        },
                        marginBottom: '16px',
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      className="input-field"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock className="text-blue-200" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '16px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                        '& .MuiOutlinedInput-input': {
                          color: 'white',
                          padding: '16px 14px',
                        },
                        marginBottom: '8px',
                      }}
                    />
                  </motion.div>

                  <Box className="flex justify-end mb-2">
                    <Typography
                      variant="body2"
                      className="text-blue-200 hover:text-white cursor-pointer font-medium transition-colors duration-300"
                      sx={{ '&:hover': { textDecoration: 'underline' } }}
                    >
                      Forgot Password?
                    </Typography>
                  </Box>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 py-3 text-lg"
                      sx={{
                        borderRadius: '16px',
                        textTransform: 'none',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)',
                        padding: '12px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transition: 'all 0.6s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                          Signing In...
                        </Box>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </motion.div>

                  <Box className="flex items-center my-6">
                    <Divider className="flex-grow" sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <Typography variant="body2" className="mx-4 text-blue-100">Need help?</Typography>
                    <Divider className="flex-grow" sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
                  >
                    <Typography variant="body2" className="text-center text-blue-100">
                      Contact IT Support at{' '}
                      <span className="text-white font-medium hover:underline cursor-pointer transition-colors duration-300">
                        support@signavox.com
                      </span>
                    </Typography>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;