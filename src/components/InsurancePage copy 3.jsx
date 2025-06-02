import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Paper,
  Avatar,
  MobileStepper,
  useTheme,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeableViews from 'react-swipeable-views';
import {
  HealthAndSafety,
  LocalHospital,
  DirectionsCar,
  Home,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CreditCard,
  Shield,
  Security,
  AccountBalance,
} from '@mui/icons-material';

// Styled components for the credit card design
const CreditCardContainer = styled(Box)(({ theme }) => ({
  perspective: '1500px',
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.05) 0%, rgba(10, 8, 30, 0.1) 100%)',
    zIndex: -1,
  },
}));

const InsuranceCreditCard = styled(motion.div)(({ theme, bgimage }) => ({
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

const InsuranceCardContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
  padding: '30px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  color: 'white',
});

const CardChip = styled(Box)({
  width: '50px',
  height: '40px',
  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  borderRadius: '8px',
  marginBottom: '20px',
});

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

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
  maxWidth: '1600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 48px',
  position: 'relative',
  zIndex: 1,
  gap: '48px',
});

const InsuranceDetails = styled(Box)(({ theme }) => ({
  flex: 1,
  color: 'white',
  maxWidth: '600px',
}));

const FeatureList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const PolicySection = styled(Box)(({ theme }) => ({
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

const PolicyCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #311188 0%, #0A081E 100%)',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
  },
}));

