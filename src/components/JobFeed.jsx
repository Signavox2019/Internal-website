import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
    Avatar,
    Divider,
    CircularProgress,
    Tooltip,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputAdornment,
    Link,
    Alert,
    Fab,
    Stack,
    Autocomplete,
    FormHelperText,
    Slide,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Business,
    Email,
    Phone,
    Person,
    Language,
    LocationOn,
    Assignment,
    CalendarToday,
    Group,
    CheckCircle,
    Info,
    Close,
    Search,
    ExpandMore,
    OpenInNew,
    ThumbUp,
    ThumbDown,
    AccessTime,
    Add as AddIcon,
    Edit,
    Add,
    Delete,
    Title,
    Description,
    Code,
    Save,
    Send,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import BaseUrl from '../Api';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './LoadingScreen';

// Add new styled components for loading animations
const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingOverlayStyled = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
}));

const LoadingSpinnerStyled = styled(Box)(({ theme }) => ({
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: theme.palette.primary.main,
    animation: `${rotateAnimation} 1s linear infinite`,
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '5px',
        left: '5px',
        right: '5px',
        bottom: '5px',
        borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: theme.palette.secondary.main,
        animation: `${rotateAnimation} 1.5s linear infinite reverse`,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '15px',
        left: '15px',
        right: '15px',
        bottom: '15px',
        borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: theme.palette.primary.dark,
        animation: `${rotateAnimation} 1.75s linear infinite`,
    },
}));

const LoadingCardStyled = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '16px',
    padding: theme.spacing(2),
    animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
    width: '100%',
    height: '120px',
    marginBottom: theme.spacing(2),
}));

const GlowingBorderStyled = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: '24px',
    padding: '1px',
    background: 'linear-gradient(45deg, #311188, #0A081E, #311188)',
    backgroundSize: '200% 200%',
    animation: 'gradient 15s ease infinite',
    '@keyframes gradient': {
        '0%': {
            backgroundPosition: '0% 50%',
        },
        '50%': {
            backgroundPosition: '100% 50%',
        },
        '100%': {
            backgroundPosition: '0% 50%',
        },
    },
}));

// Styled components
const StyledProjectCard = styled(Paper)(({ theme, selected }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    background: selected
        ? 'linear-gradient(135deg, rgba(49, 17, 136, 0.95), rgba(10, 8, 30, 0.95))'
        : 'rgba(255, 255, 255, 0.95)',
    color: selected ? 'white' : 'inherit',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: selected
        ? '0 10px 30px rgba(49, 17, 136, 0.2)'
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',

    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        '&::before': {
            opacity: 1,
        },
        '& .project-actions': {
            opacity: 1,
            transform: 'translateY(0)',
        }
    },

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '16px',
        padding: '2px',
        background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.4), rgba(10, 8, 30, 0.4))',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: 0,
        transition: 'opacity 0.4s ease-in-out',
    },

    '& .project-actions': {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        display: 'flex',
        gap: theme.spacing(1),
        opacity: selected ? 1 : 0,
        transform: 'translateY(-10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 2,

        '& .MuiIconButton-root': {
            background: selected
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            border: selected
                ? '1px solid rgba(255, 255, 255, 0.3)'
                : '1px solid rgba(49, 17, 136, 0.1)',

            '& .MuiSvgIcon-root': {
                color: selected ? 'white' : '#311188',
                transition: 'all 0.3s ease',
                fontSize: '1.2rem',
            },

            '&:hover': {
                background: selected
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 1)',
                transform: 'translateY(-2px)',
                boxShadow: selected
                    ? '0 8px 20px rgba(255, 255, 255, 0.2)'
                    : '0 8px 20px rgba(49, 17, 136, 0.2)',

                '& .MuiSvgIcon-root': {
                    transform: 'scale(1.1)',
                }
            },

            '&.delete-button:hover': {
                background: selected
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(239, 68, 68, 0.1)',
                '& .MuiSvgIcon-root': {
                    color: selected ? 'white' : '#ef4444',
                }
            }
        }
    },

    '& .project-status': {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(1),
        zIndex: 2,
    },

    '& .project-content': {
        position: 'relative',
        zIndex: 1,
    },

    '@keyframes shimmer': {
        '0%': {
            backgroundPosition: '-200% 0',
        },
        '100%': {
            backgroundPosition: '200% 0',
        },
    },

    '&.loading': {
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        pointerEvents: 'none',
    }
}));

const DetailCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    overflow: 'visible',
}));

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(2),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    borderRadius: '8px',
    fontWeight: 500,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '&.status-open': {
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: 'white',
    },
    '&.status-closed': {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
    },
}));

// Add new styled components
const ApplicationAccordion = styled(Accordion)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px !important',
    marginBottom: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    '&:before': {
        display: 'none',
    },
    '& .MuiAccordionSummary-root': {
        borderRadius: '16px',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
        },
    },
}));

const ApplicationStatus = styled(Chip)(({ theme, status }) => ({
    borderRadius: '8px',
    fontWeight: 500,
    ...(status === 'pending' && {
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white',
    }),
    ...(status === 'approved' && {
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: 'white',
    }),
    ...(status === 'rejected' && {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
    }),
}));

// Add new styled component for scrollable content
const ScrollableContent = styled(Box)(({ theme }) => ({
    overflowY: 'auto',
    height: '100%',
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(49, 17, 136, 0.3)',
        borderRadius: '3px',
        '&:hover': {
            background: 'rgba(49, 17, 136, 0.5)',
        },
    },
}));

// Add new styled components for the modal
const StyledModal = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        maxWidth: '800px',
        width: '100%',
    },
}));

const ModalHeader = styled(DialogTitle)(({ theme }) => ({
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    color: 'white',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .MuiTypography-root': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
    '& .MuiStepLabel-root .Mui-completed': {
        color: '#311188',
    },
    '& .MuiStepLabel-root .Mui-active': {
        color: '#311188',
    },
    '& .MuiStepConnector-line': {
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
}));

// Add these styled components at the top with other styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid rgba(49, 17, 136, 0.1)',

        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
            border: '1px solid rgba(49, 17, 136, 0.3)',
        },

        '&.Mui-focused': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
            border: '1px solid rgba(49, 17, 136, 0.5)',
            background: 'rgba(255, 255, 255, 0.95)',
        },

        '& fieldset': {
            borderWidth: 0,
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 500,
        '&.Mui-focused': {
            color: '#311188',
        },
    },
    '& .MuiInputAdornment-root': {
        '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
            color: '#311188',
        },
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease-in-out',
    border: '1px solid rgba(49, 17, 136, 0.1)',

    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
        border: '1px solid rgba(49, 17, 136, 0.3)',
    },

    '&.Mui-focused': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
        border: '1px solid rgba(49, 17, 136, 0.5)',
        background: 'rgba(255, 255, 255, 0.95)',
    },

    '& fieldset': {
        borderWidth: 0,
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: '#311188',
    fontWeight: 600,
    position: 'relative',
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(1),

    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #311188 0%, rgba(49, 17, 136, 0.1) 100%)',
        borderRadius: '2px',
    },

    '& .MuiSvgIcon-root': {
        fontSize: '1.8rem',
        background: 'linear-gradient(135deg, #311188, #0A081E)',
        borderRadius: '8px',
        padding: '4px',
        color: 'white',
    },
}));

