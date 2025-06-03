import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Avatar,
  Paper,
  Stack,
  useTheme,
  Divider,
  MobileStepper,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
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
  Speed,
  Healing,
  LocalPolice,
  FireTruck,
  MedicalServices,
  EmergencyShare,
  SupportAgent,
  ContactEmergency,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import LoadingScreen from './LoadingScreen';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: '#000',
  position: 'relative',
  overflow: 'hidden',
});

const SlideContainer = styled(Box)(({ bgimage }) => ({
  width: '100%',
  height: '85vh',
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
  '@media (max-width: 960px)': {
    flexDirection: 'column',
    padding: '0 24px',
    gap: '24px',
  },
});

const EmergencyDetails = styled(Box)(({ theme }) => ({
  flex: 1,
  color: 'white',
  maxWidth: '600px',
  '@media (max-width: 960px)': {
    maxWidth: '100%',
  },
}));

const GlassCard = styled(Box)(({ theme, color }) => ({
  width: '500px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '@media (max-width: 960px)': {
    width: '100%',
  },
}));

const MetricCard = styled(motion.div)(({ theme, color }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  height: '100%',
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}66)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: `linear-gradient(to top, ${color}11, transparent)`,
    opacity: 0.5,
    zIndex: 0,
  },
}));

const MetricIcon = styled(Avatar)(({ theme, color }) => ({
  width: 80,
  height: 80,
  background: `linear-gradient(135deg, ${color}22, ${color}11)`,
  color: color,
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'rotate(10deg) scale(1.1)',
  },
}));

const MetricValue = styled(Typography)(({ theme, color }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  color: color,
  marginBottom: theme.spacing(1),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '3px',
    background: color,
    borderRadius: theme.spacing(1),
  },
}));

const StatsSummary = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '150%',
    height: '120%',
    background: 'radial-gradient(circle, rgba(49, 17, 136, 0.05) 0%, transparent 70%)',
    zIndex: -1,
  },
}));

const StatsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.5,
  },
}));

const CarouselDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 40,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(3),
  background: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
}));

const CarouselDot = styled(Box)(({ theme, active, color }) => ({
  width: active ? 32 : 12,
  height: 12,
  borderRadius: theme.spacing(1),
  background: active ? color : 'rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    background: active ? color : 'rgba(255, 255, 255, 0.5)',
  },
}));

const emergencyTypes = [
  {
    title: 'Medical Emergency',
    subtitle: 'Immediate Medical Assistance',
    description: '24/7 Professional Healthcare Response',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80',
    color: '#FF6B6B',
    icon: <MedicalServices sx={{ fontSize: 40 }} />,
    mainIcon: <LocalHospital sx={{ fontSize: 60 }} />,
    contacts: [
      { name: 'Emergency Ambulance', number: '102', icon: <LocalHospital /> },
      { name: 'Hospital Helpdesk', number: '1800-102-1234', icon: <HealthAndSafety /> },
      { name: 'Medical Support', number: '1800-425-1234', icon: <Healing /> },
    ],
    stats: [
      { title: 'Response Time', value: '< 5 min', icon: <Speed />, description: 'Average emergency response time' },
      { title: 'Success Rate', value: '99.9%', icon: <Assessment />, description: 'Emergency cases handled successfully' },
      { title: 'Available Units', value: '24/7', icon: <LocalHospital />, description: 'Round-the-clock medical support' },
      { title: 'Medical Staff', value: '500+', icon: <People />, description: 'Qualified healthcare professionals' },
    ],
  },
  {
    title: 'Security Emergency',
    subtitle: 'Your Safety, Our Priority',
    description: 'Round-the-clock Security Response',
    bgImage: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80',
    color: '#4158D0',
    icon: <LocalPolice sx={{ fontSize: 40 }} />,
    mainIcon: <Security sx={{ fontSize: 60 }} />,
    contacts: [
      { name: 'Security Control', number: '100', icon: <Security /> },
      { name: 'Emergency Response', number: '1800-100-1234', icon: <EmergencyShare /> },
      { name: 'Support Center', number: '1800-789-1234', icon: <SupportAgent /> },
    ],
    stats: [
      { title: 'Response Time', value: '< 2 min', icon: <Speed />, description: 'Rapid security deployment' },
      { title: 'Coverage Area', value: '100%', icon: <Shield />, description: 'Complete area surveillance' },
      { title: 'Active Guards', value: '24/7', icon: <LocalPolice />, description: 'Continuous security monitoring' },
      { title: 'Security Team', value: '300+', icon: <People />, description: 'Trained security personnel' },
    ],
  },
  {
    title: 'Fire Emergency',
    subtitle: 'Swift Fire Response',
    description: 'Expert Fire Safety Support',
    bgImage: 'https://images.unsplash.com/photo-1573496782646-e8d943a4bdd1?auto=format&fit=crop&q=80',
    color: '#FF512F',
    icon: <FireTruck sx={{ fontSize: 40 }} />,
    mainIcon: <LocalFireDepartment sx={{ fontSize: 60 }} />,
    contacts: [
      { name: 'Fire Brigade', number: '101', icon: <LocalFireDepartment /> },
      { name: 'Emergency Control', number: '1800-101-1234', icon: <Warning /> },
      { name: 'Rescue Team', number: '1800-202-1234', icon: <ContactEmergency /> },
    ],
    stats: [
      { title: 'Response Time', value: '< 3 min', icon: <Speed />, description: 'Quick fire emergency response' },
      { title: 'Success Rate', value: '99.9%', icon: <Assessment />, description: 'Fire incidents controlled' },
      { title: 'Fire Units', value: '24/7', icon: <LocalFireDepartment />, description: 'Ready for deployment' },
      { title: 'Fire Fighters', value: '200+', icon: <People />, description: 'Professional fire fighting team' },
    ],
  },
];