const PolicyTable = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  '& table': {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    '& th, & td': {
      padding: theme.spacing(2),
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      textAlign: 'left',
    },
    '& th': {
      background: 'rgba(49, 17, 136, 0.05)',
      fontWeight: 600,
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, #311188 0%, transparent 100%)',
      },
    },
    '& tr:hover td': {
      background: 'rgba(49, 17, 136, 0.02)',
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
  boxShadow: '0 4px 12px rgba(49, 17, 136, 0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const InsurancePage = () => {
  const [userData, setUserData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const insuranceTypes = [
    {
      type: 'Health Insurance',
      amount: '₹500,000',
      icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80',
      color: '#4CAF50',
      benefits: ['Comprehensive medical coverage', '100% hospitalization coverage', 'Family floater option'],
      cardNumber: '4321 •••• •••• 1234',
    },
    {
      type: 'Life Insurance',
      amount: '₹2,000,000',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
      color: '#2196F3',
      benefits: ['Term life coverage', 'Accidental death benefit', 'Critical illness coverage'],
      cardNumber: '5678 •••• •••• 5678',
    },
    {
      type: 'Vehicle Insurance',
      amount: '₹100,000',
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80',
      color: '#9C27B0',
      benefits: ['Comprehensive coverage', 'Third-party liability', '24/7 roadside assistance'],
      cardNumber: '9012 •••• •••• 9012',
    },
    {
      type: 'Home Insurance',
      amount: '₹1,000,000',
      icon: <Home sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80',
      color: '#FF5722',
      benefits: ['Property coverage', 'Natural disaster protection', 'Content insurance'],
      cardNumber: '3456 •••• •••• 3456',
    },
  ];

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    setUserData(storedUserData);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % insuranceTypes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [insuranceTypes.length]);

  const maxSteps = insuranceTypes.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const features = {
    'Health Insurance': [
      { icon: <LocalHospital />, title: 'Hospital Coverage', desc: 'Full coverage for hospitalization' },
      { icon: <Security />, title: 'Family Protection', desc: 'Covers entire family' },
      { icon: <AccountBalance />, title: 'No Claim Bonus', desc: 'Up to 50% bonus' },
      { icon: <Shield />, title: 'Pre-existing Coverage', desc: 'After 2 years' },
    ],
    'Life Insurance': [
      { icon: <Shield />, title: 'Term Coverage', desc: 'Up to age 75' },
      { icon: <Security />, title: 'Accidental Benefit', desc: 'Double sum assured' },
      { icon: <AccountBalance />, title: 'Tax Benefits', desc: 'Under 80C' },
      { icon: <CreditCard />, title: 'Premium Waiver', desc: 'On disability' },
    ],
    'Vehicle Insurance': [
      { icon: <DirectionsCar />, title: 'Comprehensive Cover', desc: 'All risk coverage' },
      { icon: <Shield />, title: 'Third Party', desc: 'Liability coverage' },
      { icon: <Security />, title: 'Zero Depreciation', desc: 'Full claim amount' },
      { icon: <LocalHospital />, title: 'Personal Accident', desc: '₹15 lakh cover' },
    ],
    'Home Insurance': [
      { icon: <Home />, title: 'Structure Coverage', desc: 'Full rebuilding cost' },
      { icon: <Shield />, title: 'Contents Cover', desc: 'All belongings' },
      { icon: <Security />, title: 'Natural Disasters', desc: 'Complete protection' },
      { icon: <AccountBalance />, title: 'Rent Coverage', desc: 'Alternative accommodation' },
    ],
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#000' }}>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        style={{ width: '100%', height: '80vh' }}
      >
        {insuranceTypes.map((insurance, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <SlideContainer bgimage={insurance.bgImage}>
                <ContentWrapper>
                  {/* Left side - Insurance Details */}
                  <InsuranceDetails>
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
                        {insurance.type}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 3,
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                        }}
                      >
                        Coverage up to {insurance.amount}
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
                        {insurance.benefits.join(' • ')}
                      </Typography>

                      <FeatureList>
                        {features[insurance.type].map((feature, idx) => (
                          <FeatureItem key={idx}>
                            <Avatar
                              sx={{
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40,
                              }}
                            >
                              {feature.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="600">
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {feature.desc}
                              </Typography>
                            </Box>
                          </FeatureItem>
                        ))}
                      </FeatureList>
                    </motion.div>
                  </InsuranceDetails>

                  {/* Right side - Credit Card */}
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <InsuranceCreditCard
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.6 }}
                        bgimage={insurance.bgImage}
                      >
                        <CardOverlay />
                        <InsuranceCardContent>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              {insurance.icon}
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>{insurance.type}</Typography>
                            </Box>
                            <CardChip />
                            <Typography variant="h5" sx={{ mb: 1, fontFamily: 'monospace' }}>
                              {insurance.cardNumber}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Card Holder</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                              <Typography variant="h6">{userData?.name || 'Loading...'}</Typography>
                              <Typography variant="h5" sx={{ fontWeight: 600 }}>{insurance.amount}</Typography>
                            </Box>
                          </Box>
                        </InsuranceCardContent>
                      </InsuranceCreditCard>
                    </motion.div>
                  </Box>
                </ContentWrapper>

                {/* Navigation controls */}
                <Box sx={{ position: 'absolute', bottom: 40, width: '100%', zIndex: 2 }}>
                  <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    sx={{
                      background: 'transparent',
                      maxWidth: 400,
                      margin: '0 auto',
                      '& .MuiMobileStepper-dot': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        width: 12,
                        height: 12,
                        margin: '0 8px',
                      },
                      '& .MuiMobileStepper-dotActive': {
                        backgroundColor: 'white',
                      },
                    }}
                    nextButton={
                      <IconButton
                        size="large"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                          '&.Mui-disabled': { opacity: 0.3 },
                        }}
                      >
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                      </IconButton>
                    }
                    backButton={
                      <IconButton
                        size="large"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                          '&.Mui-disabled': { opacity: 0.3 },
                        }}
                      >
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                      </IconButton>
                    }
                  />
                </Box>
              </SlideContainer>
            ) : null}
          </div>
        ))}
      </SwipeableViews>

      {/* Detailed Insurance Policies Section */}
      <PolicySection>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GradientText
              variant="h3"
              align="center"
              sx={{ mb: 6 }}
            >
              Comprehensive Insurance Coverage
            </GradientText>
          </motion.div>

          {/* Policy cards section */}
          <Grid container spacing={4}>
            {insuranceTypes.map((insurance, index) => (
              <Grid item xs={12} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <PolicyCard>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <FeatureIcon sx={{ width: 56, height: 56 }}>
                              {insurance.icon}
                            </FeatureIcon>
                            <GradientText variant="h4">
                              {insurance.type}
                            </GradientText>
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
                              mb: 2,
                              background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            Coverage: {insurance.amount}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              flex: 1,
                              padding: 2,
                              borderRadius: 2,
                              background: 'rgba(49, 17, 136, 0.03)',
                            }}
                          >
                            {insurance.benefits.map((benefit, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Shield sx={{ color: 'primary.main', fontSize: 16 }} />
                                {benefit}
                              </Box>
                            ))}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <PolicyTable>
                          <table>
                            <thead>
                              <tr>
                                <th>Feature</th>
                                <th>Description</th>
                                <th>Coverage Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {features[insurance.type].map((feature, idx) => (
                                <motion.tr
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                                >
                                  <td>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <FeatureIcon sx={{ width: 32, height: 32 }}>
                                        {feature.icon}
                                      </FeatureIcon>
                                      <Typography variant="subtitle2" fontWeight="600">
                                        {feature.title}
                                      </Typography>
                                    </Box>
                                  </td>
                                  <td>{feature.desc}</td>
                                  <td>
                                    <Chip
                                      label="Covered"
                                      size="small"
                                      sx={{
                                        background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                                        color: 'white',
                                        fontWeight: 500,
                                        '& .MuiChip-label': {
                                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                        },
                                      }}
                                    />
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </PolicyTable>
                      </Grid>
                    </Grid>
                  </PolicyCard>
                </motion.div>
              </Grid>
            ))}

            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <PolicyCard>
                  <GradientText variant="h5" gutterBottom>Important Notes</GradientText>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          mb: 3,
                          p: 3,
                          borderRadius: 2,
                          background: 'rgba(49, 17, 136, 0.03)',
                          height: '100%',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          gutterBottom
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'primary.main',
                          }}
                        >
                          <Security /> Eligibility Criteria
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                          {['Permanent employees with more than 3 months of service',
                            'Age between 18-60 years',
                            'Valid identification and documentation',
                            'Medical examination may be required for certain policies'].map((item, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Shield sx={{ color: 'primary.main', fontSize: 16 }} />
                                {item}
                              </Box>
                            ))}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          mb: 3,
                          p: 3,
                          borderRadius: 2,
                          background: 'rgba(49, 17, 136, 0.03)',
                          height: '100%',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          gutterBottom
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'primary.main',
                          }}
                        >
                          <AccountBalance /> Claim Process
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                          {['Submit claim form within 30 days of incident',
                            'Provide all necessary documentation',
                            'Claims processed within 7-14 working days',
                            'Direct settlement available with network hospitals'].map((item, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Shield sx={{ color: 'primary.main', fontSize: 16 }} />
                                {item}
                              </Box>
                            ))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </PolicyCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </PolicySection>
    </Box>
  );
};

export default InsurancePage;