const AnimatedGrid = styled(Grid)(({ theme }) => ({
    '@keyframes fadeInUp': {
        from: {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
    animation: 'fadeInUp 0.5s ease-out forwards',
}));

// Add this styled component near other styled components
const ApplicationCard = styled(Paper)(({ theme, status }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
    },
    ...(status === 'pending' && {
        borderLeft: '4px solid #f59e0b',
    }),
    ...(status === 'approved' && {
        borderLeft: '4px solid #22c55e',
    }),
    ...(status === 'rejected' && {
        borderLeft: '4px solid #ef4444',
    }),
}));

// Add this with other styled components
const DetailRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(49, 17, 136, 0.02)',
    },
    '& .label': {
        color: 'rgba(0, 0, 0, 0.6)',
        minWidth: '120px',
        fontWeight: 500,
        fontSize: '0.9rem',
    },
    '& .value': {
        flex: 1,
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 400,
        wordBreak: 'break-word',
    },
}));

// Add this helper function at the top of the file, after the imports
const formatDate = (dateString) => {
    try {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return format(date, 'MMM dd, yyyy');
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
};

// Add this after other styled components
const DEPARTMENT_OPTIONS = [
    'Software Development',
    'Quality Assurance',
    'IT Infrastructure and Operations',
    'IT Support',
    'Sales and Marketing',
    'Business Development',
    'Human Resources',
    'Finance',
    'Accounting',
    'Design',
    'Research and Development',
    'IT Security',
    'Others'
];

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientDialogOpen, setClientDialogOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
    const [actionReason, setActionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        department: '',
        requiredSkills: [],
        vacancy: 0,
        startDate: null,
        endDate: null,
        status: 'open',
        teamLead: null,
        teamSizeLimit: 0,
        client: {
            name: '',
            contactEmail: '',
            mobile: '',
            ceo: '',
            industry: '',
            location: '',
            website: '',
            address: '',
            gstNumber: '',
            registrationId: '',
        },
    });
    const [formErrors, setFormErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // First, add a new state for project details loading
    const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
    // Add these new state variables after other useState declarations
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        resumeOrPortfolio: ''
    });
    const [submittingApplication, setSubmittingApplication] = useState(false);
    // Add new state for employees list
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [currentProjectApplication, setCurrentProjectApplication] = useState(null);

    const token = localStorage.getItem('token');
    const isAdmin = JSON.parse(localStorage.getItem('userData'))?.isAdmin;

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BaseUrl}/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProjects(response.data);
            if (response.data.length > 0) {
                fetchProjectDetails(response.data[0]._id);
            }
        } catch (err) {
            setError('Failed to fetch projects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectDetails = async (projectId) => {
        try {
            setProjectDetailsLoading(true);
            const response = await axios.get(`${BaseUrl}/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedProject(response.data);
            
            // Reset current application when changing projects
            setCurrentProjectApplication(null);
            setHasApplied(false);
            
            // Fetch applications for the new project
            await fetchProjectApplications(projectId);
        } catch (err) {
            console.error('Error fetching project details:', err);
            toast.error('Failed to load project details');
        } finally {
            setProjectDetailsLoading(false);
        }
    };

    const fetchProjectApplications = async (projectId) => {
        try {
            if (!projectId) {
                console.warn('No project ID provided to fetchProjectApplications');
                setApplications([]);
                return;
            }

            setLoadingApplications(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await axios.get(
                isAdmin ? `${BaseUrl}/project-applications` : `${BaseUrl}/project-applications/my-applications`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            // Filter applications for the current project with null checks
            const projectApplications = response.data.filter(app => 
                app && app.project && app.project._id === projectId
            );
            setApplications(projectApplications);

            // For non-admin users, find their application for this project
            if (!isAdmin) {
                const userApplication = projectApplications.find(app => app && !app.droppedByAdmin);
                setCurrentProjectApplication(userApplication || null);
                setHasApplied(!!userApplication);
            }

            console.log('Fetched applications:', projectApplications);
        } catch (err) {
            console.error('Error fetching applications:', err);
            toast.error('Failed to load applications');
            setApplications([]);
            setCurrentProjectApplication(null);
            setHasApplied(false);
        } finally {
            setLoadingApplications(false);
        }
    };

    const handleViewApplication = async (applicationId) => {
        try {
            const response = await axios.get(`${BaseUrl}/project-applications/${applicationId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedApplication(response.data);
            setApplicationDialogOpen(true);
        } catch (err) {
            console.error('Error fetching application details:', err);
            toast.error('Failed to load application details');
        }
    };

    const handleApplicationAction = async (applicationId, action) => {
        if (!actionReason.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Reason Required',
                text: 'Please provide a reason for this action.',
            });
            return;
        }

        try {
            setActionLoading(true);
            const response = await axios.patch(
                `${BaseUrl}/project-applications/${action}/${applicationId}`,
                { reason: actionReason },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message,
            });

            setApplicationDialogOpen(false);
            setActionReason('');
            fetchProjectApplications(selectedProject._id);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to process application',
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Add this new function after handleApplicationAction
    const handleStatusChange = async (applicationId, newStatus) => {
        if (!actionReason.trim()) {
            toast.error('Please provide a reason for changing the status');
            return;
        }

        try {
            setActionLoading(true);
            const endpoint = newStatus === 'approve' ? 'approve' : 'reject';
            const response = await axios.patch(
                `${BaseUrl}/project-applications/${endpoint}/${applicationId}`,
                { reason: actionReason },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            toast.success(`Application ${newStatus === 'approve' ? 'approved' : 'rejected'} successfully`);
            setApplicationDialogOpen(false);
            setActionReason('');
            fetchProjectApplications(selectedProject._id);
        } catch (err) {
            console.error('Error changing application status:', err);
            toast.error(err.response?.data?.message || 'Failed to change application status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#311188',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                background: 'rgba(255, 255, 255, 0.9)',
                backdrop: 'rgba(0,0,0,0.4)',
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    content: 'custom-swal-content',
                }
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`${BaseUrl}/projects/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.message) {
                    // Remove the project from state
                    setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));

                    // If the deleted project was selected, clear the selection
                    if (selectedProject?._id === projectId) {
                        setSelectedProject(null);
                    }

                    // Show success notification
                    toast.success('🗑️ Project deleted successfully!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        style: {
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                        }
                    });

                    // Show success animation
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The project has been deleted.',
                        timer: 1500,
                        showConfirmButton: false,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdrop: 'rgba(0,0,0,0.4)',
                        customClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error deleting project:', error);

            // Show error notification
            toast.error('❌ Failed to delete project', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 0, 0, 0.1)',
                    borderRadius: '12px',
                }
            });

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to delete project',
                background: 'rgba(255, 255, 255, 0.9)',
                backdrop: 'rgba(0,0,0,0.4)',
            });
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update the validateForm function to include team lead validation
    const validateForm = (step) => {
        const errors = {};
        switch (step) {
            case 0: // Project Details
                if (!projectForm.title) errors.title = 'Title is required';
                if (!projectForm.description) errors.description = 'Description is required';
                if (!projectForm.department) errors.department = 'Department is required';
                if (!projectForm.requiredSkills.length) errors.requiredSkills = 'At least one skill is required';
                break;
            case 1: // Team Details
                if (!projectForm.teamSizeLimit) errors.teamSizeLimit = 'Team size limit is required';
                if (!projectForm.teamLead?._id) errors.teamLead = 'Team lead is required';
                if (!projectForm.startDate) errors.startDate = 'Start date is required';
                if (!projectForm.endDate) errors.endDate = 'End date is required';
                if (projectForm.startDate && projectForm.endDate && projectForm.startDate > projectForm.endDate) {
                    errors.endDate = 'End date must be after start date';
                }
                break;
            case 2: // Client Details
                if (!projectForm.client.name) errors['client.name'] = 'Client name is required';
                if (!projectForm.client.contactEmail) errors['client.contactEmail'] = 'Email is required';
                if (!projectForm.client.mobile) errors['client.mobile'] = 'Mobile is required';
                // Validate email format
                if (projectForm.client.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(projectForm.client.contactEmail)) {
                    errors['client.contactEmail'] = 'Invalid email format';
                }
                // Validate mobile format
                if (projectForm.client.mobile && !/^[+]?[\d\s-]{10,}$/.test(projectForm.client.mobile)) {
                    errors['client.mobile'] = 'Invalid mobile number format';
                }
                break;
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCloseDialog = () => {
        setProjectModalOpen(false);
        setIsEditMode(false);
        setSelectedProject(null);
        setProjectForm({
            title: '',
            description: '',
            department: '',
            requiredSkills: [],
            vacancy: 0,
            startDate: null,
            endDate: null,
            status: 'open',
            teamLead: null,
            teamSizeLimit: 0,
            client: {
                name: '',
                contactEmail: '',
                mobile: '',
                ceo: '',
                industry: '',
                location: '',
                website: '',
                address: '',
                gstNumber: '',
                registrationId: '',
            },
        });
        setFormErrors({});
        // setPreviewImage('');
        setActiveStep(0);
    };

    // Update the handleSubmit function to handle team lead data correctly
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(activeStep)) return;
        setSubmitting(true);

        try {
            // Format the data according to the API requirements
            const projectData = {
                title: projectForm.title?.trim(),
                description: projectForm.description?.trim(),
                department: projectForm.department?.trim(),
                requiredSkills: Array.isArray(projectForm.requiredSkills) ? projectForm.requiredSkills : [],
                startDate: projectForm.startDate ? projectForm.startDate.toISOString().split('T')[0] : null,
                endDate: projectForm.endDate ? projectForm.endDate.toISOString().split('T')[0] : null,
                status: "open",
                teamLead: projectForm.teamLead?._id,
                teamSizeLimit: parseInt(projectForm.teamSizeLimit) || 0,
                client: {
                    name: projectForm.client?.name?.trim() || '',
                    contactEmail: projectForm.client?.contactEmail?.trim() || '',
                    mobile: projectForm.client?.mobile?.trim() || '',
                    ceo: projectForm.client?.ceo?.trim() || '',
                    industry: projectForm.client?.industry?.trim() || '',
                    location: projectForm.client?.location?.trim() || '',
                    website: projectForm.client?.website?.trim() || '',
                    address: projectForm.client?.address?.trim() || '',
                    gstNumber: projectForm.client?.gstNumber?.trim() || '',
                    registrationId: projectForm.client?.registrationId?.trim() || ''
                }
            };

            // Debug logs
            console.log('Form Data:', {
                ...projectForm,
                teamLead: projectForm.teamLead ? {
                    _id: projectForm.teamLead._id,
                    name: projectForm.teamLead.name,
                    employeeId: projectForm.teamLead.employeeId
                } : null
            });
            console.log('Processed Project Data:', projectData);

            // Validate required fields
            const requiredFields = {
                title: projectData.title,
                description: projectData.description,
                department: projectData.department,
                teamLead: projectData.teamLead,
                startDate: projectData.startDate,
                endDate: projectData.endDate,
                'client.name': projectData.client.name,
                'client.contactEmail': projectData.client.contactEmail,
                'client.mobile': projectData.client.mobile
            };

            const missingFields = Object.entries(requiredFields)
                .filter(([_, value]) => !value)
                .map(([key]) => key);

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            console.log('Request Config:', {
                url: isEditMode ? `${BaseUrl}/projects/${selectedProject._id}` : `${BaseUrl}/projects`,
                method: isEditMode ? 'PUT' : 'POST',
                headers: config.headers,
                data: projectData
            });

            let response;
            try {
            if (isEditMode && selectedProject?._id) {
                response = await axios.put(
                    `${BaseUrl}/projects/${selectedProject._id}`,
                        projectData,
                        config
                    );
            } else {
                response = await axios.post(
                    `${BaseUrl}/projects`,
                        projectData,
                        config
                    );
                }

                console.log('Success Response:', response.data);

                toast.success(`Project ${isEditMode ? 'updated' : 'created'} successfully!`);
                handleCloseDialog();
                fetchProjects();
            } catch (axiosError) {
                console.error('API Error Response:', {
                    status: axiosError.response?.status,
                    statusText: axiosError.response?.statusText,
                    data: axiosError.response?.data,
                    message: axiosError.message
                });
                throw axiosError;
            }
        } catch (err) {
            console.error('Error saving project:', err);
            let errorMessage;

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            } else {
                errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} project`;
            }

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Add step handling functions
    const handleNext = () => {
        if (validateForm(activeStep)) {
            if (activeStep === 2) {
                handleSubmit();
            } else {
                setActiveStep((prev) => prev + 1);
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    // Add modal open handlers
    const handleOpenCreateModal = () => {
        setIsEditMode(false);
        setProjectForm({
            title: '',
            description: '',
            department: '',
            requiredSkills: [],
            startDate: null,
            endDate: null,
            status: 'open',
            teamLead: null,
            teamSizeLimit: 0,
            client: {
                name: '',
                contactEmail: '',
                mobile: '',
                ceo: '',
                industry: '',
                location: '',
                website: '',
                address: '',
                gstNumber: '',
                registrationId: '',
            },
        });
        setActiveStep(0);
        setProjectModalOpen(true);
        fetchEmployees(); // Fetch employees when opening modal
    };

    const handleOpenEditModal = (project) => {
        setIsEditMode(true);
        setProjectForm({
            ...project,
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            teamLead: project.teamLead || null,
            client: {
                name: project.client?.name || '',
                contactEmail: project.client?.contactEmail || '',
                mobile: project.client?.mobile || '',
                ceo: project.client?.ceo || '',
                industry: project.client?.industry || '',
                location: project.client?.location || '',
                website: project.client?.website || '',
                address: project.client?.address || '',
                gstNumber: project.client?.gstNumber || '',
                registrationId: project.client?.registrationId || ''
            }
        });
        setActiveStep(0);
        setProjectModalOpen(true);
        fetchEmployees(); // Fetch employees when opening modal
    };

    // Add this new function before the return statement
    const handleApplySubmit = async (e) => {
        e.preventDefault();
        if (!applicationForm.resumeOrPortfolio) {
            toast.error('Please provide your resume or portfolio link');
            return;
        }

        try {
            setSubmittingApplication(true);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const applicationData = {
                projectId: selectedProject._id,
                resumeOrPortfolio: applicationForm.resumeOrPortfolio.trim()
            };

            const applicationResponse = await axios.post(
                `${BaseUrl}/project-applications/apply`,
                applicationData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success('Application submitted successfully!');
            setApplyModalOpen(false);
            setApplicationForm({ resumeOrPortfolio: '' });
            
            // Refresh applications and update current application
            await fetchProjectApplications(selectedProject._id);
        } catch (err) {
            // console.error('Application submission error:', err);
            // let errorMessage = err.response?.data?.message || err.message || 'Failed to submit application';
            toast.warn(err.response?.data?.error || err.message || 'Failed to submit application');
        } finally {
            setSubmittingApplication(false);
        }
    };

    // Add fetchEmployees function after other functions
    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const response = await axios.get(`${BaseUrl}/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (err) {
            console.error('Error fetching employees:', err);
            toast.error('Failed to load employees list');
        } finally {
            setLoadingEmployees(false);
        }
    };

    const handleDeleteApplication = async (applicationId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#311188',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, withdraw it!',
                background: 'rgba(255, 255, 255, 0.9)',
                backdrop: 'rgba(0,0,0,0.4)',
            });

            if (result.isConfirmed) {
                const response = await axios.delete(
                    `${BaseUrl}/project-applications/my-applications/${applicationId}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                toast.success(response.data.message || 'Application withdrawn successfully');
                
                // Reset current application and refresh the list
                setCurrentProjectApplication(null);
                setHasApplied(false);
                await fetchProjectApplications(selectedProject?._id);
            }
        } catch (err) {
            console.error('Error withdrawing application:', err.response?.data?.error || err.message || 'Failed to withdraw application');
            toast.warn(err.response?.data?.error || err.message || 'Failed to withdraw application');
        }
    };

    // Add this function to check if user has applied
    const checkIfUserHasApplied = (projectId) => {
        return applications.some(app => app.project._id === projectId && !app.droppedByAdmin);
    };

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            px: 8,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            position: 'relative',
        }}>
            <ToastContainer />
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

            {/* Header Section */}
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
                        background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
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

                        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    Project Management
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, maxWidth: '800px' }}>
                                    Explore and manage ongoing projects, track progress, and view team assignments.
                                </Typography>
                            </Box>

                            {isAdmin && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={handleOpenCreateModal}
                                        startIcon={<AddIcon />}
                                        sx={{
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: 'white',
                                            px: 3,
                                            py: 1.5,
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.2)',
                                            }
                                        }}
                                    >
                                        Create New Project
                                    </Button>
                                </motion.div>
                            )}
                        </Box>
                    </Box>
                </motion.div>

                {/* Main Content */}
                <Box sx={{ display: 'flex', gap: 4, height: 'calc(100vh - 200px)' }}>
                    {/* Left Column */}
                    <GlowingBorderStyled sx={{ flex: 1, minWidth: '400px' }}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: 'none',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <CardContent sx={{
                                p: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{
                                        mb: 3,
                                        flexShrink: 0,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(4px)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                transform: 'translateY(-2px)',
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <ScrollableContent>
                                    <List sx={{ py: 0 }}>
                                        {loading ? (
                                            [...Array(5)].map((_, index) => (
                                                <LoadingCardStyled key={index} />
                                            ))
                                        ) : (
                                            filteredProjects.map((project) => (
                                                <motion.div
                                                    key={project._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <StyledProjectCard
                                                        selected={selectedProject?._id === project._id}
                                                        onClick={() => {
                                                            fetchProjectDetails(project._id);
                                                            fetchProjectApplications(project._id);
                                                        }}
                                                        sx={{
                                                            position: 'relative',
                                                            '&:hover .admin-actions': {
                                                                opacity: 1
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="h6" gutterBottom noWrap>
                                                            {project.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                mb: 'auto',
                                                                overflow: 'hidden',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                opacity: 0.8,
                                                            }}
                                                        >
                                                            {project.description}
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mt: 2,
                                                        }}>
                                                            <StyledChip
                                                                label={project.status.toUpperCase()}
                                                                className={`status-${project.status}`}
                                                                size="small"
                                                            />
                                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                                {formatDate(project.startDate)}
                                                            </Typography>
                                                        </Box>

                                                        {isAdmin && (
                                                            <Box
                                                                className="admin-actions"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 8,
                                                                    right: 8,
                                                                    display: 'flex',
                                                                    gap: 1,
                                                                    opacity: 0,
                                                                    transition: 'opacity 0.2s ease-in-out'
                                                                }}
                                                            >
                                                                <Tooltip title="Edit Project">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleOpenEditModal(project);
                                                                        }}
                                                                        className="edit-button"
                                                                        sx={{
                                                                            color: selectedProject?._id === project._id ? 'primary.main' : 'text.secondary',
                                                                            '&:hover': {
                                                                                color: 'primary.main',
                                                                                bgcolor: 'rgba(49, 17, 136, 0.1)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Edit fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete Project">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteProject(project._id);
                                                                        }}
                                                                        className="delete-button"
                                                                        sx={{
                                                                            color: selectedProject?._id === project._id ? 'error.main' : 'text.secondary',
                                                                            '&:hover': {
                                                                                color: 'error.main',
                                                                                bgcolor: 'rgba(220, 38, 38, 0.1)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Delete fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    </StyledProjectCard>
                                                </motion.div>
                                            ))
                                        )}
                                    </List>
                                </ScrollableContent>
                            </CardContent>
                        </Card>
                    </GlowingBorderStyled>

                    {/* Right Column */}
                    <GlowingBorderStyled sx={{ flex: 1.5 }}>
                        <Card sx={{ 
                            height: '100%',
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: 'none',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <CardContent sx={{ 
                                p: 3, 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}>
                                {selectedProject ? (
                                    projectDetailsLoading ? (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            gap: 2
                                        }}>
                                            <CircularProgress size={40} sx={{ color: '#311188' }} />
                                            <Typography variant="body1" color="text.secondary">
                                                Loading project details...
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <ScrollableContent>
                                            {/* Project Details Section */}
                                            <Box sx={{ mb: 4 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                                    <Box>
                                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                                            {selectedProject.title}
                                                        </Typography>
                                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                            {selectedProject.description}
                                                        </Typography>
                                                    </Box>
                                                    {isAdmin ? (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Info />}
                                                            onClick={() => setClientDialogOpen(true)}
                                                        >
                                                            Client Info
                                                        </Button>
                                                    ) : (
                                                        currentProjectApplication ? (
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<Delete />}
                                                                onClick={() => handleDeleteApplication(currentProjectApplication._id)}
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                                    color: 'white',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                                                                    }
                                                                }}
                                                            >
                                                                Withdraw Application
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<Send />}
                                                                onClick={() => setApplyModalOpen(true)}
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                                                                    color: 'white',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
                                                                    }
                                                                }}
                                                            >
                                                                Apply Now
                                                            </Button>
                                                        )
                                                    )}
                                                </Box>

                                                <Grid container spacing={4}>
                                                    <Grid item xs={12} md={6}>
                                                        <InfoRow>
                                                            <Assignment color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2">Project ID</Typography>
                                                                <Typography>{selectedProject.projectId}</Typography>
                                                            </Box>
                                                        </InfoRow>

                                                        <InfoRow>
                                                            <Business color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2">Department</Typography>
                                                                <Typography>{selectedProject.department}</Typography>
                                                            </Box>
                                                        </InfoRow>

                                                        <InfoRow>
                                                            <CalendarToday color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2">Timeline</Typography>
                                                                <Typography>
                                                                    {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate)}
                                                                </Typography>
                                                            </Box>
                                                        </InfoRow>
                                                    </Grid>

                                                    <Grid item xs={12} md={6}>
                                                        <InfoRow>
                                                            <Group color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2">Team Size</Typography>
                                                                <Typography>
                                                                    {selectedProject.assignedEmployees.length} / {selectedProject.teamSizeLimit}
                                                                </Typography>
                                                            </Box>
                                                        </InfoRow>

                                                        <InfoRow>
                                                            <Person color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2">Team Lead</Typography>
                                                                <Typography>
                                                                    {selectedProject.teamLead?.name || 'Not Assigned'}
                                                                </Typography>
                                                            </Box>
                                                        </InfoRow>

                                                        <InfoRow>
                                                            <CheckCircle color="primary" />
                                                            <Box>
                                                                <Typography variant="subtitle2">Status</Typography>
                                                                <StyledChip
                                                                    label={selectedProject.status.toUpperCase()}
                                                                    className={`status-${selectedProject.status}`}
                                                                    size="small"
                                                                />
                                                            </Box>
                                                        </InfoRow>
                                                    </Grid>
                                                </Grid>

                                                <Divider sx={{ my: 3 }} />

                                                <Typography variant="h6" gutterBottom>
                                                    Required Skills
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                    mb: 3,
                                                    '& .MuiChip-root': {
                                                        background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.1), rgba(10, 8, 30, 0.1))',
                                                        border: '1px solid rgba(49, 17, 136, 0.2)',
                                                        color: 'text.primary',
                                                        fontWeight: 500,
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.2), rgba(10, 8, 30, 0.2))',
                                                        }
                                                    }
                                                }}>
                                                    {selectedProject?.requiredSkills?.map((skill, index) => (
                                                        <React.Fragment key={index}>
                                                            <Chip
                                                                label={skill}
                                                                size="small"
                                                            />
                                                            {index < selectedProject.requiredSkills.length - 1 && (
                                                                <Typography
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        alignSelf: 'center',
                                                                        mx: 0.5,
                                                                        fontSize: '0.75rem'
                                                                    }}
                                                                >
                                                                •
                                                                </Typography>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </Box>

                                                <Typography variant="h6" gutterBottom>
                                                    Team Members
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {selectedProject.assignedEmployees.map((employee) => (
                                                        <Grid item key={employee._id}>
                                                            <Tooltip title={employee.name}>
                                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                                    {employee.name.charAt(0)}
                                                                </Avatar>
                                                            </Tooltip>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>

                                            {/* Applications Section */}
                                            <Divider sx={{ my: 4 }} />
                                            <Box>
                                                <Typography variant="h6" gutterBottom sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    color: '#311188',
                                                    fontWeight: 600
                                                }}>
                                                    <Assignment /> Project Applications
                                                    {applications.length > 0 && (
                                                        <Chip
                                                            label={applications.length}
                                                            size="small"
                                                            sx={{
                                                                background: 'rgba(49, 17, 136, 0.1)',
                                                                color: '#311188',
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                    )}
                                                </Typography>

                                                {loadingApplications ? (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        p: 3
                                                    }}>
                                                        <CircularProgress size={30} sx={{ color: '#311188' }} />
                                                    </Box>
                                                ) : applications.length > 0 ? (
                                                    <AnimatePresence>
                                                        {applications.map((application) => (
                                                            <motion.div
                                                                key={application._id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <ApplicationCard
                                                                    status={application.status}
                                                                    elevation={0}
                                                                >
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        mb: 2
                                                                    }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                            <Avatar
                                                                                alt={application.employee.name}
                                                                                sx={{
                                                                                    width: 50,
                                                                                    height: 50,
                                                                                    border: '2px solid rgba(49, 17, 136, 0.2)',
                                                                                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)'
                                                                                }}
                                                                            >
                                                                                {application.employee.name.charAt(0)}
                                                                            </Avatar>
                                                                            <Box>
                                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                                    {application.employee.name}
                                                                                </Typography>
                                                                                <Typography variant="body2" color="text.secondary">
                                                                                    Employee ID: {application.employee.employeeId}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                        <ApplicationStatus
                                                                            label={application.status.toUpperCase()}
                                                                            status={application.status}
                                                                            size="small"
                                                                        />
                                                                    </Box>

                                                                    <Box sx={{ mb: 2 }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Applied on: {formatDate(application.appliedAt)}
                                                                        </Typography>
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            onClick={() => window.open(application.resumeOrPortfolio, '_blank')}
                                                                            startIcon={<OpenInNew />}
                                                                            sx={{
                                                                                borderRadius: '8px',
                                                                                borderColor: 'rgba(49, 17, 136, 0.5)',
                                                                                color: '#311188',
                                                                                '&:hover': {
                                                                                    borderColor: '#311188',
                                                                                    background: 'rgba(49, 17, 136, 0.05)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            View Portfolio
                                                                        </Button>

                                                                        {!isAdmin && application.status === 'pending' && (
                                                                            <Button
                                                                                size="small"
                                                                                variant="contained"
                                                                                onClick={() => handleDeleteApplication(application._id)}
                                                                                startIcon={<Delete />}
                                                                                sx={{
                                                                                    borderRadius: '8px',
                                                                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                                                    color: 'white',
                                                                                    '&:hover': {
                                                                                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Withdraw Application
                                                                            </Button>
                                                                        )}

                                                                        {isAdmin && application.status === 'pending' && (
                                                                            <>
                                                                                <Button
                                                                                    size="small"
                                                                                    variant="contained"
                                                                                    onClick={() => {
                                                                                        setSelectedApplication(application);
                                                                                        setApplicationDialogOpen(true);
                                                                                    }}
                                                                                    startIcon={<ThumbUp />}
                                                                                    sx={{
                                                                                        borderRadius: '8px',
                                                                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                                                                        color: 'white',
                                                                                        '&:hover': {
                                                                                            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Approve
                                                                                </Button>

                                                                                <Button
                                                                                    size="small"
                                                                                    variant="contained"
                                                                                    onClick={() => {
                                                                                        setSelectedApplication(application);
                                                                                        setApplicationDialogOpen(true);
                                                                                    }}
                                                                                    startIcon={<ThumbDown />}
                                                                                    sx={{
                                                                                        borderRadius: '8px',
                                                                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                                                        color: 'white',
                                                                                        '&:hover': {
                                                                                            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Reject
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </Box>
                                                                </ApplicationCard>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                ) : (
                                                    <Box sx={{
                                                        p: 3,
                                                        textAlign: 'center',
                                                        bgcolor: 'rgba(255, 255, 255, 0.5)',
                                                        borderRadius: '16px',
                                                        border: '1px dashed rgba(0, 0, 0, 0.1)'
                                                    }}>
                                                        <Typography color="text.secondary">
                                                            {isAdmin ? 'No applications found for this project' : 'You haven\'t applied to this project yet'}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </ScrollableContent>
                                    )
                                ) : (
                                    <Box sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        gap: 2,
                                    }}>
                                        <Assignment sx={{ fontSize: 60, color: 'text.disabled' }} />
                                        <Typography color="text.secondary" variant="h6">
                                            Select a project to view details
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </GlowingBorderStyled>
                </Box>
            </Container>

            {/* Application Action Dialog */}
            <Dialog
                open={applicationDialogOpen}
                onClose={() => {
                    setApplicationDialogOpen(false);
                    setSelectedApplication(null);
                    setActionReason('');
                }}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    px: 3
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment />
                        <Typography variant="h6">Application Details</Typography>
                    </Box>
                    <IconButton
                        onClick={() => {
                            setApplicationDialogOpen(false);
                            setSelectedApplication(null);
                            setActionReason('');
                        }}
                        sx={{ color: 'white' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    {selectedApplication && (
                        <Box sx={{ mt: 2 }}>
                            {/* Project Information */}
                            <Typography variant="h6" gutterBottom sx={{ color: '#311188', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Business /> Project Information
                            </Typography>
                            <Box sx={{ mb: 3, pl: 2 }}>
                                <DetailRow>
                                    <Typography className="label">Project Title</Typography>
                                    <Typography className="value">{selectedApplication.project.title}</Typography>
                                </DetailRow>
                                <DetailRow>
                                    <Typography className="label">Department</Typography>
                                    <Typography className="value">{selectedApplication.project.department}</Typography>
                                </DetailRow>
                            </Box>

                            {/* Applicant Information */}
                            <Typography variant="h6" gutterBottom sx={{ color: '#311188', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person /> Applicant Information
                            </Typography>
                            <Box sx={{ mb: 3, pl: 2 }}>
                                <DetailRow>
                                    <Typography className="label">Name</Typography>
                                    <Typography className="value">{selectedApplication.employee.name}</Typography>
                                </DetailRow>
                                <DetailRow>
                                    <Typography className="label">Employee ID</Typography>
                                    <Typography className="value">{selectedApplication.employee.employeeId}</Typography>
                                </DetailRow>
                                <DetailRow>
                                    <Typography className="label">Email</Typography>
                                    <Typography className="value">{selectedApplication.employee.email}</Typography>
                                </DetailRow>
                            </Box>

                            {/* Application Status */}
                            <Typography variant="h6" gutterBottom sx={{ color: '#311188', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Info /> Application Status
                            </Typography>
                            <Box sx={{ mb: 3, pl: 2 }}>
                                <DetailRow>
                                    <Typography className="label">Status</Typography>
                                    <ApplicationStatus
                                        label={selectedApplication.status.toUpperCase()}
                                        status={selectedApplication.status}
                                    />
                                </DetailRow>
                                <DetailRow>
                                    <Typography className="label">Applied On</Typography>
                                    <Typography className="value">{formatDate(selectedApplication.appliedAt)}</Typography>
                                </DetailRow>
                                {selectedApplication.approvedAt && (
                                    <DetailRow>
                                        <Typography className="label">Approved On</Typography>
                                        <Typography className="value">{formatDate(selectedApplication.approvedAt)}</Typography>
                                    </DetailRow>
                                )}
                                {selectedApplication.rejectedReason && (
                                    <DetailRow>
                                        <Typography className="label">Rejection Reason</Typography>
                                        <Typography className="value" color="error">
                                            {selectedApplication.rejectedReason}
                                        </Typography>
                                    </DetailRow>
                                )}
                            </Box>

                            {/* Portfolio Link */}
                            {selectedApplication.resumeOrPortfolio && (
                                <>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#311188', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Description /> Portfolio
                                    </Typography>
                                    <Box sx={{ mb: 3, pl: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<OpenInNew />}
                                            href={selectedApplication.resumeOrPortfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                borderRadius: '8px',
                                                borderColor: 'rgba(49, 17, 136, 0.5)',
                                                color: '#311188',
                                                '&:hover': {
                                                    borderColor: '#311188',
                                                    background: 'rgba(49, 17, 136, 0.05)'
                                                }
                                            }}
                                        >
                                            View Portfolio/Resume
                                        </Button>
                                    </Box>
                                </>
                            )}

                            {/* Action Section for Admin */}
                            {isAdmin && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="h6" gutterBottom sx={{ color: '#311188' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Edit /> Change Application Status
                                        </Box>
                                    </Typography>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        {selectedApplication.status === 'pending' ?
                                            'Take action on this application' :
                                            'Change the current application status'}
                                    </Alert>
                    <TextField
                        fullWidth
                        multiline
                                        rows={3}
                                        label="Reason for Status Change"
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                                        placeholder={
                                            selectedApplication.status === 'approved' ?
                                                "Provide a reason for rejecting this application" :
                                                selectedApplication.status === 'rejected' ?
                                                    "Provide a reason for approving this application" :
                                                    "Provide a reason for your decision"
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        {selectedApplication.status !== 'approved' && (
                    <LoadingButton
                        variant="contained"
                        color="success"
                                                onClick={() => handleStatusChange(selectedApplication._id, 'approve')}
                                                loading={actionLoading}
                                                startIcon={<ThumbUp />}
                    >
                        Approve
                    </LoadingButton>
                                        )}
                                        {selectedApplication.status !== 'rejected' && (
                    <LoadingButton
                        variant="contained"
                        color="error"
                                                onClick={() => handleStatusChange(selectedApplication._id, 'reject')}
                                                loading={actionLoading}
                                                startIcon={<ThumbDown />}
                    >
                        Reject
                    </LoadingButton>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Client Information Dialog */}
            <Dialog
                open={clientDialogOpen}
                onClose={() => setClientDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
                        backdropFilter: 'blur(20px)',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6">Client Information</Typography>
                    <IconButton onClick={() => setClientDialogOpen(false)} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    {selectedProject?.client && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <InfoRow>
                                    <Business />
                                    <Box>
                                        <Typography variant="subtitle2">Company Name</Typography>
                                        <Typography>{selectedProject.client.name}</Typography>
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <Email />
                                    <Box>
                                        <Typography variant="subtitle2">Email</Typography>
                                        <Typography>{selectedProject.client.contactEmail}</Typography>
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <Phone />
                                    <Box>
                                        <Typography variant="subtitle2">Phone</Typography>
                                        <Typography>{selectedProject.client.mobile}</Typography>
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <Person />
                                    <Box>
                                        <Typography variant="subtitle2">CEO</Typography>
                                        <Typography>{selectedProject.client.ceo}</Typography>
                                    </Box>
                                </InfoRow>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <InfoRow>
                                    <Language />
                                    <Box>
                                        <Typography variant="subtitle2">Website</Typography>
                                        <Typography>{selectedProject.client.website}</Typography>
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <LocationOn />
                                    <Box>
                                        <Typography variant="subtitle2">Location</Typography>
                                        <Typography>{selectedProject.client.location}</Typography>
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <Assignment />
                                    <Box>
                                        <Typography variant="subtitle2">GST Number</Typography>
                                        <Typography>{selectedProject.client.gstNumber}</Typography>
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <Info />
                                    <Box>
                                        <Typography variant="subtitle2">Registration ID</Typography>
                                        <Typography>{selectedProject.client.registrationId}</Typography>
                                    </Box>
                                </InfoRow>
                            </Grid>

                            <Grid item xs={12}>
                                <InfoRow>
                                    <LocationOn />
                                    <Box>
                                        <Typography variant="subtitle2">Address</Typography>
                                        <Typography>{selectedProject.client.address}</Typography>
                                    </Box>
                                </InfoRow>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
            </Dialog>

            {/* Project Modal */}
            <Dialog
                open={projectModalOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        overflow: 'hidden',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                    color: 'white',
                    py: 3,
                    px: 4,
                    '& .MuiTypography-root': {
                        fontSize: '1.5rem',
                        fontWeight: 600,
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isEditMode ? <Edit /> : <Add />}
                            <Typography>
                                {isEditMode ? 'Edit Project' : 'Create New Project'}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
                    backdropFilter: 'blur(20px)',
                }}>
                    <Box component="form" noValidate>
                        <Grid container spacing={3} className='animate__animated animate__fadeIn mt-5'>
                            {/* Project Basic Details */}
                            <Grid item xs={12}>
                                <SectionTitle variant="h6" gutterBottom>
                                    <Assignment /> Project Details
                                </SectionTitle>

                                <StyledTextField
                                    fullWidth
                                    label="Project Title"
                                    name="title"
                                    value={projectForm.title}
                                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                    error={!!formErrors.title}
                                    helperText={formErrors.title}
                                    required
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Title />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <FormControl fullWidth sx={{ mb: 3 }} error={!!formErrors.department}>
                                    <InputLabel required>Department</InputLabel>
                                    <StyledSelect
                                    value={projectForm.department}
                                        label="Department"
                                    onChange={(e) => setProjectForm({ ...projectForm, department: e.target.value })}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Business sx={{ color: '#311188' }} />
                                            </InputAdornment>
                                        }
                                    >
                                        {DEPARTMENT_OPTIONS.map((dept) => (
                                            <MenuItem key={dept} value={dept}>
                                                {dept}
                                            </MenuItem>
                                        ))}
                                    </StyledSelect>
                                    {formErrors.department && (
                                        <FormHelperText>{formErrors.department}</FormHelperText>
                                    )}
                                </FormControl>

                                <StyledTextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    error={!!formErrors.description}
                                    helperText={formErrors.description}
                                    required
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Description />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* </Grid> */}

                                {/* Team Configuration */}
                                {/* <Grid item xs={12}> */}
                                <SectionTitle variant="h6" gutterBottom>
                                    <Group /> Team Configuration
                                </SectionTitle>

                                {/* <Grid container spacing={2}> */}
                                {/* <Grid item xs={12} md={6}> */}

                                <Autocomplete
                                    fullWidth
                                    sx={{ mb: 3 }}

                                    options={employees}
                                    loading={loadingEmployees}
                                    value={projectForm.teamLead}
                                    onChange={(e, newValue) => setProjectForm({ ...projectForm, teamLead: newValue })}
                                    getOptionLabel={(option) => option ? `${option.name} (${option.employeeId})` : ''}
                                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Team Lead"
                                            required
                                            error={!!formErrors.teamLead}
                                            helperText={formErrors.teamLead}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <Person sx={{ color: '#311188' }} />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} sx={{
                                            '&:hover': {
                                                background: 'rgba(49, 17, 136, 0.05)'
                                            }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                                                <Avatar
                                                    src={option.profileImage}
                                                    alt={option.name}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)'
                                                    }}
                                                >
                                                    {option.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1">{option.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {option.employeeId} • {option.role} • {option.team}
                                                        {option.isOnBench && (
                                                            <Chip
                                                                label="On Bench"
                                                                size="small"
                                                                sx={{
                                                                    ml: 1,
                                                                    background: 'rgba(49, 17, 136, 0.1)',
                                                                    color: '#311188',
                                                                    height: '20px'
                                                                }}
                                                            />
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                    noOptionsText={
                                        <Box sx={{ textAlign: 'center', py: 2 }}>
                                            <Typography color="text.secondary">No employees found</Typography>
                                        </Box>
                                    }
                                    loadingText={
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 2 }}>
                                            <CircularProgress size={20} sx={{ color: '#311188' }} />
                                            <Typography>Loading employees...</Typography>
                                        </Box>
                                    }
                                />

                                {/* Vacancy text field */}
                                {/* <StyledTextField
                                    sx={{ mb: 3 }}

                                    fullWidth
                                    type="number"
                                    label="Vacancy"
                                    name="vacancy"
                                    value={projectForm.vacancy}
                                    onChange={(e) => setProjectForm({ ...projectForm, vacancy: parseInt(e.target.value) })}
                                    error={!!formErrors.vacancy}
                                    helperText={formErrors.vacancy}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                /> */}
                                {/* </Grid> */}

                                {/* <Grid item xs={12} md={6}> */}
                                <StyledTextField
                                    sx={{ mb: 3 }}

                                    fullWidth
                                    type="number"
                                    label="Team Size Limit"
                                    name="teamSizeLimit"
                                    value={projectForm.teamSizeLimit}
                                    onChange={(e) => setProjectForm({ ...projectForm, teamSizeLimit: parseInt(e.target.value) })}
                                    error={!!formErrors.teamSizeLimit}
                                    helperText={formErrors.teamSizeLimit}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Group />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* </Grid> */}

                                {/* <Grid item xs={12}> */}

                                {/* </Grid> */}

                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Start Date"
                                        value={projectForm.startDate}
                                        onChange={(date) => setProjectForm({ ...projectForm, startDate: date })}
                                        renderInput={(params) => (
                                            <StyledTextField
                                                {...params}
                                                fullWidth
                                                error={!!formErrors.startDate}
                                                helperText={formErrors.startDate}
                                                    required
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                    {/* </Grid> */}

                                    {/* <Grid item xs={12} md={6}> */}
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="End Date"
                                        value={projectForm.endDate}
                                        onChange={(date) => setProjectForm({ ...projectForm, endDate: date })}
                                        renderInput={(params) => (
                                            <StyledTextField
                                                {...params}
                                                fullWidth
                                                error={!!formErrors.endDate}
                                                helperText={formErrors.endDate}
                                                    required
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                </Box>


                                {/* Required Skills */}
                                {/* <Grid item xs={12}> */}
                                <Autocomplete
                                    sx={{ mb: 3 }}
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={projectForm.requiredSkills}
                                    onChange={(e, newValue) => setProjectForm({ ...projectForm, requiredSkills: newValue })}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const { key, ...chipProps } = getTagProps({ index });
                                            return (
                                            <Chip
                                                    key={key}
                                                    {...chipProps}
                                                label={option}
                                                sx={{
                                                    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.1), rgba(10, 8, 30, 0.1))',
                                                    border: '1px solid rgba(49, 17, 136, 0.2)',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            );
                                        })
                                    }
                                    renderInput={(params) => (
                                        <StyledTextField
                                            {...params}
                                            label="Required Skills"
                                            error={!!formErrors.requiredSkills}
                                            helperText={formErrors.requiredSkills}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <Code />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                {/* </Grid> */}

                                {/* Client Information */}
                                {/* <Grid item xs={12}> */}
                                <SectionTitle variant="h6" gutterBottom>
                                    <Business /> Client Information
                                </SectionTitle>
                                <Grid container spacing={2}>
                                    {/* <Grid item xs={12} md={6}> */}
                                <StyledTextField
                                    fullWidth
                                        label="Company Name"
                                    name="client.name"
                                    value={projectForm.client.name}
                                    onChange={(e) => setProjectForm({
                                        ...projectForm,
                                        client: { ...projectForm.client, name: e.target.value }
                                    })}
                                    error={!!formErrors['client.name']}
                                    helperText={formErrors['client.name']}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Business />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

<StyledTextField
                                        fullWidth
                                        label="CEO"
                                        name="client.ceo"
                                        value={projectForm.client.ceo}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm,
                                            client: { ...projectForm.client, ceo: e.target.value }
                                        })}
                                        error={!!formErrors['client.ceo']}
                                        helperText={formErrors['client.ceo']}
                                        required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                    {/* </Grid> */}

                                    {/* <Grid item xs={12} md={6}> */}
                                <StyledTextField
                                    fullWidth
                                    label="Contact Email"
                                    name="client.contactEmail"
                                    value={projectForm.client.contactEmail}
                                    onChange={(e) => setProjectForm({
                                        ...projectForm,
                                        client: { ...projectForm.client, contactEmail: e.target.value }
                                    })}
                                    error={!!formErrors['client.contactEmail']}
                                    helperText={formErrors['client.contactEmail']}
                                        required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                    <StyledTextField
                                        fullWidth
                                        label="Location"
                                        name="client.location"
                                        value={projectForm.client.location}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm,
                                            client: { ...projectForm.client, location: e.target.value }
                                        })}
                                        error={!!formErrors['client.location']}
                                        helperText={formErrors['client.location']}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationOn />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <StyledTextField
                                        fullWidth
                                        label="GST Number"
                                        name="client.gstNumber"
                                        value={projectForm.client.gstNumber}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm,
                                            client: { ...projectForm.client, gstNumber: e.target.value }
                                        })}
                                        error={!!formErrors['client.gstNumber']}
                                        helperText={formErrors['client.gstNumber']}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Assignment />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <StyledTextField
                                        fullWidth
                                        label="Registration ID"
                                        name="client.registrationId"
                                        value={projectForm.client.registrationId}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm,
                                            client: { ...projectForm.client, registrationId: e.target.value }
                                        })}
                                        error={!!formErrors['client.registrationId']}
                                        helperText={formErrors['client.registrationId']}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Info />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    {/* </Grid> */}

                                    {/* <Grid item xs={12} md={6}> */}
                                <StyledTextField
                                    fullWidth
                                    label="Mobile"
                                    name="client.mobile"
                                    value={projectForm.client.mobile}
                                    onChange={(e) => setProjectForm({
                                        ...projectForm,
                                        client: { ...projectForm.client, mobile: e.target.value }
                                    })}
                                    error={!!formErrors['client.mobile']}
                                    helperText={formErrors['client.mobile']}
                                        required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* </Grid>

              <Grid item xs={12} md={6}> */}
                                <StyledTextField
                                    fullWidth
                                    label="Company Website"
                                    name="client.website"
                                    value={projectForm.client.website}
                                    onChange={(e) => setProjectForm({
                                        ...projectForm,
                                        client: { ...projectForm.client, website: e.target.value }
                                    })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Language />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* </Grid>

              <Grid item xs={12}> */}
                                <StyledTextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Company Address"
                                    name="client.address"
                                    value={projectForm.client.address}
                                    onChange={(e) => setProjectForm({
                                        ...projectForm,
                                        client: { ...projectForm.client, address: e.target.value }
                                    })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                    {/* </Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    gap: 2,
                }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        startIcon={<Close />}
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            py: 1.5,
                            borderColor: 'rgba(49, 17, 136, 0.5)',
                            color: 'primary.main',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
                                borderColor: 'primary.main',
                                background: 'rgba(49, 17, 136, 0.05)',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        onClick={handleSubmit}
                        loading={submitting}
                        variant="contained"
                        startIcon={<Save />}
                        sx={{
                            borderRadius: '12px',
                            px: 4,
                            py: 1.5,
                            background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(49, 17, 136, 0.2)',
                                background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
                            }
                        }}
                    >
                        {isEditMode ? 'Update Project' : 'Create Project'}
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {/* Apply Now Modal */}
            <Dialog
                open={applyModalOpen}
                onClose={() => {
                    setApplyModalOpen(false);
                    setApplicationForm({ resumeOrPortfolio: '' });
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    px: 3
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment />
                        <Typography variant="h6">Apply for Project</Typography>
                    </Box>
                    <IconButton
                        onClick={() => {
                            setApplyModalOpen(false);
                            setApplicationForm({ resumeOrPortfolio: '' });
                        }}
                        sx={{ color: 'white' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <Box component="form" onSubmit={handleApplySubmit} sx={{ mt: 2 }}>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Please provide a link to your resume or portfolio. This will help us evaluate your application.
                        </Alert>

                        <TextField
                            fullWidth
                            label="Resume/Portfolio Link"
                            value={applicationForm.resumeOrPortfolio}
                            onChange={(e) => setApplicationForm({ resumeOrPortfolio: e.target.value })}
                            placeholder="https://drive.google.com/..."
                            required
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Link />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setApplyModalOpen(false);
                                    setApplicationForm({ resumeOrPortfolio: '' });
                                }}
                                startIcon={<Close />}
                            >
                                Cancel
                            </Button>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={submittingApplication}
                                startIcon={<Send />}
                                sx={{
                                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
                                    }
                                }}
                            >
                                Submit Application
                            </LoadingButton>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Team Lead Selection */}
            {/* <Autocomplete
                fullWidth
                options={employees}
                loading={loadingEmployees}
                value={projectForm.teamLead}
                onChange={(e, newValue) => setProjectForm({ ...projectForm, teamLead: newValue })}
                getOptionLabel={(option) => option ? `${option.name} (${option.employeeId})` : ''}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Team Lddead"
                        required
                        error={!!formErrors.teamLead}
                        helperText={formErrors.teamLead}
                        sx={{
                            mt: 2,
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease-in-out',
                                border: '1px solid rgba(49, 17, 136, 0.1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
                                    border: '1px solid rgba(49, 17, 136, 0.3)',
                                },
                                '&.Mui-focused': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
                                    border: '1px solid rgba(49, 17, 136, 0.5)',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                },
                            }
                        }}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <Person sx={{ color: '#311188' }} />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{
                        '&:hover': {
                            background: 'rgba(49, 17, 136, 0.05)'
                        }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                            <Avatar
                                src={option.profileImage}
                                alt={option.name}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)'
                                }}
                            >
                                {option.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="body1">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {option.employeeId} • {option.role} • {option.team}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
                noOptionsText={
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography color="text.secondary">No employees found</Typography>
                    </Box>
                }
                loadingText={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 2 }}>
                        <CircularProgress size={20} sx={{ color: '#311188' }} />
                        <Typography>Loading employees...</Typography>
                    </Box>
                }
            /> */}
        </Box>
    );
};

export default Projects;
