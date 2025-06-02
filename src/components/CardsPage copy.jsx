import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, Chip, IconButton, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, CircularProgress, Skeleton, Tabs, Tab, Divider,
  Paper, Tooltip, Menu, Zoom,
} from '@mui/material';
import {
  Add, Search, FilterList, Edit, Delete,
  Close, Image, Title, Description, Category,
  Save, ArrowUpward, AccessTime, Newspaper,
  EmojiEvents, Policy, HealthAndSafety, Info
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import BaseUrl from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// Add this new styled component for the content type selector
const ContentTypeSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

// Update the StyledCard component
const StyledCard = styled(Card)(({ theme, cardType }) => ({
  height: '400px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(15px) saturate(180%)',
  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',

  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(31, 38, 135, 0.25)',
    '& .card-image': {
      transform: 'scale(1.1)',
    },
    '& .card-overlay': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '& .card-content': {
      transform: 'translateY(0)',
      opacity: 1,
    }
  }
}));

// Update the CardContent component
const CardImage = styled(Box)(({ theme }) => ({
  height: '220px',
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  }
}));

// const CardOverlay = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'flex-end',
//   padding: theme.spacing(2),
//   opacity: 0,
//   transform: 'translateY(20px)',
//   transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//   '&.card-overlay': {}
// }));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  '&.card-content': {}
}));

const CardTypeIcon = ({ type }) => {
  const iconProps = { sx: { fontSize: 40, color: 'white', opacity: 0.9 } };

  switch (type) {
    case 'News':
      return <Newspaper {...iconProps} />;
    case 'Leadership':
      return <EmojiEvents {...iconProps} />;
    case 'HR Policies':
      return <Policy {...iconProps} />;
    case 'Insurance Policies':
      return <HealthAndSafety {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
};

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  padding: theme.spacing(2), // Adjusted padding
  transition: 'all 0.3s ease',
}));

const CardActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2), // 16px
  right: theme.spacing(2), // 16px
  display: 'flex',
  gap: theme.spacing(1), // 8px
  opacity: 0, // Hidden by default
  transform: 'translateY(-10px)',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  zIndex: 10, // Ensure it's above other elements
  // className: 'card-actions' // The class will be applied on the instance
}));

const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: 30,
  right: 30,
  borderRadius: '50%',
  width: 64,
  height: 64,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  zIndex: 10,
}));

// Helper function to get color based on card type
function getCardTypeColor(type) {
  switch (type) {
    case 'News':
      return 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)';
    case 'Leadership':
      return 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)';
    case 'HR Policies':
      return 'linear-gradient(90deg, #ec4899 0%, #db2777 100%)';
    case 'Insurance Policies':
      return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
    default:
      return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
  }
}

// Helper function to get background gradient based on card type
function getCardBackground(type) {
  switch (type) {
    case 'News':
      return 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)';
    case 'Leadership':
      return 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.1) 100%)';
    case 'HR Policies':
      return 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.1) 100%)';
    case 'Insurance Policies':
      return 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%)';
    default:
      return 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%)';
  }
}

