import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Container, Paper, Grid, Avatar, Chip, Card,
  Divider, IconButton, Button, CardContent
} from '@mui/material';
import { motion } from 'framer-motion';
import SwipeableViews from 'react-swipeable-views';
import { useTheme, styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    zIndex: -1,
  }
}));

const UserProfileSection = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  color: 'white',
  marginBottom: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const CarouselCard = styled(Paper)(({ gradient }) => ({
  background: gradient,
  borderRadius: '20px',
  padding: '2rem',
  color: 'white',
  height: '100%',
  minHeight: '400px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    zIndex: 1
  }
}));

const CreditCard = styled(Card)(({ theme, variant }) => ({
  width: '100%',
  maxWidth: '400px',
  height: '220px',
  borderRadius: '15px',
  padding: theme.spacing(3),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  background: variant === 'gold' 
    ? 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)'
    : 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 1
  }
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)'
  }
}));

const InsurancePage = () => {
  const theme = useTheme();
  const [activeInsuranceStep, setActiveInsuranceStep] = useState(0);
  const [activeCreditStep, setActiveCreditStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    employeeId: '',
    role: '',
    experience: '',
    email: '',
    bloodGroup: '',
    team: '',
    status: ''
  });

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const insuranceTypes = [
    {
      title: 'Health Insurance',
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
      coverage: '₹5,00,000',
      premium: '₹2,500/month',
      benefits: [
        'Cashless Treatment',
        'Pre & Post Hospitalization',
        'No Claim Bonus',
        'Family Coverage',
        'Maternity Benefits'
      ],
      description: 'Comprehensive health coverage including hospitalization, medicines, and specialist consultations.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800'
    },
    {
      title: 'Life Insurance',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)',
      coverage: '₹50,00,000',
      premium: '₹5,000/month',
      benefits: [
        'Term Life Coverage',
        'Accidental Death Benefit',
        'Critical Illness Coverage',
        'Disability Benefits',
        'Investment Options'
      ],
      description: 'Secure your family\'s future with our comprehensive life insurance policy.',
      image: 'https://images.unsplash.com/photo-1518183214770-9cffbec72538?auto=format&fit=crop&w=800'
    },
    {
      title: 'Vehicle Insurance',
      icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
      coverage: '₹2,00,000',
      premium: '₹1,500/month',
      benefits: [
        'Third Party Liability',
        'Own Damage Coverage',
        'Zero Depreciation',
        'Roadside Assistance',
        '24/7 Claims Support'
      ],
      description: 'Complete protection for your vehicle against accidents, theft, and third-party liability.',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800'
    }
  ];

  const creditCards = [
    {
      title: 'Premium Credit Card',
      gradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
      cardNumber: '4321 **** **** 9012',
      type: 'VISA Signature',
      variant: 'premium'
    },
    {
      title: 'Corporate Credit Card',
      gradient: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
      cardNumber: '5678 **** **** 1234',
      type: 'MasterCard World',
      variant: 'gold'
    }
  ];

  const handleNextInsurance = () => {
    setActiveInsuranceStep((prev) => (prev + 1) % insuranceTypes.length);
  };

  const handlePrevInsurance = () => {
    setActiveInsuranceStep((prev) => (prev - 1 + insuranceTypes.length) % insuranceTypes.length);
  };

  return (
    <StyledContainer maxWidth="xl">
      {/* Animated background elements */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' }}>
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            rotate: -360,
            transition: { duration: 50, repeat: Infinity, ease: "linear" }
          }}
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '-50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%)',
          }}
        />
      </Box>

      {/* User Profile Section */}
      <UserProfileSection elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Avatar
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`}
              alt={userData.name}
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)'
              }}
            />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              {userData.name}
            </Typography>
            <InfoChip
              icon={<BadgeIcon />}
              label={userData.employeeId}
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <InfoChip icon={<WorkIcon />} label={`Role: ${userData.role}`} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <InfoChip icon={<PersonIcon />} label={`Experience: ${userData.experience}`} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <InfoChip icon={<EmailIcon />} label={userData.email} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <InfoChip icon={<BloodtypeIcon />} label={`Blood Group: ${userData.bloodGroup}`} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <InfoChip icon={<WorkIcon />} label={`Team: ${userData.team}`} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <InfoChip label={`Status: ${userData.status}`} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </UserProfileSection>

      {/* Insurance Carousel Section */}
      <Box sx={{ mb: 6, position: 'relative' }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Your Insurance Coverage
        </Typography>
        
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handlePrevInsurance}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'white' }
            }}
          >
            <ArrowBack />
          </IconButton>

          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeInsuranceStep}
            onChangeIndex={setActiveInsuranceStep}
            enableMouseEvents
          >
            {insuranceTypes.map((insurance, index) => (
              <Box key={index} sx={{ px: 2 }}>
                <CarouselCard gradient={insurance.gradient}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        {insurance.icon}
                        <Typography variant="h4" sx={{ ml: 2 }}>
                          {insurance.title}
                        </Typography>
                      </Box>
                      <Typography variant="h3" sx={{ mb: 2 }}>
                        {insurance.coverage}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Premium: {insurance.premium}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                        {insurance.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {insurance.benefits.map((benefit, idx) => (
                          <Chip
                            key={idx}
                            label={benefit}
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          height: '100%',
                          minHeight: 300,
                          borderRadius: 4,
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={insurance.image}
                          alt={insurance.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CarouselCard>
              </Box>
            ))}
          </SwipeableViews>

          <IconButton
            onClick={handleNextInsurance}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'white' }
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>

      {/* Credit Cards Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Your Credit Cards
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {creditCards.map((card, index) => (
            <Grid item xs={12} md={6} key={index}>
              <CreditCard variant={card.variant}>
                <Box sx={{ height: '100%', position: 'relative' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h6">{card.title}</Typography>
                    <CreditCardIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      letterSpacing: 4,
                      fontFamily: 'monospace',
                      mb: 2
                    }}
                  >
                    {card.cardNumber}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                    <Typography>{userData.name}</Typography>
                    <Typography>{card.type}</Typography>
                  </Box>
                </Box>
              </CreditCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Insurance Overview Grid */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Insurance Overview
        </Typography>
        <Grid container spacing={3}>
          {insuranceTypes.map((insurance, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '15px',
                  color: 'white',
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {insurance.icon}
                  <Typography variant="h6" sx={{ ml: 2 }}>{insurance.title}</Typography>
                </Box>
                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Typography variant="h5" sx={{ mb: 1 }}>Coverage: {insurance.coverage}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Premium: {insurance.premium}</Typography>
                <Typography variant="body2">{insurance.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledContainer>
  );
};

export default InsurancePage;