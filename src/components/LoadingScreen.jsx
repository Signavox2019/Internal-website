import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import logo from '../assets/signavox-logo.png';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut"
        }}
      >
        <motion.img
          src={logo}
          alt="Signavox Logo"
          style={{
            width: '100px',
            height: 'auto',
          }}
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </Box>
  );
};

export default LoadingScreen; 