// Add this new component for the content preview
const ContentPreview = ({ blocks }) => {
  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <Typography variant="subtitle2" gutterBottom>Preview:</Typography>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <Typography key={index} variant="h6" gutterBottom>{block.value}</Typography>;
          case 'paragraph':
            return <Typography key={index} paragraph>{block.value}</Typography>;
          case 'list':
            return (
              <ul key={index} style={{ paddingLeft: 20, margin: '8px 0' }}>
                {block.value.split('\n').map((item, i) => (
                  <li key={i}><Typography>{item}</Typography></li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <Box key={index} sx={{ borderLeft: 3, borderColor: 'primary.main', pl: 2, my: 1 }}>
                <Typography fontStyle="italic">{block.value}</Typography>
              </Box>
            );
          default:
            return null;
        }
      })}
    </Box>
  );
};

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [cardForm, setCardForm] = useState({
    title: '',
    description: [{ type: 'paragraph', value: '' }],
    type: 'Other',
    image: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null); // For tracking ID of card being edited
  const [isEditMode, setIsEditMode] = useState(false); // For dialog mode
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [typeCounts, setTypeCounts] = useState({});
  const [previewImage, setPreviewImage] = useState('');

  // Add new state for content blocks
  const [contentBlocks, setContentBlocks] = useState([]);
  const [currentBlockType, setCurrentBlockType] = useState('paragraph');
  const [currentBlockValue, setCurrentBlockValue] = useState('');

  // Get token from localStorage
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Fetch cards data
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        // Check if token exists
        if (!token) {
          setError('Authentication token is missing. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BaseUrl}/cards`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCards(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCards();
    fetchCardCounts();

    // Add scroll listener for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [token]);

  // Fetch card counts by category
  const fetchCardCounts = async () => {
    try {
      const types = ['News', 'Leadership', 'HR Policies', 'Insurance Policies', 'Other'];
      const counts = {};

      for (const type of types) {
        const response = await axios.get(`${BaseUrl}/cards/count/${type}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        counts[type] = response.data.count;
      }

      setTypeCounts(counts);
    } catch (err) {
      console.error('Error fetching card counts:', err);
    }
  };

  // Filter cards based on search term and type filter
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || card.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setFilterType(['all', 'News', 'Leadership', 'HR Policies', 'Insurance Policies', 'Other'][newValue]);
  };

  // Handle menu open/close - REMOVE if MoreVert menu is gone from cards
  // const handleMenuOpen = (event, card) => {
  //   setAnchorEl(event.currentTarget);
  //   setSelectedCard(card); // Keep if selectedCard object is needed elsewhere
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle description change
  const handleDescriptionChange = (value) => {
    setCardForm(prev => ({
      ...prev,
      description: Array.isArray(value) ? value : [{ type: 'paragraph', value: value || '' }]
    }));
    // Clear error when field is edited
    if (formErrors.description) {
      setFormErrors(prev => ({
        ...prev,
        description: ''
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardForm(prev => ({
        ...prev,
        image: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!cardForm.title.trim()) errors.title = 'Title is required';
    // Fix the description validation to handle both string and array formats
    if (!cardForm.description ||
      (typeof cardForm.description === 'string' && !cardForm.description.trim()) ||
      (Array.isArray(cardForm.description) && (!cardForm.description[0]?.value?.trim()))) {
      errors.description = 'Description is required';
    }
    if (!cardForm.type) errors.type = 'Type is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', cardForm.title);
      formData.append('description', JSON.stringify(contentBlocks));
      formData.append('type', cardForm.type);
      if (cardForm.image) {
        formData.append('image', cardForm.image);
      }

      const response = await axios.post(`${BaseUrl}/cards`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Card created successfully!');
      setCards(prev => [...prev, response.data.card]);
      fetchCardCounts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error(error.response?.data?.message || 'Failed to create card');
    } finally {
      setSubmitting(false);
    }
  };

  // Add new function to handle content block addition
  const handleAddContentBlock = () => {
    if (currentBlockValue.trim()) {
      const newBlock = {
        type: currentBlockType,
        value: currentBlockValue.trim()
      };
      setContentBlocks(prev => [...prev, newBlock]);
      setCurrentBlockValue('');
    }
  };

  // Add new function to remove content block
  const handleRemoveBlock = (index) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index));
  };

  // Handle card deletion
  const handleDeleteCard = (cardId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BaseUrl}/cards/${cardId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setCards(prev => prev.filter(card => card._id !== cardId));
          fetchCardCounts();
          toast.success('Card deleted successfully!');
        } catch (error) {
          console.error('Error deleting card:', error);
          toast.error(error.response?.data?.message || 'Failed to delete card');
        }
      }
    });

    handleMenuClose(); // Remove if menu is gone
  };

  // Handle opening dialog for creating a new card
  const handleOpenDialog = () => {
    setIsEditMode(false);
    setSelectedCardId(null);
    setCardForm({
      title: '',
      description: [{ type: 'paragraph', value: '' }],
      type: 'Other',
      image: null
    });
    setFormErrors({});
    setPreviewImage('');
    setOpenDialog(true);
  };

  // Handle opening dialog for editing an existing card
  const handleEditCard = (cardToEdit) => {
    setIsEditMode(true);
    setSelectedCardId(cardToEdit._id);
    setCardForm({
      title: cardToEdit.title,
      // Ensure description is correctly formatted for the form.
      // If your form expects a single string for description:
      description: cardToEdit.description && cardToEdit.description.length > 0 && cardToEdit.description[0].value
        ? cardToEdit.description[0].value
        : '', // Or handle complex description structures as needed by your form
      // If your form expects the array of blocks:
      // description: cardToEdit.description || [{ type: 'paragraph', value: '' }],
      type: cardToEdit.type,
      image: null, // Will not re-upload image unless a new one is selected
    });
    setPreviewImage(cardToEdit.image || ''); // Show current image
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setSelectedCardId(null);
    // Reset form to initial state
    setCardForm({
      title: '',
      description: [{ type: 'paragraph', value: '' }], // Or single string if form changed
      type: 'Other',
      image: null
    });
    setFormErrors({});
    setPreviewImage('');
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
  };

  // Render card content blocks
  const renderContentBlocks = (blocks) => {
    if (!blocks || blocks.length === 0) return null;

    return blocks.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return <Typography key={index} variant="h5" gutterBottom>{block.value}</Typography>;
        case 'paragraph':
          return <Typography key={index} variant="body1" paragraph>{block.value}</Typography>;
        case 'list':
          return (
            <ul key={index} style={{ paddingLeft: '20px', margin: '10px 0' }}>
              {Array.isArray(block.value) && block.value.map((item, i) => (
                <li key={i}><Typography variant="body1">{item}</Typography></li>
              ))}
            </ul>
          );
        case 'quote':
          return (
            <Box key={index} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, my: 2 }}>
              <Typography variant="body1" fontStyle="italic">{block.value}</Typography>
            </Box>
          );
        case 'image':
          return <CardMedia key={index} component="img" image={block.value} alt="Content image" sx={{ my: 2, borderRadius: 1 }} />;
        default:
          return null;
      }
    });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 4,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    }}>
      <ToastContainer position="top-right" autoClose={3000} />

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

      <Container maxWidth="xl">
        {/* Header with animations */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Box sx={{
            mb: 4,
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated decorative elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
              }}
              style={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0
              }}
            />
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: { duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }
              }}
              style={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Knowledge Cards
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, maxWidth: '800px' }}>
                Explore our collection of informative cards covering company news, leadership insights, HR policies, and more.
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Search and filter section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    '& fieldset': { border: 'none' },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 'auto',
                    },
                  }}
                >
                  <Tab label={`All (${cards.length})`} />
                  <Tab label={`News (${typeCounts['News'] || 0})`} />
                  <Tab label={`Leadership (${typeCounts['Leadership'] || 0})`} />
                  <Tab label={`HR Policies (${typeCounts['HR Policies'] || 0})`} />
                  <Tab label={`Insurance (${typeCounts['Insurance Policies'] || 0})`} />
                  <Tab label={`Other (${typeCounts['Other'] || 0})`} />
                </Tabs>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Cards grid with animations */}
        {/* {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', borderRadius: 4 }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={40} width="80%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={60} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <Typography color="error" variant="h6">{error}</Typography>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card._id}>
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.02 }}
                        style={{ height: '100%' }}
                      >
                        <StyledCard cardType={card.type}>
                          <Box sx={{ height: '300px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                            {card.image ? (
                              <CardMedia
                                component="img"
                                image={card.image}
                                alt={card.title}
                                sx={{
                                  height: '100%',
                                  width: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.4s ease-in-out',
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  height: '100%',
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: getCardTypeColor(card.type),
                                }}
                              >
                                <CardTypeIcon type={card.type} />
                              </Box>
                            )}
                            <CardOverlay>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" color="white" fontWeight="bold" noWrap>
                                  {card.title}
                                </Typography>
                              </Box>
                              <Chip
                                label={card.type}
                                size="small"
                                sx={{
                                  mt: 1,
                                  background: getCardTypeColor(card.type),
                                  color: 'white',
                                  fontWeight: 'medium',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  height: '22px',
                                  fontSize: '0.7rem',
                                  borderRadius: '6px'
                                }}
                              />
                            </CardOverlay>
                          </Box>

                          <StyledCardContent className="card-content">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                mb: 2,
                                lineHeight: 1.6,
                              }}
                            >
                              {card.description && card.description.length > 0
                                ? card.description[0].value
                                : 'No description available.'}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                <AccessTime sx={{ fontSize: 16 }} />
                                {new Date(card.createdAt).toLocaleDateString()}
                              </Typography>

                              {userData.isAdmin && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditCard(card)}
                                    sx={{
                                      color: 'primary.main',
                                      '&:hover': { transform: 'scale(1.1)' },
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteCard(card._id)}
                                    sx={{
                                      color: 'error.main',
                                      '&:hover': { transform: 'scale(1.1)' },
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </StyledCardContent>
                        </StyledCard>
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Typography variant="h6" color="text.secondary">
                        No cards found matching your criteria
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </AnimatePresence>
            </Grid>
          </motion.div>
        )} */}

        <Grid container spacing={3}>
    {filteredCards.map((card) => (
      <Grid item xs={12} sm={6} md={4} key={card._id}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <StyledCard>
            <CardImage>
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="card-image"
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: getCardTypeColor(card.type),
                  }}
                >
                  <CardTypeIcon type={card.type} />
                </Box>
              )}
              <CardOverlay className="card-overlay">
                <Typography variant="h6" color="white" gutterBottom>
                  {card.title}
                </Typography>
                <Chip
                  label={card.type}
                  size="small"
                  sx={{
                    alignSelf: 'flex-start',
                    background: getCardTypeColor(card.type),
                    color: 'white',
                    fontWeight: 'medium',
                    backdropFilter: 'blur(4px)',
                  }}
                />
              </CardOverlay>
              {userData.isAdmin && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    gap: 1,
                    zIndex: 2,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleEditCard(card)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCard(card._id)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </CardImage>
            <StyledCardContent className="card-content">
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {card.description?.[0]?.value || 'No description available.'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 'auto',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <AccessTime sx={{ fontSize: 16 }} />
                  {new Date(card.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </motion.div>
      </Grid>
    ))}
  </Grid>

        {/* Update the Dialog content */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {isEditMode ? 'Edit Card' : 'Create New Card'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={cardForm.title}
                  onChange={handleInputChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Title sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={cardForm.description[0].value}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={cardForm.type}
                    onChange={handleInputChange}
                    error={!!formErrors.type}
                    startAdornment={
                      <InputAdornment position="start">
                        <Category sx={{ color: 'primary.main', mr: 1 }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="News">News</MenuItem>
                    <MenuItem value="Leadership">Leadership</MenuItem>
                    <MenuItem value="HR Policies">HR Policies</MenuItem>
                    <MenuItem value="Insurance Policies">Insurance Policies</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {formErrors.type && (
                    <FormHelperText error>{formErrors.type}</FormHelperText>
                  )}
                </FormControl>

                <Box sx={{ mb: 3 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                    name="image"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Image />}
                      sx={{ borderRadius: 2 }}
                    >
                      Upload Image
                    </Button>
                  </label>
                  {previewImage && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          width: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <IconButton
                        onClick={() => {
                          setPreviewImage('');
                          setCardForm(prev => ({ ...prev, image: null }));
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.7)'
                          }
                        }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              startIcon={<Close />}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={handleSubmit}
              loading={submitting}
              variant="contained"
              startIcon={<Save />}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                }
              }}
            >
              Create Card
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* Card actions menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2,
              minWidth: 180
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Edit sx={{ mr: 1 }} /> Edit Card
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteCard(selectedCard?._id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} /> Delete Card
          </MenuItem>
        </Menu>

        {/* Floating action button */}
        <FloatingButton
          onClick={handleOpenDialog}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
            }
          }}
        >
          <Add sx={{ fontSize: 32 }} />
        </FloatingButton>

        {/* Scroll to top button */}
        <Zoom in={showScrollTop}>
          <Box
            onClick={scrollToTop}
            role="presentation"
            sx={{
              position: 'fixed',
              bottom: 30,
              right: 110,
              zIndex: 2,
              cursor: 'pointer'
            }}
          >
            <Tooltip title="Scroll to top">
              <IconButton
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: 'background.paper'
                  }
                }}
              >
                <ArrowUpward />
              </IconButton>
            </Tooltip>
          </Box>
        </Zoom>
      </Container>
    </Box>
  );
};

export default CardsPage;