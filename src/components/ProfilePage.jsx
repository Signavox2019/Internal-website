import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Avatar,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Tooltip,
    Divider,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Email as EmailIcon,
    Badge as BadgeIcon,
    Work as WorkIcon,
    Group as GroupIcon,
    LocalHospital as BloodIcon,
    PhotoCamera as CameraIcon,
    Person as PersonIcon,
    Assignment as ProjectIcon,
    CheckCircle as ApprovedIcon,
    PendingActions as PendingIcon,
    Block as RejectedIcon,
    Close as DroppedIcon,
    Folder as OpenProjectIcon,
    FolderOff as ClosedProjectIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';

// Styled Components
const StatsCard = styled(motion.div)(({ theme, gradient }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    background: gradient || 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    color: 'white',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        zIndex: 1,
    },
}));

const IconCircle = styled(Box)(({ theme }) => ({
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'rotate(10deg)',
        background: 'rgba(255, 255, 255, 0.2)',
    },
}));

const GradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
}));

const StatsFeatureList = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(3),
}));

const StatsFeatureItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.spacing(2),
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
}));

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editedProfile, setEditedProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fileInputRef] = useState(React.createRef());
    const [showPreview, setShowPreview] = useState(false);
    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/employees/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // console.log(response.data);
            setProfile(response.data.employee);
            setEditedProfile(response.data.employee);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);



    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `${BaseUrl}/employees/profile/${profile._id}`,
                editedProfile,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setProfile(response.data);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleChange = (e) => {
        setEditedProfile({
            ...editedProfile,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatarClick = () => {
        if (!isEditing) {
            setShowPreview(true);
        } else if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setProfileImage(file);

            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData._id) {
                toast.error('User data not found');
                return;
            }

            // Upload image
            const formData = new FormData();
            formData.append('image', file);
            formData.append('_id', userData._id);

            try {
                const response = await axios.put(
                    `${BaseUrl}/employees/profile-image`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    },
                );

                if (response.data) {
                    setProfile(response.data);
                    // Update userData in localStorage with new profile image
                    const updatedUserData = { ...userData, profileImage: response.data.profileImage };
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));
                    toast.success('Profile image updated successfully!');
                }
            } catch (error) {
                console.error('Error updating profile image:', error);
                toast.error(error.response?.data?.message || 'Failed to update profile image');
                // Reset preview on error
                setImagePreview(null);
            }
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        borderRadius: '30px',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {/* Profile Header */}
                    <Box
                        sx={{
                            height: '200px',
                            // background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                            background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',

                            position: 'relative',
                        }}
                    />

                    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, pb: 4, mt: -10 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={imagePreview || profile?.profileImage}
                                    onClick={handleAvatarClick}
                                    sx={{
                                        width: 180,
                                        height: 180,
                                        border: '4px solid white',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                                        mb: 2,
                                        borderColor: 'white',
                                        fontSize: 70,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                                            opacity: 0.8,
                                            borderRadius: '50%',
                                            zIndex: -1,
                                        }
                                    }}
                                >
                                    {!imagePreview && !profile?.profileImage && profile?.name?.charAt(0)}
                                </Avatar>
                                {isEditing && (
                                    <Box
                                        component="label"
                                        htmlFor="profile-image-input"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 20,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            borderRadius: '50%',
                                            width: 40,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '2px solid white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                        }}
                                    >
                                        <CameraIcon sx={{ color: 'white' }} />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            id="profile-image-input"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    // background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                                    background:'#311188',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textAlign: 'center',
                                    mb: 1,
                                }}
                            >
                                {profile?.name}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Chip
                                    icon={<BadgeIcon />}
                                    label={profile?.employeeId}
                                    color="secondary"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<WorkIcon />}
                                    label={profile?.role}
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Box>

                            {!isEditing ? (
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={handleEdit}
                                    sx={{
                                        mt: 3,
                                        borderRadius: '12px',
                                        // background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                                        background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',

                                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                                        '&:hover': {
                                            // background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
                                            background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',

                                        }
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancel}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                        sx={{
                                            borderRadius: '12px',
                                            // background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                                            background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                                            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                                            '&:hover': {
                                                // background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
                                                background: 'linear-gradient(135deg, #0A081E 0%, #311188 100%)',
                                            }
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Grid container spacing={8}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                minHeight: '200px',
                                width: '100%'
                            }}
                        >
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            width: '450px',
                                            p: 4,
                                            height: '100%',
                                            background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
                                            borderRadius: '20px',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"

                                            sx={{
                                                fontWeight: 700,
                                                color: '#1f2937',
                                                mb: 4,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                '&::after': {
                                                    content: '""',
                                                    flex: 1,
                                                    height: '2px',
                                                    background: 'linear-gradient(90deg, #4f46e5 0%, transparent 100%)',
                                                }
                                            }}
                                        >
                                            <PersonIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
                                            Personal Information
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 3,
                                            '& .MuiTextField-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateX(8px)'
                                                }
                                            }
                                        }}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={isEditing ? editedProfile?.name : profile?.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                InputProps={{
                                                    startAdornment: (
                                                        <PersonIcon sx={{ mr: 1, color: '#4f46e5' }} />
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        bgcolor: 'white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                        '&:hover': {
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#4f46e5',
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                value={isEditing ? editedProfile?.email : profile?.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                InputProps={{
                                                    startAdornment: (
                                                        <EmailIcon sx={{ mr: 1, color: '#4f46e5' }} />
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        bgcolor: 'white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                        '&:hover': {
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#4f46e5',
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            width: '450px',
                                            p: 4,
                                            height: '100%',
                                            background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
                                            borderRadius: '20px',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#1f2937',
                                                mb: 4,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                '&::after': {
                                                    content: '""',
                                                    flex: 1,
                                                    height: '2px',
                                                    background: 'linear-gradient(90deg, #4f46e5 0%, transparent 100%)',
                                                }
                                            }}
                                        >
                                            <WorkIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
                                            Work Information
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 3,
                                            '& .MuiFormControl-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateX(8px)'
                                                }
                                            }
                                        }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    name="role"
                                                    value={isEditing ? editedProfile?.role : profile?.role}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    startAdornment={<WorkIcon sx={{ mr: 1, color: '#4f46e5' }} />}
                                                    sx={{
                                                        borderRadius: '12px',
                                                        bgcolor: 'white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#4f46e5',
                                                        },
                                                    }}
                                                >
                                                    {['CEO', 'CTO', 'CFO', 'CMO', 'COO', 'CHRO', 'HR', 'Manager', 'Developer', 'DevOps', 'BDE', 'Support', 'UI/UX', 'Testing', 'Other'].map((role) => (
                                                        <MenuItem key={role} value={role}>{role}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <InputLabel>Team</InputLabel>
                                                <Select
                                                    name="team"
                                                    value={isEditing ? editedProfile?.team : profile?.team}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    startAdornment={<GroupIcon sx={{ mr: 1, color: '#4f46e5' }} />}
                                                    sx={{
                                                        borderRadius: '12px',
                                                        bgcolor: 'white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#4f46e5',
                                                        },
                                                    }}
                                                >
                                                    {['Executive', 'Operations', 'Recruitment', 'Technical', 'Finance', 'Marketing', 'Other'].map((team) => (
                                                        <MenuItem key={team} value={team}>{team}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <InputLabel>Blood Group</InputLabel>
                                                <Select
                                                    name="bloodGroup"
                                                    value={isEditing ? editedProfile?.bloodGroup : profile?.bloodGroup}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    startAdornment={<BloodIcon sx={{ mr: 1, color: '#4f46e5' }} />}
                                                    sx={{
                                                        borderRadius: '12px',
                                                        bgcolor: 'white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#4f46e5',
                                                        },
                                                    }}
                                                >
                                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((blood) => (
                                                        <MenuItem key={blood} value={blood}>{blood}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

// Add Error Boundary
class ProfileErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Profile Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{
                    p: 3,
                    textAlign: 'center',
                    color: 'error.main'
                }}>
                    <Typography variant="h6">
                        Something went wrong loading the profile.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Reload Page
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

// Wrap the ProfilePage with Error Boundary
export default function ProfilePageWithErrorBoundary() {
    return (
        <ProfileErrorBoundary>
            <ProfilePage />
        </ProfileErrorBoundary>
    );
}