const EmergencyContact = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const maxSteps = emergencyTypes.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % emergencyTypes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PageContainer>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        style={{ width: '100%', height: '85vh' }}
      >
        {emergencyTypes.map((emergency, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <SlideContainer bgimage={emergency.bgImage}>
                <ContentWrapper>
                  <EmergencyDetails>
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {emergency.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 3,
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                        }}
                      >
                        {emergency.subtitle}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 4,
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '1.1rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {emergency.description}
                      </Typography>

                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<Phone />}
                          sx={{
                            background: emergency.color,
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            '&:hover': {
                              background: emergency.color,
                              opacity: 0.9,
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
                            borderColor: 'white',
                            color: 'white',
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: 'white',
                              background: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          Quick Message
                        </Button>
                      </Stack>
                    </motion.div>
                  </EmergencyDetails>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GlassCard color={emergency.color}>
                      <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                        Emergency Contacts
                      </Typography>
                      <Stack spacing={2}>
                        {emergency.contacts.map((contact, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              background: 'rgba(255,255,255,0.1)',
                              p: 2,
                              borderRadius: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: `${emergency.color}22`,
                                color: 'white',
                              }}
                            >
                              {contact.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {contact.name}
                              </Typography>
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                {contact.number}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </GlassCard>
                  </motion.div>
                </ContentWrapper>

                <CarouselDots>
                  {emergencyTypes.map((_, idx) => (
                    <CarouselDot
                      key={idx}
                      active={idx === activeStep}
                      color={emergencyTypes[activeStep].color}
                      onClick={() => handleStepChange(idx)}
                    />
                  ))}
                </CarouselDots>
              </SlideContainer>
            ) : null}
          </div>
        ))}
      </SwipeableViews>

      <StatsSection>
        <Container maxWidth="xl">
          <StatsSummary>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: emergencyTypes[activeStep].color,
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '4px',
                  background: `linear-gradient(90deg, transparent, ${emergencyTypes[activeStep].color}, transparent)`,
                },
              }}
            >
              Emergency Response Metrics
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
              Our commitment to providing swift and effective emergency response services, backed by state-of-the-art technology and highly trained professionals.
            </Typography>
          </StatsSummary>

          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
            alignItems: 'stretch',
          }}>
            {emergencyTypes[activeStep].stats.map((stat, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: '1 1 250px',
                  maxWidth: '350px',
                  minWidth: '250px',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <MetricCard color={emergencyTypes[activeStep].color}>
                    <MetricIcon color={emergencyTypes[activeStep].color}>
                      {stat.icon}
                    </MetricIcon>
                    <MetricValue color={emergencyTypes[activeStep].color}>
                      {stat.value}
                    </MetricValue>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ position: 'relative', zIndex: 1 }}>
                      {stat.description}
                    </Typography>
                    <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${emergencyTypes[activeStep].color}22` }}>
                      <Typography variant="caption" sx={{ color: emergencyTypes[activeStep].color, fontWeight: 500 }}>
                        Available 24/7
                      </Typography>
                    </Box>
                  </MetricCard>
                </motion.div>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Our emergency response metrics are continuously monitored and improved to ensure the highest quality of service.
            </Typography>
          </Box>
        </Container>
      </StatsSection>
    </PageContainer>
  );
};

export default EmergencyContact;
