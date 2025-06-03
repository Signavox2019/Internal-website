import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  IconButton,
  Button,
  Grid,
  Avatar,
  Paper,
  Chip,
  Stack,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  LocalHospital,
  Security,
  LocalFireDepartment,
  Phone,
  WhatsApp,
  LocationOn,
  AccessTime,
  Warning,
  Shield,
  DirectionsRun,
  HealthAndSafety,
  Call,
  Message,
  Info,
  Timeline,
  People,
  Assessment,
  AccountBalance,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Speed,
  Healing,
  LocalPolice,
  FireTruck,
  MedicalServices,
  EmergencyShare,
  SupportAgent,
  ContactEmergency,
} from '@mui/icons-material';
import LoadingScreen from './LoadingScreen';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: '#000',
  position: 'relative',
  overflow: 'hidden',
});

const EmergencyCard = styled(motion.div)(({ theme, bgimage }) => ({
  width: '500px',
  height: '300px',
  position: 'relative',
  transformStyle: 'preserve-3d',
  borderRadius: '20px',
  background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)`,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${bgimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.5,
    zIndex: -1,
  },
}));

const CardOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.8) 0%, rgba(10, 8, 30, 0.8) 100%)',
  opacity: 0.7,
  zIndex: 0,
});

const EmergencyCardContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
  padding: '30px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  color: 'white',
});

const SlideContainer = styled(Box)(({ bgimage }) => ({
  width: '100%',
  height: '80vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${bgimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.3)',
    zIndex: 0,
  },
}));

const ContentWrapper = styled(Box)({
  width: '100%',
  maxWidth: '1500px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 48px',
  position: 'relative',
  zIndex: 1,
  gap: '48px',
});

const EmergencyDetails = styled(Box)(({ theme }) => ({
  flex: 1,
  color: 'white',
  maxWidth: '600px',
}));

const StatsGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '120%',
    background: 'radial-gradient(circle, rgba(49, 17, 136, 0.05) 0%, transparent 70%)',
    zIndex: -1,
  },
}));

const StatsCard = styled(motion.div)(({ theme, color }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.spacing(4),
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: `linear-gradient(90deg, ${color}, ${color}66)`,
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: `0 20px 40px ${color}33`,
  },
}));

const CardTopSection = styled(Box)(({ theme, color }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
  color: 'white',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40px',
    background: 'linear-gradient(to top right, #fff 50%, transparent 51%)',
  },
}));

const IconCircle = styled(Avatar)(({ color }) => ({
  width: 80,
  height: 80,
  background: `linear-gradient(135deg, ${color}66, ${color}22)`,
  border: `2px solid ${color}44`,
  boxShadow: `0 0 30px ${color}33`,
  marginBottom: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'rotate(10deg) scale(1.1)',
  },
}));

const emergencyTypes = [
  {
    title: 'Medical Emergency',
    subtitle: 'Immediate Medical Assistance',
    description: '24/7 Professional Healthcare Response',
    bgImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80',
    color: '#FF6B6B',
    icon: <MedicalServices sx={{ fontSize: 40 }} />,
    mainIcon: <LocalHospital sx={{ fontSize: 60 }} />,
    contacts: [
      { name: 'Emergency Ambulance', number: '102', icon: <LocalHospital /> },
      { name: 'Hospital Helpdesk', number: '1800-102-1234', icon: <HealthAndSafety /> },
      { name: 'Medical Support', number: '1800-425-1234', icon: <Healing /> },
    ],
    stats: [
      { title: 'Response Time', value: '< 5 min', icon: <Speed /> },
      { title: 'Success Rate', value: '99.9%', icon: <Assessment /> },
      { title: 'Available Units', value: '24/7', icon: <LocalHospital /> },
    ],
    features: [
      { title: 'Instant Response', description: '24/7 Emergency Care', icon: <Speed /> },
      { title: 'Expert Team', description: 'Qualified Medical Staff', icon: <People /> },
      { title: 'Full Coverage', description: 'Complete Medical Support', icon: <Shield /> },
      { title: 'Advanced Equipment', description: 'State-of-the-art Technology', icon: <MedicalServices /> },
    ],
  },
  {
    title: 'Security Emergency',
    subtitle: 'Your Safety, Our Priority',
    description: 'Round-the-clock Security Response',
    bgImage: 'https://images.unsplash.com/photo-1454117096348-e4abbeba002c?auto=format&fit=crop&q=80',
    color: '#4158D0',
    icon: <LocalPolice sx={{ fontSize: 40 }} />,
    mainIcon: <Security sx={{ fontSize: 60 }} />,
    contacts: [
      { name: 'Security Control', number: '100', icon: <Security /> },
      { name: 'Emergency Response', number: '1800-100-1234', icon: <EmergencyShare /> },
      { name: 'Support Center', number: '1800-789-1234', icon: <SupportAgent /> },
    ],
    stats: [
      { title: 'Response Time', value: '< 2 min', icon: <Speed /> },
      { title: 'Coverage Area', value: '100%', icon: <Shield /> },
      { title: 'Active Guards', value: '24/7', icon: <LocalPolice /> },
    ],
    features: [
      { title: 'Rapid Response', description: 'Immediate Security Dispatch', icon: <Speed /> },
      { title: 'Armed Guards', description: 'Professional Security Team', icon: <Security /> },
      { title: 'Surveillance', description: '24/7 Monitoring', icon: <Shield /> },
      { title: 'Quick Action', description: 'Immediate Intervention', icon: <DirectionsRun /> },
    ],
  },
  {
    title: 'Fire Emergency',
    subtitle: 'Swift Fire Response',
    description: 'Expert Fire Safety Support',
    bgImage: 'https://images.unsplash.com/photo-1486551937199-baf066858de7?auto=format&fit=crop&q=80',
    color: '#FF512F',
    icon: <FireTruck sx={{ fontSize: 40 }} />,
    mainIcon: <LocalFireDepartment sx={{ fontSize: 60 }} />,
    contacts: [
      { name: 'Fire Brigade', number: '101', icon: <LocalFireDepartment /> },
      { name: 'Emergency Control', number: '1800-101-1234', icon: <Warning /> },
      { name: 'Rescue Team', number: '1800-202-1234', icon: <ContactEmergency /> },
    ],
    stats: [
      { title: 'Response Time', value: '< 3 min', icon: <Speed /> },
      { title: 'Success Rate', value: '99.9%', icon: <Assessment /> },
      { title: 'Fire Units', value: '24/7', icon: <LocalFireDepartment /> },
    ],
    features: [
      { title: 'Quick Response', description: 'Immediate Fire Fighting', icon: <Speed /> },
      { title: 'Expert Team', description: 'Professional Fire Fighters', icon: <LocalFireDepartment /> },
      { title: 'Modern Equipment', description: 'Advanced Fire Fighting Tools', icon: <FireTruck /> },
      { title: 'Evacuation Support', description: 'Safe & Quick Evacuation', icon: <DirectionsRun /> },
    ],
  },
];

const EmergencyContact = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % emergencyTypes.length);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + emergencyTypes.length) % emergencyTypes.length);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const renderEmergencySlide = (emergency, index) => {
    if (Math.abs(activeStep - index) > 1) return null;

    return (
      <AnimatePresence mode="wait" key={index}>
        {activeStep === index && (
          <motion.div
            initial={{ opacity: 0, x: 100 * Math.sign(activeStep - index) }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * Math.sign(activeStep - index) }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '80vh' }}
          >
            <SlideContainer bgimage={emergency.bgImage}>
              <ContentWrapper>
                {/* Left side - Emergency Details */}
                <EmergencyDetails>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <IconCircle color={emergency.color}>
                        {emergency.mainIcon}
                      </IconCircle>
                      <Box>
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${emergency.color} 0%, #fff 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {emergency.title}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 500,
                          }}
                        >
                          {emergency.subtitle}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {emergency.features.map((feature, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Paper
                              sx={{
                                p: 2,
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  background: 'rgba(255,255,255,0.15)',
                                },
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: `${emergency.color}33`,
                                  color: emergency.color,
                                }}
                              >
                                {feature.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="600">
                                  {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {feature.description}
                                </Typography>
                              </Box>
                            </Paper>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Phone />}
                        sx={{
                          background: `linear-gradient(135deg, ${emergency.color} 0%, ${emergency.color}99 100%)`,
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${emergency.color} 0%, ${emergency.color} 100%)`,
                          },
                        }}
                      >
                        Emergency Call
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<WhatsApp />}
                        sx={{
                          borderColor: emergency.color,
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            borderColor: emergency.color,
                            background: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        Quick Message
                      </Button>
                    </Stack>
                  </motion.div>
                </EmergencyDetails>

                {/* Right side - Emergency Card */}
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <EmergencyCard
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.6 }}
                      bgimage={emergency.bgImage}
                    >
                      <CardOverlay />
                      <EmergencyCardContent>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            {emergency.icon}
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {emergency.title}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                            {emergency.description}
                          </Typography>
                        </Box>
                        <Box>
                          {emergency.contacts.map((contact, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: `${emergency.color}33`,
                                  color: emergency.color,
                                }}
                              >
                                {contact.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                  {contact.name}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {contact.number}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </EmergencyCardContent>
                    </EmergencyCard>
                  </motion.div>
                </Box>
              </ContentWrapper>
            </SlideContainer>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <PageContainer>
      <Box sx={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
        {emergencyTypes.map((emergency, index) => renderEmergencySlide(emergency, index))}

        {/* Navigation Controls */}
        <Box sx={{ position: 'absolute', bottom: 40, width: '100%', display: 'flex', justifyContent: 'center', gap: 2, zIndex: 10 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {emergencyTypes.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: idx === activeStep ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveStep(idx)}
              />
            ))}
          </Box>
          <IconButton
            onClick={handleNext}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          py: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(49, 17, 136, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              background: `linear-gradient(135deg, ${emergencyTypes[activeStep].color} 0%, #fff 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Emergency Response Statistics
          </Typography>

          <StatsGrid container spacing={4}>
            {emergencyTypes[activeStep].stats.map((stat, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <StatsCard color={emergencyTypes[activeStep].color}>
                    <CardTopSection color={emergencyTypes[activeStep].color}>
                      <IconCircle color={emergencyTypes[activeStep].color}>
                        {stat.icon}
                      </IconCircle>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6">
                        {stat.title}
                      </Typography>
                    </CardTopSection>
                  </StatsCard>
                </motion.div>
              </Grid>
            ))}
          </StatsGrid>
        </Container>
      </Box>
    </PageContainer>
  );
};

export default EmergencyContact;
