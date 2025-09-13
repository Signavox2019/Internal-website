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
        if (response.data.employee.isAdmin) {
          navigate('/welcome');
        } else {
          navigate('/landing');
        }
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
    <Box className="w-full h-screen flex overflow-hidden relative">
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
        {/* Left side - Company info with background image */}
        <Box
          className={`${isMobile ? 'hidden' : 'flex'} lg:w-5/7 flex-col justify-between p-2 lg:p-8 text-white relative overflow-hidden h-screen`}
          sx={{
            background: 'linear-gradient(180deg, #311188, #0A081E), url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(14, 165, 233, 0.15), rgba(59, 130, 246, 0.15))',
              zIndex: 1
            }
          }}
        >
          <div className="relative z-10 pointer-events-auto">
            {/* Logo placeholder - replace with your actual logo */}
            {/* <motion.img
              src={Logo}
              alt="Signavox Logo"
              className="w-16 h-16 p-1 rounded-full bg-white flex items-center justify-center shadow-lg shadow-blue-500/30"
              // whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            /> */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                mb: -12, // Decreased margin bottom to reduce gap
                mt: -14, // Decreased margin top
                ml: -5, // Decreased margin left
                zIndex: 10,
                position: 'relative',
                pointerEvents: 'auto',
              }}
            >
              <img
                src={CompanyName}
                alt="Signavox"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  width: '350px',
                  minWidth: '120px',
                  objectFit: 'contain',
                  pointerEvents: 'auto',
                  userSelect: 'text',
                }}
                className="block"
              />
            </Box>
            <Typography variant="body1" className="text-blue-100 text-xl font-light pointer-events-auto select-text">
              Your All-in-One Company Portal
            </Typography>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-2 mt-4 pointer-events-auto select-text"
            style={{ zIndex: 10, position: 'relative' }}
          >
            <Typography variant="h3" className="font-bold text-3xl mb-4 tracking-tight select-text">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
                Everything you need,
              </span>
              <br />
              <span className="text-white">all in one place</span>
            </Typography>
            <Typography variant="body1" className="text-blue-100 pt-2 text-lg leading-relaxed select-text">
              Signavox brings together all your company resources, information, and tools in a single,
              easy-to-use platform designed to boost productivity and collaboration.
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-0 pointer-events-auto"
            style={{ zIndex: 10, position: 'relative' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative group flex cursor-pointer transition-transform duration-200"
                  variants={itemVariants}
                  style={{
                    minWidth: 0,
                  }}
                  whileHover={{
                    zIndex: 2,
                    scale: 1.03,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300 pointer-events-none" />
                  <motion.div
                    className="relative flex flex-col items-start space-y-3 p-4 rounded-2xl backdrop-blur-sm border border-white/10 bg-white/5 w-full transition-colors duration-300 group-hover:bg-white/10 group-hover:border-blue-300/30"
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      height: "90px",
                      maxHeight: "90px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 6px 32px 0 rgba(59,130,246,0.10), 0 1.5px 8px 0 rgba(99,102,241,0.10)",
                      background: "rgba(255,255,255,0.10)",
                      borderColor: "rgba(59,130,246,0.25)",
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 backdrop-blur-sm shadow-inner shadow-white/10 group-hover:bg-gradient-to-br group-hover:from-blue-400/40 group-hover:to-indigo-400/40 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <Typography
                        variant="h6"
                        className="font-semibold text-lg mb-1 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300"
                      >
                        {feature.title}
                      </Typography>
                    </div>
                    <div className="flex-grow -mt-1 flex flex-col justify-start">
                      <Typography
                        variant="body2"
                        className="text-blue-100 opacity-90 leading-relaxed text-sm group-hover:text-white transition-colors duration-300"
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
            className="text-sm text-blue-200 mt-4 flex justify-between items-center pointer-events-auto select-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{ zIndex: 10, position: 'relative' }}
          >
            <div className="select-text">© {new Date().getFullYear()} Signavox. All rights reserved.</div>
            <div className="flex space-x-4">
              <span className="hover:text-white cursor-pointer transition-colors duration-300 select-text">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors duration-300 select-text">Terms of Service</span>
            </div>
          </motion.div>
        </Box>

        {/* Right side - Login form */}
        <Box
          className={`w-full ${isMobile ? 'w-full' : 'lg:w-2/5'} flex items-center justify-center p-6 md:p-6 relative h-screen`}
          sx={{
            background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '140%',

              height: '140%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, rgba(14, 165, 233, 0.02) 30%, transparent 70%)',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              zIndex: 0
            }
          }}
        >
          {/* Animated background elements */}
         

          <Container maxWidth="sm" className="relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full space-y-10"
            >
              {/* Logo and Welcome Text */}
              <motion.div
                className="text-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="relative inline-block mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 0 3px rgba(14, 165, 233, 0.2)',
                        '0 0 0 6px rgba(14, 165, 233, 0.1)',
                        '0 0 0 3px rgba(14, 165, 233, 0.2)'
                      ],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Avatar
                    className="w-24 h-24 relative"
                    sx={{
                      // background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                      background: 'linear-gradient(90deg, #311188, #0A081E)',
                      boxShadow: '0 12px 24px -8px rgba(14, 165, 233, 0.5)',
                      border: '4px solid rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <LockOutlined className="text-4xl" />
                  </Avatar>
                </div>
                <Typography
                  variant="h3"
                  // className="font-bold text-4xl mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                  className="font-bold text-4xl mb-3 bg-[#311188]  bg-clip-text text-transparent"
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" className="text-slate-600 text-lg">
                  Sign in to access your Signavox portal
                </Typography>
              </motion.div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-1">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-4"
                >
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder='Enter your email address'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email className="text-[#311188] text-xl" />
                        </InputAdornment>
                      ),
                      className: "bg-white/90 backdrop-blur-sm"
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        height: '64px',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '2px solid rgba(49, 17, 136, 0.1)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 32px rgba(49, 17, 136, 0.15), 0 4px 16px rgba(49, 17, 136, 0.1)',
                          border: '2px solid rgba(49, 17, 136, 0.25)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 16px 40px rgba(49, 17, 136, 0.2), 0 6px 20px rgba(49, 17, 136, 0.15)',
                          border: '2px solid rgba(49, 17, 136, 0.4)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
                          transform: 'translateY(-2px)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontSize: '14px',
                        fontWeight: '600',
                        '&.Mui-focused': {
                          color: '#311188',
                          fontWeight: '700'
                        }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#1e293b',
                        '&::placeholder': {
                          color: '#94a3b8',
                          opacity: 1,
                          fontSize: '15px'
                        }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    placeholder='Enter your password'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock className="text-[#311188] text-xl" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: '#311188',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                color: '#0A081E',
                                backgroundColor: 'rgba(49, 17, 136, 0.1)',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      className: "bg-white/90 backdrop-blur-sm"
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        height: '64px',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '2px solid rgba(49, 17, 136, 0.1)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 32px rgba(49, 17, 136, 0.15), 0 4px 16px rgba(49, 17, 136, 0.1)',
                          border: '2px solid rgba(49, 17, 136, 0.25)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 16px 40px rgba(49, 17, 136, 0.2), 0 6px 20px rgba(49, 17, 136, 0.15)',
                          border: '2px solid rgba(49, 17, 136, 0.4)',
                          background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
                          transform: 'translateY(-2px)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontSize: '14px',
                        fontWeight: '600',
                        '&.Mui-focused': {
                          color: '#311188',
                          fontWeight: '700'
                        }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#1e293b',
                        '&::placeholder': {
                          color: '#94a3b8',
                          opacity: 1,
                          fontSize: '15px'
                        }
                      }
                    }}
                  />
                </motion.div>

                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Typography
                    variant="body2"
                    className="text-[#311188] hover:text-[#311188] cursor-pointer font-medium"
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <Button
                      onClick={() => navigate('/forgot-password')}
                      sx={{

                        textTransform: 'none',
                        color: '#311188',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textDecoration: 'underline'
                        },
                      }}
                    >
                      Forgot Password?
                    </Button>
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="pt-1"
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className="relative overflow-hidden group"
                    sx={{
                      // background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                      background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                      borderRadius: '16px',
                      padding: '14px',
                      fontSize: '18px',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.4s ease',
                      boxShadow: '0 8px 16px -4px rgba(14, 165, 233, 0.2)',
                      '&:hover': {
                        // background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                        background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 24px -6px rgba(14, 165, 233, 0.3)'
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 6px 12px -4px rgba(14, 165, 233, 0.2)'
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'all 0.5s ease',
                      },
                      '&:hover::before': {
                        left: '100%'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: 'white',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round'
                          }
                        }}
                      />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;