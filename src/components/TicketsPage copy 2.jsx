import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  InputAdornment,
  alpha,
  CircularProgress,
  Tooltip,
  Avatar,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add,
  Close,
  Search,
  ErrorOutline,
  CheckCircleOutline,
  AccessTime,
  Timeline,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';

const MetricCard = styled(motion.div)(({ theme, color }) => ({
  height: '100%',
  width: '100%',
  minHeight: '200px',
  borderRadius: '20px',
  background: `linear-gradient(165deg, 
    ${alpha(color, 0.12)} 0%, 
    ${alpha(color, 0.05)} 40%,
    rgba(255, 255, 255, 0.05) 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(color, 0.15)}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(color, 0.2)}`,
    '& .metric-background': {
      transform: 'scale(1.2) rotate(10deg)',
      opacity: 0.15,
    },
    '& .metric-icon': {
      transform: 'scale(1.1)',
      background: `linear-gradient(135deg, ${alpha(color, 0.4)} 0%, ${alpha(color, 0.2)} 100%)`,
    }
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '24px',
  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
  '& .MuiTableCell-head': {
    fontWeight: 600,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderBottom: '2px solid rgba(59, 130, 246, 0.1)',
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.02)',
    },
  },
}));

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, breached: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const metricConfigs = [
    {
      title: 'Total Tickets',
      value: stats.total,
      color: '#3b82f6',
      icon: <Timeline />,
      description: 'All tickets in system'
    },
    {
      title: 'Open Tickets',
      value: stats.open,
      color: '#0ea5e9',
      icon: <AccessTime />,
      description: 'Awaiting resolution'
    },
    {
      title: 'Resolved Tickets',
      value: stats.resolved,
      color: '#22c55e',
      icon: <CheckCircleOutline />,
      description: 'Successfully completed'
    },
    {
      title: 'Breached SLA',
      value: stats.breached,
      color: '#ef4444',
      icon: <ErrorOutline />,
      description: 'Past due date'
    }
  ];

  useEffect(() => {
    console.log('API Base URL:', BaseUrl);
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/tickets/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get userData from localStorage and parse it
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);
    
    if (!userData || !userData._id) {
      toast.error('User data not found. Please login again.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('createdBy', userData._id); // Use the _id from userData
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    // Log the request data for debugging
    console.log('Request Data:', {
      title: formData.title,
      description: formData.description,
      createdBy: userData._id,
      hasImage: !!selectedImage
    });

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      console.log('Request Headers:', headers);

      const response = await axios.post(`${BaseUrl}/tickets`, formDataToSend, {
        headers: headers,
        validateStatus: function (status) {
          return status < 500;
        }
      });
      
      if (response.status === 201 || response.status === 200) {
        toast.success(`Ticket ${response.data.ticketNumber} created successfully!`);
        handleCloseDialog();
        await fetchTickets();
        await fetchStats();
      } else {
        throw new Error(response.data.message || 'Failed to create ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 413) {
        toast.error('Image file is too large. Please choose a smaller file.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create ticket. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ title: '', description: '', image: null });
    setSelectedImage(null);
  };

  const validateToken = () => {
    const currentToken = localStorage.getItem('token');
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    if (!currentToken) {
      toast.error('No authentication token found. Please login again.');
      return false;
    }

    if (!userData || !userData._id) {
      toast.error('User data not found. Please login again.');
      return false;
    }

    return true;
  };

  const handleCreateTicket = (e) => {
    if (!validateToken()) {
      return;
    }
    handleSubmit(e);
  };

  const filteredTickets = tickets.filter(ticket => 
    isAdmin ? true : ticket.createdBy._id === localStorage.getItem('userId')
  ).filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Support Tickets Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Track and manage support requests efficiently
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricConfigs.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard
              color={metric.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${alpha(metric.color, 0.2)} 0%, ${alpha(metric.color, 0.1)} 100%)`,
                  mb: 2
                }}>
                  {React.cloneElement(metric.icon, { sx: { fontSize: 28, color: metric.color } })}
                </Box>
                
                <Typography variant="h3" sx={{ fontWeight: 700, color: metric.color, mb: 1 }}>
                  {metric.value}
                </Typography>
                
                <Typography variant="h6" sx={{ color: alpha(metric.color, 0.9), fontWeight: 600, mb: 1 }}>
                  {metric.title}
                </Typography>
                
                <Typography variant="body2" sx={{ color: alpha(metric.color, 0.7) }}>
                  {metric.description}
                </Typography>
              </Box>
            </MetricCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 3
          }}
        >
          New Ticket
        </Button>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket Number</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.ticketNumber}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {ticket.image && (
                      <Avatar
                        src={`${BaseUrl}/uploads/${ticket.image}`}
                        variant="rounded"
                        sx={{ width: 32, height: 32 }}
                      />
                    )}
                    {ticket.title}
                  </Box>
                </TableCell>
                <TableCell>{ticket.createdBy.name}</TableCell>
                <TableCell>{ticket.assignedTo.name}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status}
                    color={
                      ticket.status === 'Open' ? 'primary' :
                      ticket.status === 'Resolved' ? 'success' :
                      'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold">Create New Ticket</Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateTicket} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={4}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ mb: 3, width: '100%', py: 1.5, borderRadius: '12px' }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </Button>
            {selectedImage && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected file: {selectedImage.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: '12px', textTransform: 'none' }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTicket}
            variant="contained"
            sx={{ borderRadius: '12px', textTransform: 'none' }}
            disabled={loading || !formData.title || !formData.description}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Ticket'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketsPage;