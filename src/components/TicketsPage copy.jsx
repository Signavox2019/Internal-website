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
  Chip,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  Zoom,
  TablePagination,
  CircularProgress,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add,
  Close,
  Search,
  Title as TitleIcon,
  Description as DescriptionIcon,
  ErrorOutline,
  CheckCircleOutline,
  WarningAmber,
  AccessTime,
  Refresh,
  ArrowUpward,
  Timeline,
  PriorityHigh,
  ConfirmationNumber,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const MetricCard = styled(motion.div)(({ theme, color }) => ({
  height: '100%',
  width: '500px', // Changed from fixed 500px to 100%
  maxWidth: '350px', // Changed from fixed 500px to 100%
  minHeight: '200px',
  borderRadius: '30px',
  background: `linear-gradient(165deg, 
    ${alpha(color, 0.15)} 0%, 
    ${alpha(color, 0.05)} 40%,
    ${alpha(color, 0.02)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(color, 0.2)}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    '& .metric-icon': {
      // transform: 'scale(1.2) rotate(10deg)',
    },
    '& .metric-background': {
      transform: 'scale(1.1)',
      opacity: 0.15,
    },
    '& .metric-glow': {
      opacity: 0.8,
    },
    '& .metric-shine': {
      transform: 'translateX(100%)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    padding: '1px',
    borderRadius: '30px',
    background: `linear-gradient(135deg, ${alpha(color, 0.4)} 0%, transparent 50%, ${alpha(color, 0.2)} 100%)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  }
}));

