import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Fade,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  AccessTime,
  Category,
  Description,
  DateRange,
  Info,
  Label,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';

const CardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BaseUrl}/cards/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCard(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching card details:', err);
        setError('Failed to load card details');
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/cards');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  if (!card) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography align="center">Card not found</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Enhanced Animated Background */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
            transition: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '150%',
            height: '150%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.1, 1, 1.1],
            transition: { duration: 50, repeat: Infinity, ease: "linear" }
          }}
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '-50%',
            width: '150%',
            height: '150%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced Back Button */}
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'fixed',
              // top: { xs: 16, md: 24, lg: 32 },
              top: 70,
              left: { xs: 16, md: 24 },
              bgcolor: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              width: { xs: 45, md: 54 },
              height: { xs: 45, md: 54 },
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.1) rotate(-10deg)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 10,
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Main Content */}
          <Box sx={{ maxWidth: '1400px', margin: '0 auto', mt: { xs: 6, md: 8 } }}>
            {/* Header Section */}
            <Grid container spacing={4} alignItems="center" sx={{ mb: { xs: 4, md: 6 } }}>
              {card.image && (
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: '2rem',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                          zIndex: 1,
                        },
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        style={{
                          width: '100%',
                          height: '400px',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </motion.div>
                </Grid>
              )}

              <Grid item xs={12} md={card.image ? 6 : 12}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Chip
                    label={card.type}
                    icon={<Category />}
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                      px: 2,
                      height: 32,
                    }}
                  />
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      color: '#64748b',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateRange sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle1">
                        {new Date(card.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>

            {/* Content Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {card.description.map((block, index) => {
                // Ensure we have a valid value to display
                const displayValue = typeof block.value === 'object' ? 
                  (block.value.text || JSON.stringify(block.value)) : 
                  String(block.value);

                return (
                  <Box
                    key={block._id || index}
                    sx={{
                      mb: 6,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -20,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(to bottom, #6366f1, #4f46e5)',
                        opacity: block.type === 'heading' ? 1 : 0,
                      }
                    }}
                  >
                    {block.type === 'heading' && (
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                          mb: 3,
                          fontSize: { xs: '1.75rem', md: '2.25rem' },
                        }}
                      >
                        {displayValue}
                      </Typography>
                    )}
                    {block.type === 'paragraph' && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#475569',
                          lineHeight: 1.8,
                          fontSize: '1.125rem',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {displayValue}
                      </Typography>
                    )}
                    {block.type === 'list' && (
                      <Box sx={{ pl: 3 }}>
                        {block.value.split('\n').map((item, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Label sx={{ color: '#6366f1', mt: 0.5 }} />
                            <Typography
                              sx={{
                                color: '#475569',
                                fontSize: '1.125rem',
                                lineHeight: 1.7,
                              }}
                            >
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    {block.type === 'quote' && (
                      <Box
                        sx={{
                          position: 'relative',
                          p: { xs: 4, md: 6 },
                          borderRadius: '1.5rem',
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(99, 102, 241, 0.1)',
                          '&::before': {
                            content: '"❝"',
                            position: 'absolute',
                            top: -30,
                            left: 30,
                            fontSize: '6rem',
                            color: 'rgba(99, 102, 241, 0.2)',
                            fontFamily: 'Georgia, serif',
                            lineHeight: 1,
                          }
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontStyle: 'italic',
                            color: '#1e293b',
                            lineHeight: 1.8,
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          {displayValue}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CardDetails;