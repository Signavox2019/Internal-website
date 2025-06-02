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
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editedProfile, setEditedProfile] = useState(null);
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/employees/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setEditedProfile(response.data);
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
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
            }}
          >
            {profile?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {profile?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profile?.employeeId} • {profile?.role}
            </Typography>
          </Box>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                ml: 'auto',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
                }
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
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
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={isEditing ? editedProfile?.name : profile?.name}
              onChange={handleChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={isEditing ? editedProfile?.email : profile?.email}
              onChange={handleChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={isEditing ? editedProfile?.employeeId : profile?.employeeId}
              onChange={handleChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={isEditing ? editedProfile?.role : profile?.role}
                onChange={handleChange}
                disabled={!isEditing}
                label="Role"
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="DevOps">DevOps</MenuItem>
                <MenuItem value="Designer">Designer</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Team</InputLabel>
              <Select
                name="team"
                value={isEditing ? editedProfile?.team : profile?.team}
                onChange={handleChange}
                disabled={!isEditing}
                label="Team"
              >
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Blood Group</InputLabel>
              <Select
                name="bloodGroup"
                value={isEditing ? editedProfile?.bloodGroup : profile?.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing}
                label="Blood Group"
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;