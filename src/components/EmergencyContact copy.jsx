import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  Zoom,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slide,
  MobileStepper,
  Paper,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SwipeableViews from 'react-swipeable-views';
import {
  LocalHospital,
  Security,
  LocalPolice,
  FireTruck,
  ContactEmergency,
  Support,
  HealthAndSafety,
  Call,
  Message,
  WhatsApp,
  Close,
  Phone,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Warning,
  Info,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';

// Background images for sections
const SECTION_IMAGES = {
  medical: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80',
  security: 'https://images.unsplash.com/photo-1454117096348-e4abbeba002c?auto=format&fit=crop&q=80',
  support: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80',
};

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#000',
  position: 'relative',
  overflow: 'hidden',
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  position: 'relative',
}));

const SlideContent = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(49, 17, 136, 0.9) 0%, rgba(10, 8, 30, 0.9) 100%)',
    zIndex: 1,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  maxWidth: '1200px',
  margin: '0 auto',
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.15)',
  },
}));

const EmergencyButton = styled(Fab)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(45deg, #311188, #0A081E)',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'all 0.5s ease',
  },
  '&:hover': {
    background: 'linear-gradient(45deg, #0A081E, #311188)',
    '&::before': {
      left: 100,
    },
  },
}));

const ContactDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
}));

const EmergencyContact = () => {
  const [userData, setUserData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    setUserData(storedUserData);
  }, []);

  const emergencyContacts = {
    medical: {
      title: 'Medical Emergency',
      image: SECTION_IMAGES.medical,
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      contacts: [
        { name: 'Emergency Ambulance', number: '102', icon: <LocalHospital /> },
        { name: 'Hospital Helpdesk', number: '1800-102-1234', icon: <HealthAndSafety /> },
      ],
      info: [
        {
          title: 'Emergency Protocol',
          description: 'Stay calm and assess the situation. Call emergency services immediately for serious injuries.',
          icon: <Warning />,
        },
        {
          title: 'First Aid Locations',
          description: 'First aid kits are available at every floor near the elevator and security desk.',
          icon: <LocationOn />,
        },
        {
          title: 'Response Time',
          description: 'Average ambulance response time: 8-10 minutes',
          icon: <AccessTime />,
        },
      ],
    },
    security: {
      title: 'Security Services',
      image: SECTION_IMAGES.security,
      icon: <Security sx={{ fontSize: 40 }} />,
      contacts: [
        { name: 'Police Control Room', number: '100', icon: <LocalPolice /> },
        { name: 'Fire Emergency', number: '101', icon: <FireTruck /> },
      ],
      info: [
        {
          title: 'Security Protocol',
          description: 'In case of suspicious activity, inform security immediately and avoid confrontation.',
          icon: <Warning />,
        },
        {
          title: 'Emergency Exits',
          description: 'Emergency exits are located at both ends of each floor. Follow the illuminated signs.',
          icon: <LocationOn />,
        },
        {
          title: 'Security Coverage',
          description: '24/7 security personnel and CCTV surveillance throughout the premises.',
          icon: <Info />,
        },
      ],
    },
    support: {
      title: 'Office Support',
      image: SECTION_IMAGES.support,
      icon: <Support sx={{ fontSize: 40 }} />,
      contacts: [
        { name: 'HR Helpdesk', number: '+91 98765 43210', icon: <ContactEmergency /> },
        { name: 'IT Support', number: '+91 98765 43211', icon: <Support /> },
      ],
      info: [
        {
          title: 'Support Hours',
          description: 'IT and HR support available from 9 AM to 6 PM on weekdays.',
          icon: <AccessTime />,
        },
        {
          title: 'Help Desk Location',
          description: 'IT support desk is located on the 2nd floor, HR on the 3rd floor.',
          icon: <LocationOn />,
        },
        {
          title: 'Service Level',
          description: 'Priority tickets are addressed within 2 hours during business hours.',
          icon: <Info />,
        },
      ],
    },
  };

  const sections = Object.values(emergencyContacts);
  const maxSteps = sections.length;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <PageContainer>
      <CarouselContainer>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          style={{ height: '100%' }}
        >
          {sections.map((section, index) => (
            <div key={index} style={{ height: '100%' }}>
              {Math.abs(activeStep - index) <= 2 ? (
                <SlideContent
                  sx={{
                    backgroundImage: `url(${section.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <ContentWrapper>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 800,
                          mb: 3,
                          background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {section.title}
                      </Typography>

                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 4 }}>
                            {section.contacts.map((contact, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.2 }}
                              >
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <EmergencyButton
                                    size="large"
                                    onClick={() => setSelectedSection({ ...section, currentContact: contact })}
                                  >
                                    {contact.icon}
                                  </EmergencyButton>
                                  <Box>
                                    <Typography variant="h6">{contact.name}</Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                      {contact.number}
                                    </Typography>
                                  </Box>
                                </Box>
                              </motion.div>
                            ))}
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {section.info.map((info, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ x: 50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.2 }}
                            >
                              <InfoCard>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                  <Box sx={{ mt: 0.5 }}>{info.icon}</Box>
                                  <Box>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                      {info.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                      {info.description}
                                    </Typography>
                                  </Box>
                                </Box>
                              </InfoCard>
                            </motion.div>
                          ))}
                        </Grid>
                      </Grid>
                    </motion.div>
                  </ContentWrapper>
                </SlideContent>
              ) : null}
            </div>
          ))}
        </SwipeableViews>

        <MobileStepper
          steps={maxSteps}
          position="bottom"
          activeStep={activeStep}
          sx={{
            background: 'transparent',
            position: 'absolute',
            bottom: 40,
            width: '100%',
            '& .MuiMobileStepper-dot': {
              backgroundColor: 'rgba(255,255,255,0.3)',
            },
            '& .MuiMobileStepper-dotActive': {
              backgroundColor: 'white',
            },
          }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              sx={{ color: 'white' }}
            >
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ color: 'white' }}
            >
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </CarouselContainer>

      <ContactDialog
        open={Boolean(selectedSection)}
        onClose={() => setSelectedSection(null)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        maxWidth="sm"
        fullWidth
      >
        {selectedSection && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(45deg, #311188, #0A081E)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {selectedSection.icon}
                <Typography variant="h6">{selectedSection.currentContact.name}</Typography>
              </Box>
              <IconButton
                onClick={() => setSelectedSection(null)}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Emergency Number"
                    secondary={selectedSection.currentContact.number}
                  />
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                <Fab color="primary" size="small">
                  <Call />
                </Fab>
                <Fab color="primary" size="small">
                  <Message />
                </Fab>
                <Fab color="primary" size="small">
                  <WhatsApp />
                </Fab>
              </Box>
            </DialogContent>
          </>
        )}
      </ContactDialog>
    </PageContainer>
  );
};

export default EmergencyContact;
