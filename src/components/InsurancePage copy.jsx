import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Grid, Avatar, Chip, Card, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import SwipeableViews from 'react-swipeable-views';
import { useTheme, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
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
    background: 'radial-gradient(circle at top left, #1a237e 0%, #000000 100%)',
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
  border: '1px solid rgba(255, 255, 255, 0.2)'
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
    profileImage: '',
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
        'No Claim Bonus'
      ],
      description: 'Comprehensive health coverage including hospitalization, medicines, and specialist consultations.'
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
        'Critical Illness Coverage'
      ],
      description: 'Secure your family future with our comprehensive life insurance policy.'
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
        'Zero Depreciation'
      ],
      description: 'Complete protection for your vehicle against accidents, theft, and third-party liability.'
    }
  ];

  const creditCards = [
    {
      title: 'Premium Credit Card',
      gradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
      cardNumber: '4321 **** **** 9012',
      type: 'VISA Signature'
    },
    {
      title: 'Corporate Credit Card',
      gradient: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
      cardNumber: '5678 **** **** 1234',
      type: 'MasterCard World'
    }
  ];

  return (
    <StyledContainer maxWidth="xl">
      {/* User Profile Section */}
      <UserProfileSection elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Avatar
              src={userData.profileImage}
              alt={userData.name}
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto',
                border: '4px solid rgba(255, 255, 255, 0.2)'
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
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Your Insurance Coverage
        </Typography>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Benefits</Typography>
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
                </Grid>
              </CarouselCard>
            </Box>
          ))}
        </SwipeableViews>
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
                  border: '1px solid rgba(255,255,255,0.2)'
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