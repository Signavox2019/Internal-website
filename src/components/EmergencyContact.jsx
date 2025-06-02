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
} from '@mui/material';
import { motion } from 'framer-motion';
import SwipeableViews from 'react-swipeable-views';
import { useTheme, styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
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
} from '@mui/icons-material';

const PageContainer = styled(Box)({
  background: '#000',
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(49, 17, 136, 0.15) 0%, rgba(10, 8, 30, 0.05) 100%)',
    pointerEvents: 'none',
  },
});

const CarouselContainer = styled(Box)({
  width: '100%',
  height: '70vh',
  position: 'relative',
  overflow: 'hidden',
});

const SlideContent = styled(Box)(({ bgimage }) => ({
  width: '100%',
  height: '70vh',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${bgimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 0.6s ease-out',
  },
  '&:hover::before': {
    transform: 'scale(1.05)',
    overflow: 'hidden',
    transition: 'transform 0.6s ease-out',
  },
}));

const ContentOverlay = styled(Box)({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '0 10%',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.8) 0%, rgba(10, 8, 30, 0.8) 100%)',
    opacity: 0.7,
    zIndex: -1,
  },
});

const GradientTitle = styled(Typography)(({ color = '#fff' }) => ({
  background: `linear-gradient(135deg, ${color} 0%, #ffffff 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  letterSpacing: '0.5px',
  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
}));

const StatsSection = styled(Box)({
  padding: '80px 0',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  position: 'relative',
  color: 'white',
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
});

const StatBox = styled(Paper)(({ color }) => ({
  padding: '32px',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-10px)',
    background: 'rgba(255,255,255,0.08)',
    border: `1px solid ${color}66`,
  },
}));

const TimelineSection = styled(Box)({
  padding: '80px 0',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
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
});

const TimelineItem = styled(Box)(({ color }) => ({
  position: 'relative',
  padding: '32px',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(10px)',
    background: 'rgba(255,255,255,0.08)',
    border: `1px solid ${color}66`,
  },
}));

const ContactSection = styled(Box)({
  padding: '80px 0',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
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
});

const ContactCard = styled(Box)(({ color }) => ({
  padding: '32px',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}66)`,
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    background: 'rgba(255,255,255,0.08)',
    border: `1px solid ${color}66`,
    '& .contact-icon': {
      transform: 'rotate(10deg) scale(1.2)',
    },
  },
}));

const EmergencyButton = styled(Button)(({ color }) => ({
  background: `linear-gradient(135deg, ${color}ee, ${color}99)`,
  color: 'white',
  padding: '16px 32px',
  borderRadius: '30px',
  fontSize: '18px',
  fontWeight: 600,
  textTransform: 'none',
  marginBottom: '16px',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    background: `linear-gradient(135deg, ${color}, ${color}ee)`,
    transform: 'translateY(-2px)',
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

const StatsFeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  background: 'rgba(255,255,255,0.05)',
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(5px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(10px)',
    background: 'rgba(255,255,255,0.08)',
  },
}));

const EmergencyFeatureList = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const EmergencyFeatureItem = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255,255,255,0.15)',
    border: `1px solid ${color}66`,
  },
}));

const EmergencyIcon = styled(Avatar)(({ color }) => ({
  background: `linear-gradient(135deg, ${color}66, ${color}22)`,
  border: `2px solid ${color}44`,
  boxShadow: `0 0 30px ${color}33`,
  width: 56,
  height: 56,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'rotate(10deg) scale(1.1)',
  },
}));