const MetricIconWrapper = styled(Box)(({ color }) => ({
  width: '70px',
  height: '70px',
  borderRadius: '24px',
  background: `linear-gradient(135deg, ${alpha(color, 0.3)} 0%, ${alpha(color, 0.1)} 100%)`,
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 2,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-2px',
    borderRadius: '26px',
    padding: '2px',
    background: `linear-gradient(135deg, ${alpha(color, 0.6)} 0%, transparent 100%)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  }
}));

// Add these new styled components
const MetricBackground = styled(Box)(({ color }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '150%',
  height: '150%',
  transform: 'translate(-50%, -50%)',
  background: `radial-gradient(circle at center, ${alpha(color, 0.2)} 0%, transparent 70%)`,
  opacity: 0.1,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 0,
}));

const MetricShine = styled(Box)({
  position: 'absolute',
  top: 0,
  left: '-100%',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1,
});

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

const StatusButton = styled(Button)(({ theme, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return theme.palette.primary.main;
      case 'Resolved': return theme.palette.success.main;
      case 'Breached': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  return {
    borderRadius: '12px',
    padding: '6px 16px',
    textTransform: 'none',
    backgroundColor: alpha(getStatusColor(status), 0.1),
    color: getStatusColor(status),
    border: `1px solid ${alpha(getStatusColor(status), 0.2)}`,
    '&:hover': {
      backgroundColor: alpha(getStatusColor(status), 0.2),
      border: `1px solid ${alpha(getStatusColor(status), 0.3)}`,
    },
  };
});


const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(2),
    '& .MuiTypography-root': {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
}));

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [ticketTrends, setTicketTrends] = useState({
    Open: 0,
    Resolved: 0,
    Breached: 0
  });

  const [ticketStats, setTicketStats] = useState({
    Open: 0,
    Resolved: 0,
    Breached: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BaseUrl}/tickets/ticket-stats/by-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setTicketStats(response.data.data);
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      }
    };

    fetchStats();
  }, []);

  const token = localStorage.getItem('token');

  // Metrics calculation
  const metrics = {
    total: tickets.length,
    open: tickets.filter(ticket => ticket.status === 'Open').length,
    breached: tickets.filter(ticket => ticket.status === 'Breached').length,
    resolved: tickets.filter(ticket => ticket.status === 'Resolved').length,
  };

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/tickets`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Ticket created successfully!');
      handleCloseDialog();
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ title: '', description: '' });
  };

  const getStatusChipProps = (status) => {
    const props = {
      Open: { color: 'primary', icon: <AccessTime /> },
      Breached: { color: 'error', icon: <ErrorOutline /> },
      Resolved: { color: 'success', icon: <CheckCircleOutline /> },
      Pending: { color: 'warning', icon: <WarningAmber /> },
    };
    return props[status] || props.Open;
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateTicketStatus = async (ticket, currentStatus) => {
    // Show confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: `${currentStatus === 'Open' ? 'Resolve' : 'Reopen'} Ticket?`,
      html: `Are you sure you want to ${currentStatus === 'Open' ? 'resolve' : 'reopen'} this ticket?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'Open' ? '#22c55e' : '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: currentStatus === 'Open' ? 'Yes, Resolve it!' : 'Yes, Reopen it!',
      cancelButtonText: 'Cancel',
      background: 'rgba(255, 255, 255, 0.9)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (result.isConfirmed) {
      try {
        const newStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';

        // Prepare update data with all required fields
        const updateData = {
          title: ticket.title,
          description: ticket.description,
          status: newStatus
        };

        console.log('Updating ticket with data:', updateData);

        const response = await axios.put(
          `${BaseUrl}/tickets/${ticket._id}`,
          updateData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data) {
          Swal.fire({
            title: 'Success!',
            text: `Ticket ${newStatus === 'Resolved' ? 'resolved' : 'reopened'} successfully`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchTickets();
        }
      } catch (error) {
        console.error('Error updating ticket status:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to update ticket status',
          icon: 'error'
        });
      }
    }
  };

  // Metrics with icons and descriptions
  const metricConfigs = [
    {
      title: 'Total Tickets',
      value: metrics.total,
      color: '#3b82f6',
      icon: <Timeline sx={{ fontSize: 32 }} />,
      description: 'All tickets in the system',
      trend: '+12% from last month'
    },
    {
      title: 'Open Tickets',
      value: metrics.open,
      color: '#0ea5e9',
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      description: 'Awaiting resolution',
      trend: 'Active cases'
    },
    {
      title: 'Breached SLA',
      value: metrics.breached,
      color: '#ef4444',
      icon: <PriorityHigh sx={{ fontSize: 32 }} />,
      description: 'Past due date',
      trend: 'Needs attention'
    },
    {
      title: 'Resolved',
      value: metrics.resolved,
      color: '#22c55e',
      icon: <CheckCircleOutline sx={{ fontSize: 32 }} />,
      description: 'Successfully completed',
      trend: '95% resolution rate'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header Section */}
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

              Support Tickets Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, maxWidth: '800px' }}>

              Track and manage support requests efficiently
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Enhanced Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Tickets Metric */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            color="#3b82f6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent>
              <MetricIconWrapper color="#3b82f6">
                <Timeline sx={{ fontSize: 32, color: '#3b82f6' }} />
              </MetricIconWrapper>
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                {metrics.total}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Total Tickets
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  All tickets in system
                </Typography>
              </Box>
            </CardContent>
            <MetricBackground color="#3b82f6" className="metric-background" />
            <MetricShine className="metric-shine" />
          </MetricCard>
        </Grid>

        {/* Open Tickets Metric */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            color="#0ea5e9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardContent>
              <MetricIconWrapper color="#0ea5e9">
                <AccessTime sx={{ fontSize: 32, color: '#0ea5e9' }} />
              </MetricIconWrapper>
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                {metrics.open}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Open Tickets
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Awaiting resolution
                </Typography>
              </Box>
            </CardContent>
            <MetricBackground color="#0ea5e9" className="metric-background" />
            <MetricShine className="metric-shine" />
          </MetricCard>
        </Grid>

        {/* Breached Tickets Metric */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            color="#ef4444"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardContent>
              <MetricIconWrapper color="#ef4444">
                <PriorityHigh sx={{ fontSize: 32, color: '#ef4444' }} />
              </MetricIconWrapper>
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                {metrics.breached}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Breached SLA
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Past due date
                </Typography>
              </Box>
            </CardContent>
            <MetricBackground color="#ef4444" className="metric-background" />
            <MetricShine className="metric-shine" />
          </MetricCard>
        </Grid>

        {/* Resolved Tickets Metric */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            color="#22c55e"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CardContent>
              <MetricIconWrapper color="#22c55e">
                <CheckCircleOutline sx={{ fontSize: 32, color: '#22c55e' }} />
              </MetricIconWrapper>
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                {metrics.resolved}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Resolved Tickets
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Successfully completed
                </Typography>
              </Box>
            </CardContent>
            <MetricBackground color="#22c55e" className="metric-background" />
            <MetricShine className="metric-shine" />
          </MetricCard>
        </Grid>
      </Grid>

      {/* Actions Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search tickets..."
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
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
          Raise Ticket
        </Button>
      </Box>

      {/* Enhanced Table Section */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Raised By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Resolved At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id} hover>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Tooltip
                    title={ticket.description}
                    TransitionComponent={Zoom}
                    placement="top-start"
                  >
                    <Typography
                      sx={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {ticket.description}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status}
                    size="small"
                    icon={getStatusChipProps(ticket.status).icon}
                    color={getStatusChipProps(ticket.status).color}
                    sx={{
                      fontWeight: 600,
                      borderRadius: '8px',
                      '& .MuiChip-icon': {
                        color: 'inherit'
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Employee ID: ${ticket.raisedBy.employeeId}`}
                    TransitionComponent={Zoom}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {ticket.raisedBy.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.raisedBy.email}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  <StatusButton
                    variant="outlined"
                    status={ticket.status}
                    onClick={() => handleUpdateTicketStatus(ticket, ticket.status)}
                    startIcon={ticket.status === 'Open' ? <CheckCircleOutline /> : <Refresh />}
                  >
                    {ticket.status === 'Open' ? 'Mark Resolved' : 'Reopen'}
                  </StatusButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Create Ticket Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
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
        <DialogTitle sx={{
          pb: 2,
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

            {/* <Add color="primary" /> */}
            <ConfirmationNumber
              sx={{
                fontSize: 28,
                color: 'primary.main',
                opacity: 0.8
              }}
            />
            <Typography>Raise New Ticket</Typography>
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
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
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
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
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
            Submit Ticket
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default TicketsPage;



