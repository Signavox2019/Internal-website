import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 2,
        mt: 'auto',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Signavox. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover"
              sx={{ typography: 'body2' }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover"
              sx={{ typography: 'body2' }}
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover"
              sx={{ typography: 'body2' }}
            >
              Contact Support
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;