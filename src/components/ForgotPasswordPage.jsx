import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Container,
  Avatar,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LockOutlined,
  KeyboardBackspace
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import BaseUrl from '../Api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../assets/signavox-logo.png';

const ForgotPasswordPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
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

    // Clear password error when either password field changes
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validatePasswords = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/auth/send-otp`, {
        email: formData.email
      });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setActiveStep(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.', {
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/auth/reset-password`, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed. Please try again.', {
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

  // Calculate parallax effect based on mouse position
  const calcParallaxX = (depth = 10) => {
    const centerX = window.innerWidth / 2;
    return (mousePosition.x - centerX) / depth;
  };

  const calcParallaxY = (depth = 10) => {
    const centerY = window.innerHeight / 2;
    return (mousePosition.y - centerY) / depth;
  };

  return (
    <Box className="h-screen w-full flex overflow-hidden relative">
      <ToastContainer theme="dark" />

      

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#311188] to-[#0A081E] z-10"></div>

      {/* Main content */}
      <Container maxWidth="sm" className="relative z-20 flex items-center justify-center">
        <Box
          sx={{
            width: '100%',
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <Box className="text-center mb-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#311188',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                }}
              >
                <LockOutlined sx={{ fontSize: 40 }} />
              </Avatar>
            </motion.div>
            <Typography variant="h4" className="font-bold mb-2">
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeStep === 0 ? "Enter your email to receive OTP" : "Enter OTP and new password"}
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            className="mb-6"
            sx={{
              '& .MuiStepLabel-root .Mui-active': {
                color: '#311188',
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: '#311188',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: '#311188', 
              }
            }}
          >
            <Step>
              <StepLabel>Request OTP</StepLabel>
            </Step>
            <Step>
              <StepLabel>Reset Password</StepLabel>
            </Step>
          </Stepper>

          {/* Forms */}
          {activeStep === 0 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-[#311188]" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  height: 56,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              <TextField
                fullWidth
                label="OTP"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                required
                error={!!passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-[#311188]" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-[#311188]" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  height: 56,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <Button
            startIcon={<KeyboardBackspace />}
            onClick={() => navigate('/login')}
            sx={{
              mt: 3,
              textTransform: 'none',
              color: 'text.secondary'
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;