const StatsCard = styled(Paper)(({ color }) => ({
  padding: '32px',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}66)`,
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    background: 'rgba(255,255,255,0.08)',
    border: `1px solid ${color}66`,
    '& .stat-icon': {
      transform: 'rotate(10deg) scale(1.2)',
    },
  },
}));

const TimelineCard = styled(Box)(({ color }) => ({
  position: 'relative',
  padding: '32px',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: `linear-gradient(to bottom, ${color}, ${color}66)`,
    borderRadius: '4px',
  },
  '&:hover': {
    transform: 'translateX(10px)',
    background: 'rgba(255,255,255,0.08)',
    border: `1px solid ${color}66`,
  },
}));

const GradientChip = styled(Chip)(({ color }) => ({
  background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
  color: 'white',
  border: '1px solid rgba(255,255,255,0.2)',
  '& .MuiChip-icon': {
    color: 'white',
  },
}));

const emergencyTypes = [
  {
    title: 'Medical Emergency',
    subtitle: 'Immediate Medical Assistance',
    description: 'Professional healthcare response available 24/7',
    bgImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80',
    color: '#FF6B6B',
    icon: <LocalHospital sx={{ fontSize: 40 }} />,
    contacts: [
      { name: 'Emergency Ambulance', number: '102', icon: <LocalHospital /> },
      { name: 'Hospital Helpdesk', number: '1800-102-1234', icon: <HealthAndSafety /> },
    ],
    stats: {
      'Response Time': '5 min',
      'Medical Staff': '24/7',
      'Coverage': '100%'
    },
    timeline: [
      { title: 'Emergency Call', description: 'Call received and logged' },
      { title: 'Dispatch', description: 'Medical team dispatched' },
      { title: 'On-site Care', description: 'Initial treatment provided' },
      { title: 'Hospital Transfer', description: 'Patient transported if needed' },
    ]
  },
  {
    title: 'Security Emergency',
    subtitle: 'Your Safety, Our Priority',
    description: 'Round-the-clock security response team',
    bgImage: 'https://images.unsplash.com/photo-1454117096348-e4abbeba002c?auto=format&fit=crop&q=80',
    color: '#4158D0',
    icon: <Security sx={{ fontSize: 40 }} />,
    contacts: [
      { name: 'Security Control', number: '100', icon: <Security /> },
      { name: 'Emergency Response', number: '1800-100-1234', icon: <DirectionsRun /> },
    ],
    stats: {
      'Response Time': '2 min',
      'Security Staff': '24/7',
      'Coverage': '100%'
    },
    timeline: [
      { title: 'Alert Received', description: 'Security threat reported' },
      { title: 'Team Deployment', description: 'Security team dispatched' },
      { title: 'Situation Assessment', description: 'Threat level evaluation' },
      { title: 'Action Taken', description: 'Appropriate security measures implemented' },
    ]
  },
  {
    title: 'Fire Emergency',
    subtitle: 'Swift Fire Response',
    description: 'Expert fire safety and evacuation support',
    bgImage: 'https://images.unsplash.com/photo-1454117096348-e4abbeba002c?auto=format&fit=crop&q=80',
    color: '#FF512F',
    icon: <LocalFireDepartment sx={{ fontSize: 40 }} />,
    contacts: [
      { name: 'Fire Brigade', number: '101', icon: <LocalFireDepartment /> },
      { name: 'Emergency Control', number: '1800-101-1234', icon: <Warning /> },
    ],
    stats: {
      'Response Time': '3 min',
      'Fire Fighters': '24/7',
      'Coverage': '100%'
    },
    timeline: [
      { title: 'Fire Detected', description: 'Fire alarm activated' },
      { title: 'Brigade Dispatch', description: 'Fire fighting team deployed' },
      { title: 'Evacuation', description: 'Safe evacuation procedures initiated' },
      { title: 'Fire Control', description: 'Fire containment and extinguishing' },
    ]
  }
];

const features = {
  'Medical Emergency': [
    { icon: <LocalHospital />, title: 'Instant Response', desc: '24/7 Emergency Care' },
    { icon: <HealthAndSafety />, title: 'Expert Team', desc: 'Qualified Medical Staff' },
    { icon: <DirectionsRun />, title: 'Quick Transport', desc: 'Rapid Ambulance Service' },
    { icon: <Shield />, title: 'Full Coverage', desc: 'Complete Medical Support' },
  ],
  'Security Emergency': [
    { icon: <Security />, title: 'Rapid Response', desc: 'Immediate Security Dispatch' },
    { icon: <Shield />, title: 'Armed Guards', desc: 'Professional Security Team' },
    { icon: <Warning />, title: 'Threat Assessment', desc: 'Expert Situation Analysis' },
    { icon: <DirectionsRun />, title: 'Safe Evacuation', desc: 'Emergency Extraction' },
  ],
  'Fire Emergency': [
    { icon: <LocalFireDepartment />, title: 'Fire Response', desc: 'Professional Fire Fighting' },
    { icon: <DirectionsRun />, title: 'Evacuation', desc: 'Safe Exit Procedures' },
    { icon: <Warning />, title: 'Fire Control', desc: 'Advanced Equipment' },
    { icon: <Shield />, title: 'Property Protection', desc: 'Damage Prevention' },
  ]
};

const EmergencyContact = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handleNext = () => setActiveStep((prev) => (prev + 1) % emergencyTypes.length);
  const handleBack = () => setActiveStep((prev) => (prev - 1 + emergencyTypes.length) % emergencyTypes.length);
  const handleStepChange = (step) => setActiveStep(step);

  return (
    <PageContainer>
      <CarouselContainer>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {emergencyTypes.map((emergency, index) => (
            <SlideContent key={emergency.title} bgimage={emergency.bgImage}>
              <ContentOverlay>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <GradientTitle variant="h2" color={emergency.color}>
                    {emergency.title}
                  </GradientTitle>
                  <Typography variant="h4" sx={{ mb: 3, opacity: 0.9, fontWeight: 600 }}>
                    {emergency.subtitle}
                  </Typography>
                  
                  <EmergencyFeatureList>
                    {features[emergency.title]?.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <EmergencyFeatureItem color={emergency.color}>
                          <EmergencyIcon color={emergency.color}>
                            {feature.icon}
                          </EmergencyIcon>
                          <Box>
                            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {feature.desc}
                            </Typography>
                          </Box>
                        </EmergencyFeatureItem>
                      </motion.div>
                    ))}
                  </EmergencyFeatureList>

                  <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <EmergencyButton
                      color={emergency.color}
                      startIcon={<Phone />}
                      size="large"
                    >
                      Call Emergency: {emergency.contacts[0].number}
                    </EmergencyButton>
                    <EmergencyButton
                      color={emergency.color}
                      startIcon={<WhatsApp />}
                      size="large"
                      variant="outlined"
                    >
                      WhatsApp SOS
                    </EmergencyButton>
                  </Box>
                </motion.div>
              </ContentOverlay>
            </SlideContent>
          ))}
        </SwipeableViews>

        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            background: 'rgba(0,0,0,0.3)',
            '&:hover': { background: 'rgba(0,0,0,0.5)' }
          }}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            background: 'rgba(0,0,0,0.3)',
            '&:hover': { background: 'rgba(0,0,0,0.5)' }
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      </CarouselContainer>

      <StatsSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GradientTitle variant="h3" sx={{ mb: 6, textAlign: 'center' }} color={emergencyTypes[activeStep].color}>
              Emergency Response Statistics
            </GradientTitle>
          </motion.div>

          <Grid container spacing={4}>
            {Object.entries(emergencyTypes[activeStep].stats).map(([key, value], idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <StatsCard color={emergencyTypes[activeStep].color}>
                    <EmergencyIcon
                      color={emergencyTypes[activeStep].color}
                      className="stat-icon"
                      sx={{ mb: 2, width: 64, height: 64 }}
                    >
                      {idx === 0 ? <AccessTime /> : idx === 1 ? <People /> : <Assessment />}
                    </EmergencyIcon>
                    <Typography variant="h3" sx={{ mb: 2, color: emergencyTypes[activeStep].color }}>
                      {value}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                      {key}
                    </Typography>
                  </StatsCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StatsSection>

      <TimelineSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GradientTitle variant="h3" sx={{ mb: 6, textAlign: 'center' }} color={emergencyTypes[activeStep].color}>
              Emergency Response Process
            </GradientTitle>
          </motion.div>

          <Grid container spacing={4}>
            {emergencyTypes[activeStep].timeline.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TimelineCard color={emergencyTypes[activeStep].color}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                      <EmergencyIcon color={emergencyTypes[activeStep].color}>
                        {index + 1}
                      </EmergencyIcon>
                      <Box>
                        <Typography variant="h5" sx={{ color: emergencyTypes[activeStep].color, mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', opacity: 0.8 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TimelineCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </TimelineSection>

      <ContactSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GradientTitle variant="h3" sx={{ mb: 6, textAlign: 'center' }} color={emergencyTypes[activeStep].color}>
              Emergency Contacts
            </GradientTitle>
          </motion.div>

          <Grid container spacing={4}>
            {emergencyTypes[activeStep].contacts.map((contact, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ContactCard color={emergencyTypes[activeStep].color}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <EmergencyIcon
                        color={emergencyTypes[activeStep].color}
                        className="contact-icon"
                        sx={{ width: 72, height: 72 }}
                      >
                        {contact.icon}
                      </EmergencyIcon>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                          {contact.name}
                        </Typography>
                        <Typography variant="h4" sx={{ color: emergencyTypes[activeStep].color, mb: 2 }}>
                          {contact.number}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <GradientChip
                            icon={<Call />}
                            label="Call Now"
                            color={emergencyTypes[activeStep].color}
                            clickable
                          />
                          <GradientChip
                            icon={<Message />}
                            label="Send SMS"
                            color={emergencyTypes[activeStep].color}
                            clickable
                          />
                        </Stack>
                      </Box>
                    </Box>
                  </ContactCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </ContactSection>
    </PageContainer>
  );
};

export default EmergencyContact;
