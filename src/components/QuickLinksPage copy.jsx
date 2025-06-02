import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Zoom,
  InputAdornment,
  Pagination,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add,
  Edit,
  Delete,
  Link as LinkIcon,
  Close,
  Search,
  Title as TitleIcon,
  Description as DescriptionIcon,
  OpenInNew,
} from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '220px', // Fixed height
  width: '280px', // Fixed width
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    '& .card-overlay': {
      opacity: 1,
    }
  },
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 10,
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  padding: theme.spacing(0.5),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
    justifyContent: 'flex-end',
  },
  '& .MuiDialogContent-root': {
    padding: '24px',
  },
  '& .MuiDialogActions-root': {
    padding: '16px',
  },
  '& .MuiDialogTitle-root': {
    padding: '16px',
  },
  '& .MuiDialogTitle-root .MuiTypography-root': {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#333',
  },
  '&.MuiDialogContent-root.MuiDialogContent-root': {
    padding: '24px',
  },
  '&.MuiDialogActions-root.MuiDialogActions-root': {
    padding: '16px',
  },
}))

const QuickLinksPage = () => {
  const [links, setLinks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    link: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const displayedLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // Fetch quick links
  const fetchQuickLinks = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/quick-links`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching quick links:', error);
      toast.error('Failed to load quick links');
    }
  };

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const handleOpenDialog = (link = null) => {
    if (link) {
      setIsEditMode(true);
      setSelectedLink(link);
      setFormData({
        title: link.title,
        content: link.content,
        link: link.link,
      });
    } else {
      setIsEditMode(false);
      setSelectedLink(null);
      setFormData({
        title: '',
        content: '',
        link: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: '',
      content: '',
      link: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${BaseUrl}/quick-links/${selectedLink._id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Fetch updated link data
        const response = await axios.get(`${BaseUrl}/quick-links/${selectedLink._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLinks(prev => prev.map(link =>
          link._id === selectedLink._id ? response.data : link
        ));
        toast.success('Quick link updated successfully!');
      } else {
        await axios.post(`${BaseUrl}/quick-links`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Quick link created successfully!');
      }
      handleCloseDialog();
      fetchQuickLinks();
    } catch (error) {
      console.error('Error saving quick link:', error);
      toast.error(error.response?.data?.message || 'Failed to save quick link');
    }
  };

  const handleDelete = (linkId) => {
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
          await axios.delete(`${BaseUrl}/quick-links/${linkId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          fetchQuickLinks();
          toast.success('Quick link deleted successfully!');
        } catch (error) {
          console.error('Error deleting quick link:', error);
          toast.error('Failed to delete quick link');
        }
      }
    });
  };

  const handleCardClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(240,249,255,0.5) 100%)',
        // minHeight: '100vh',
        // display: 'flex',
        // flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          mb: 6,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Quick Links
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Access your frequently used resources in one place
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '12px 24px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
            }
          }}
        >
          Add Quick Link
        </Button>
      </Box>

      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', mb: 4 }}>
          {/* Search Bar */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search quick links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }
              }}
            />
          </Box>

          {/* Grid Container */}
          {/* // In the Grid container section, update the Grid item */}
          <Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>
            {displayedLinks.map((link) => (
              <Grid item key={link._id} sx={{ width: '280px' }}>
                <StyledCard>
                  <CardContent sx={{ 
                    p: 2, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 1,
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      {link.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 'auto',
                        height: '60px',
                        fontSize: '0.875rem',
                        lineHeight: '1.43'
                      }}
                    >
                      {link.content}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                        pt: 1,
                        borderTop: '1px solid rgba(0,0,0,0.08)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LinkIcon 
                        fontSize="small" 
                        color="primary" 
                        sx={{ fontSize: '1rem' }}
                      />
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.75rem'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(link.link);
                        }}
                      >
                        {link.link}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardOverlay className="card-overlay">
                    <Tooltip title="Edit" TransitionComponent={Zoom}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(link);
                        }}
                        sx={{
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" TransitionComponent={Zoom}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(link._id);
                        }}
                        sx={{
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardOverlay>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* Pagination - Moved to bottom */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 'auto',
            pt: 4,
            borderTop: '1px solid rgba(0,0,0,0.08)'
          }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </Box>
        </Box>

        {/* Enhanced Dialog */}
        <StyledDialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {isEditMode ? <Edit color="primary" /> : <Add color="primary" />}
            <Typography variant="h5" component="span">
              {isEditMode ? 'Edit Quick Link' : 'Add New Quick Link'}
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'text.secondary'
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Content"
                name="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Link URL"
                name="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <OpenInNew color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                }
              }}
            >
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </StyledDialog>
      </Box>
    </Container>
  );
};

export default QuickLinksPage;

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  position: 'relative',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
}));