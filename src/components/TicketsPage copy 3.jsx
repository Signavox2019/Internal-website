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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Forward as ForwardIcon,
  Update as UpdateIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const MetricCard = styled(motion.div)(({ theme, color }) => ({
  height: '100%',
  width: '350px',
  maxWidth: '500px',
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
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [supportEmployees, setSupportEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStatusTicket, setSelectedStatusTicket] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);

  const token = localStorage.getItem('token');
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const isAdmin = userData?.isAdmin || false;

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

  const fetchMyTicketStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData._id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User data not found. Please login again.',
        });
        return;
      }

      const response = await axios.get(`${BaseUrl}/tickets/my-ticket-stats/${userData._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setStats({
        total: response.data.total,
        open: response.data.open,
        resolved: response.data.resolved,
        breached: response.data.breached
      });
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load ticket statistics',
      });
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.isAdmin || userData?.role === 'Support') {
      fetchAllTickets();
      fetchStats();
    } else {
      fetchMyTickets();
      fetchMyTicketStats();
    }
  }, []);

  const fetchAllTickets = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load tickets',
      });
      setLoading(false);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData._id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User data not found. Please login again.',
        });
        return;
      }

      const response = await axios.get(`${BaseUrl}/tickets/my-tickets/${userData._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setTickets(response.data.tickets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load tickets',
      });
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load statistics',
      });
    }
  };

  const fetchSupportEmployees = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/employees/support`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSupportEmployees(response.data);
    } catch (error) {
      console.error('Error fetching support employees:', error);
      toast.error('Failed to load support employees');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData._id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User data not found. Please login again.',
      });
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('createdBy', userData._id);
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      const response = await axios.post(`${BaseUrl}/tickets`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Ticket ${response.data.ticketNumber} created successfully!`,
        });
        handleCloseDialog();
        if (userData?.isAdmin) {
          fetchAllTickets();
          fetchStats();
        } else {
          fetchMyTickets();
          fetchMyTicketStats();
        }
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to create ticket',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ title: '', description: '', image: null });
    setSelectedImage(null);
    setImagePreview(null);
    // toast.info('Dialog closed');
  };

  const validateToken = () => {
    const currentToken = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));

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

  const handleEditClick = async (ticketId) => {
    try {
      const response = await axios.get(`${BaseUrl}/tickets/${ticketId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSelectedTicket(response.data);

      // Set initial form data
      setEditFormData({
        title: response.data.title,
        description: response.data.description,
        image: response.data.image // Store the image filename
      });

      // Set image preview if ticket has an image
      if (response.data.image) {
        // Construct the full image URL
        const imageUrl = `${BaseUrl}/uploads/${response.data.image}`;
        console.log('Setting image preview URL:', imageUrl); // Debug log
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }

      setEditDialogOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load ticket details',
      });
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update form data with the new file
      setEditFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview URL for new image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData({
      title: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setSelectedTicket(null);
  };

  const handleForwardClick = async (ticketId) => {
    await fetchSupportEmployees();
    setSelectedTicket(ticketId);
    setForwardDialogOpen(true);
    // toast.info('Forward dialog opened');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', editFormData.title);
    formDataToSend.append('description', editFormData.description);

    // Handle image upload
    if (editFormData.image instanceof File) {
      // If it's a new file, append it
      formDataToSend.append('image', editFormData.image);
    } else if (editFormData.image && typeof editFormData.image === 'string') {
      // If it's the existing image filename, append it
      formDataToSend.append('existingImage', editFormData.image);
    }

    try {
      const response = await axios.put(`${BaseUrl}/tickets/${selectedTicket._id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Ticket updated successfully!',
      });
      handleCloseEditDialog();
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.isAdmin) {
        fetchAllTickets();
        fetchStats();
      } else {
        fetchMyTickets();
        fetchMyTicketStats();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update ticket',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (ticketId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${BaseUrl}/tickets/${ticketId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Ticket has been deleted.',
        });
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData?.isAdmin) {
          fetchAllTickets();
          fetchStats();
        } else {
          fetchMyTickets();
          fetchMyTicketStats();
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete ticket',
        });
      }
    }
  };

  const handleForwardSubmit = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    try {
      const response = await axios.post(
        `${BaseUrl}/tickets/forward/${selectedTicket}`,
        { forwardedTo: selectedEmployee },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      toast.success('Ticket forwarded successfully!');
      setForwardDialogOpen(false);
      setSelectedEmployee('');
      fetchTickets();
    } catch (error) {
      console.error('Error forwarding ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to forward ticket');
    }
  };

  const handleStatusClick = async (ticket) => {
    try {
      setSelectedStatusTicket(ticket);
      setSelectedStatus(ticket.status);
      setStatusDialogOpen(true);
    } catch (error) {
      console.error('Error opening status dialog:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to open status update dialog',
      });
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !selectedStatusTicket) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a status',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${BaseUrl}/tickets/${selectedStatusTicket._id}/status`,
        { status: selectedStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "Ticket status updated successfully") {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Ticket status updated successfully!',
        });
        setStatusDialogOpen(false);
        setSelectedStatus('');
        setSelectedStatusTicket(null);

        // Update the tickets list based on user role
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData?.isAdmin || userData?.role === 'Support') {
          fetchAllTickets();
          fetchStats();
        } else {
          fetchMyTickets();
          fetchMyTicketStats();
        }
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update ticket status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = async (ticketId) => {
    try {
      const response = await axios.get(`${BaseUrl}/tickets/${ticketId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSelectedTicketDetails(response.data);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load ticket details',
      });
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedTicketDetails(null);
  };

  const filteredTickets = tickets.filter(ticket =>
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
          <Grid item xs={12} sm={6} md={3} key={index} >
            <MetricCard
              color={metric.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
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
              {(userData?.isAdmin || userData?.role === 'Support') && <TableCell>Created By</TableCell>}
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={userData?.isAdmin ? 7 : 6} align="center">
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
                {(userData?.isAdmin || userData?.role === 'Support') && (
                  <TableCell>
                    {ticket.createdBy?.name || 'N/A'}
                  </TableCell>
                )}
                <TableCell>{ticket.assignedTo?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status || 'Open'}
                    color={
                      ticket.status === 'Open' ? 'primary' :
                        ticket.status === 'Resolved' ? 'success' :
                          'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {userData?.isAdmin ? (
                      <Tooltip title="Forward Ticket">
                        <IconButton
                          onClick={() => handleForwardClick(ticket._id)}
                          size="small"
                          color="primary"
                        >
                          <ForwardIcon />
                        </IconButton>
                      </Tooltip>
                    ) : userData?.role === 'Support' ? (
                      <>
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewClick(ticket._id)}
                            size="small"
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update Status">
                          <IconButton
                            onClick={() => handleStatusClick(ticket)}
                            size="small"
                            color="primary"
                          >
                            <UpdateIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditClick(ticket._id)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(ticket._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
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
            <Box
              component="label"
              sx={{
                mb: 3,
                width: '100%',
                height: '200px',
                borderRadius: '12px',
                border: '2px dashed',
                borderColor: 'primary.main',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }
              }}
            >
              {imagePreview ? (
                <>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.7,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      zIndex: 1,
                    }}
                  >
                    <UploadIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Change Image
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Click to select a different image
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                    Upload Image
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                    Click to select an image
                  </Typography>
                </>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>
            {selectedImage && (
              <Box sx={{ mb: 3, width: '100%', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected file: {selectedImage.name}
                </Typography>
              </Box>
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

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Edit Ticket</Typography>
            <IconButton onClick={handleCloseEditDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              required
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />
            <Box
              component="label"
              sx={{
                mb: 3,
                width: '100%',
                height: '200px',
                borderRadius: '12px',
                border: '2px dashed',
                borderColor: 'primary.main',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }
              }}
            >
              {imagePreview ? (
                <>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.7,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      zIndex: 1,
                    }}
                  >
                    <UploadIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Change Image
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Click to select a different image
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                    Upload Image
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                    Click to select an image
                  </Typography>
                </>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleEditImageChange}
              />
            </Box>
            {editFormData.image && (
              <Box sx={{ mb: 3, width: '100%', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected file: {editFormData.image.name}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={forwardDialogOpen}
        onClose={() => setForwardDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Forward Ticket</Typography>
            <IconButton onClick={() => setForwardDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Support Employee</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Select Support Employee"
            >
              {supportEmployees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name} ({employee.employeeId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setForwardDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleForwardSubmit}
            variant="contained"
            disabled={!selectedEmployee || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Forward Ticket'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Update Ticket Status</Typography>
            <IconButton onClick={() => setStatusDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              {/* <MenuItem value="Breached">Breached</MenuItem> */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setStatusDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={!selectedStatus || isLoading}
            color="primary"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
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
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold">Ticket Details</Typography>
            <IconButton onClick={handleCloseViewDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTicketDetails && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {selectedTicketDetails.title}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedTicketDetails.description}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ticket Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedTicketDetails.ticketNumber}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={selectedTicketDetails.status}
                    color={
                      selectedTicketDetails.status === 'Open' ? 'primary' :
                      selectedTicketDetails.status === 'Resolved' ? 'success' :
                      'error'
                    }
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Created By
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {selectedTicketDetails.createdBy.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedTicketDetails.createdBy.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedTicketDetails.createdBy.employeeId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Assigned To
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {selectedTicketDetails.assignedTo.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedTicketDetails.assignedTo.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedTicketDetails.assignedTo.employeeId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedTicketDetails.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                {selectedTicketDetails.resolvedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Resolved At
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedTicketDetails.resolvedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}

                {selectedTicketDetails.image && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Attached Image
                    </Typography>
                    <Box
                      component="img"
                      src={`${BaseUrl}/uploads/${selectedTicketDetails.image}`}
                      alt="Ticket attachment"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  </Grid>
                )} */}
                <Grid className='flex  gap-8'  >
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {selectedTicketDetails.title}
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedTicketDetails.description}
                      </Typography>
                    </Paper>
                  </Grid>

                  {selectedTicketDetails.image && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Attached Image
                      </Typography>
                      <Box
                        component="img"
                        src={`${BaseUrl}/uploads/${selectedTicketDetails.image}`}
                        alt="Ticket attachment"
                        sx={{
                          width: '100%',
                          maxHeight: 200,
                          objectFit: 'contain',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                    </Grid>
                  )}

                </Grid>

                <Grid className='flex  gap-15'  >
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ticket Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedTicketDetails.ticketNumber}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedTicketDetails.status}
                      color={
                        selectedTicketDetails.status === 'Open' ? 'primary' :
                          selectedTicketDetails.status === 'Resolved' ? 'success' :
                            'error'
                      }
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Created By
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {selectedTicketDetails.createdBy.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedTicketDetails.createdBy.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedTicketDetails.createdBy.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Grid className='flex  gap-15'  >
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Assigned To
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {selectedTicketDetails.assignedTo.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedTicketDetails.assignedTo.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedTicketDetails.assignedTo.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Created At
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedTicketDetails.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>

                  {selectedTicketDetails.resolvedAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Resolved At
                      </Typography>
                      <Typography variant="body2">
                        {new Date(selectedTicketDetails.resolvedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseViewDialog}
            variant="outlined"
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketsPage;