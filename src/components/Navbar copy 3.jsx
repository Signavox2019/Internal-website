import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People,
  CreditCard,
  Link as LinkIcon,
  ConfirmationNumber,
  Person,
  ExitToApp,
  ChevronRight,
  Dashboard,
  Add as AddIcon,
  Close as CloseIcon,
  Title,  // Add this import
  Description,
  Work,
  Money,  // Add this import
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/signavox-logo.png';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const token = localStorage.getItem('token');

  const navItems = [
    { title: 'Dashboard', path: '/welcome', icon: <Dashboard />, adminOnly: true },
    { title: 'Landing', path: '/landing', icon: <Dashboard />, nonAdminOnly: true },
    { title: 'Employees', path: '/employees', icon: <People />, adminOnly: true },
    { title: 'Cards', path: '/cards', icon: <CreditCard />, showAlways: true },
    { title: 'Quick Links', path: '/quick-links', icon: <LinkIcon />, showAlways: true },
    { title: 'Tickets', path: '/tickets', icon: <ConfirmationNumber />, adminOnly: true },
    { title: 'Raise Ticket', path: '/tickets', icon: <ConfirmationNumber />, nonAdminOnly: true },
    { title: 'Job Feed', path: '/job-feed', icon: <Work />, showAlways: true },
    { title: 'Insurance', path: '/insurance', icon: <Money />, showAlways: true },
  ];

  const handleCreateTicket = async () => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${BaseUrl}/tickets`,
        ticketData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success('Ticket created successfully!');
        setOpenTicketModal(false);
        setTicketData({ title: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filteredNavItems = navItems.filter(item =>
    item.showAlways ||
    (isAdmin && item.adminOnly) ||
    (!isAdmin && item.nonAdminOnly)
  );

  // Add this line near other state declarations
  const location = useLocation(); // Add this hook at the top

  const handleTicketClick = () => {
    navigate('/tickets');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/employees/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);


  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              color="primary"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.img
              src={Logo}
              alt="Signavox Logo"
              style={{ height: 40, marginRight: 16 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'black',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Signavox
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {filteredNavItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="primary"
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'black',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      position: 'relative',
                      px: 2.5,
                      py: 1,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        background: 'linear-gradient(135deg, #8C52FF, #311188)',
                        transform: location.pathname === item.path ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease'
                      },
                      '& .MuiButton-startIcon': {
                        color: location.pathname === item.path ? '#311188' : '#0A081E',
                        transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                      },
                      '& .MuiButton-label': {
                        color: location.pathname === item.path ? '#4f46e5' : 'inherit',
                        fontWeight: location.pathname === item.path ? 700 : 600,
                      },
                      '&:hover': {
                        '&::after': {
                          transform: 'scaleX(1)',
                        },
                      }
                    }}
                  >
                    {item.title}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton onClick={handleProfileMenuOpen}>
                {/* <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 35,
                    height: 35
                  }}
                >
                  {userData.name?.charAt(0) || 'U'}
                </Avatar> */}
                {profileData?.profileImage ? (
                  <Avatar
                    src={profileData.profileImage}
                    sx={{
                      width: 35,
                      height: 35,
                      border: '2px solid rgba(79, 70, 229, 0.3)'
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      // bgcolor: 'primary.main',
                      background: '#311188 ',

                      width: 35,
                      height: 35
                    }}
                  >
                    {profileData?.name?.charAt(0) || userData.name?.charAt(0) || 'U'}
                  </Avatar>
                )}
              </IconButton>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            width: 240
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {filteredNavItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                position: 'relative',
                my: 0.5,
                mx: 1,
                borderRadius: '10px',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: location.pathname === item.path ?
                    'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)' :
                    'transparent',
                  transition: 'all 0.3s ease',
                },
                '&:hover': {
                  '&::before': {
                    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  },
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#4f46e5' : 'inherit',
                  transition: 'all 0.3s ease',
                  transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    color: location.pathname === item.path ? '#4f46e5' : 'inherit',
                    transition: 'all 0.3s ease',
                  }
                }}
              />
              {location.pathname === item.path && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    background: 'linear-gradient(to bottom, #4f46e5, #3b82f6)',
                    borderRadius: '4px 0 0 4px',
                    boxShadow: '0 0 10px rgba(79, 70, 229, 0.3)',
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Enhanced Ticket Creation Modal */}
      <Dialog
        open={openTicketModal}
        onClose={() => setOpenTicketModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConfirmationNumber
              sx={{
                fontSize: 28,
                color: 'primary.main',
                opacity: 0.8
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Raise New Ticket
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenTicketModal(false)}
            size="small"
            sx={{
              '&:hover': {
                transform: 'rotate(90deg)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            pt: 2,
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                },
              },
            }
          }}>
            <TextField
              fullWidth
              label="Title"
              value={ticketData.title}
              onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Title sx={{ color: 'primary.main', opacity: 0.7 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Description"
              value={ticketData.description}
              onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
              required
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description sx={{ color: 'primary.main', opacity: 0.7 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={() => setOpenTicketModal(false)}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleCreateTicket}
            loading={submitting}
            variant="contained"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
              }
            }}
          >
            Submit Ticket
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;