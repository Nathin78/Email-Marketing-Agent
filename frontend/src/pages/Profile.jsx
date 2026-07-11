import { useState, useEffect } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography, Grid, Chip, Avatar, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Phone, Building2, Briefcase, Mail, Shield, Edit2, Check, X, KeyRound, Calendar } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuroraBackground from '../components/AuroraBackground';
import GlassPanel from '../components/GlassPanel';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/profile');
      const data = res.data.data;
      setProfile(data);
      setValue('name', data.name);
      setValue('phoneNumber', data.phoneNumber || '');
      setValue('companyName', data.companyName || '');
      setValue('industry', data.industry || '');
    } catch (err) {
      toast.error('Failed to load profile details');
      setError('Could not retrieve profile information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/users/profile', data);
      const updatedProfile = res.data.data;
      setProfile(updatedProfile);
      
      // Sync update to AuthContext to update the sidebar avatar & name immediately
      updateUser({ name: updatedProfile.name });
      
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile changes');
      toast.error('Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#FF8C00' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
        Account Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your personal profile details, contact information, and business coordinates.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Left Side: Avatar Showcase & Quick Stats */}
        <Grid item xs={12} md={4}>
          <GlassPanel sx={{
            p: 4,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            height: '100%'
          }}>
            <Avatar sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 2.5,
              fontSize: '2.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
              color: '#000',
              boxShadow: '0 8px 24px rgba(255, 140, 0, 0.25)'
            }}>
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.8, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
              {profile?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              {profile?.email}
            </Typography>

            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 4 }}>
              <Chip label="Premium Member" sx={{
                background: 'rgba(255, 140, 0, 0.15)',
                color: '#FFD700',
                border: '1px solid rgba(255, 140, 0, 0.3)',
                fontWeight: 700,
                fontSize: '0.8rem'
              }} />
              <Chip label={profile?.role || 'USER'} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#A7B4C8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontWeight: 700,
                fontSize: '0.8rem'
              }} />
            </Stack>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

            <Stack spacing={2} sx={{ textAlign: 'left' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                  ACCOUNT ID
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#FFB800', fontWeight: 600 }}>
                  USR-{String(profile?.id).padStart(5, '0')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                  STATUS
                </Typography>
                <Typography variant="body2" sx={{ color: '#86efac', fontWeight: 700 }}>
                  Active & Verified
                </Typography>
              </Box>
            </Stack>
          </GlassPanel>
        </Grid>

        {/* Right Side: Editable Details Card */}
        <Grid item xs={12} md={8}>
          <GlassPanel sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Profile Coordinates
              </Typography>
              {!editMode ? (
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(true)}
                  startIcon={<Edit2 size={16} />}
                  sx={{
                    color: '#FF8C00',
                    borderColor: 'rgba(255, 140, 0, 0.4)',
                    '&:hover': {
                      borderColor: '#FF8C00',
                      background: 'rgba(255, 140, 0, 0.08)'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      // Reset to values in profile state
                      setValue('name', profile.name);
                      setValue('phoneNumber', profile.phoneNumber || '');
                      setValue('companyName', profile.companyName || '');
                      setValue('industry', profile.industry || '');
                    }}
                    startIcon={<X size={16} />}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(255,255,255,0.15)',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.05)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={16} sx={{ color: '#000' }} /> : <Check size={16} />}
                    sx={{
                      background: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
                      color: '#000',
                      fontWeight: 700,
                      '&:hover': {
                        opacity: 0.95
                      }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </Stack>
              )}
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    disabled={!editMode}
                    {...register('name', { required: 'Name is required' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: <User size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8C00' },
                        '&.Mui-disabled fieldset': { borderColor: 'rgba(255, 255, 255, 0.03)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8C00' },
                      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.6)' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    disabled
                    value={profile?.email || ''}
                    InputProps={{
                      startAdornment: <Mail size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'rgba(255, 255, 255, 0.4)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.03)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.3)' },
                      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.4)' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    disabled={!editMode}
                    {...register('phoneNumber')}
                    InputProps={{
                      startAdornment: <Phone size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8C00' },
                        '&.Mui-disabled fieldset': { borderColor: 'rgba(255, 255, 255, 0.03)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8C00' },
                      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.6)' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    disabled={!editMode}
                    {...register('companyName')}
                    InputProps={{
                      startAdornment: <Building2 size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8C00' },
                        '&.Mui-disabled fieldset': { borderColor: 'rgba(255, 255, 255, 0.03)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8C00' },
                      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.6)' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Industry Sector"
                    fullWidth
                    disabled={!editMode}
                    {...register('industry')}
                    InputProps={{
                      startAdornment: <Briefcase size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8C00' },
                        '&.Mui-disabled fieldset': { borderColor: 'rgba(255, 255, 255, 0.03)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8C00' },
                      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.6)' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Privilege Group"
                    fullWidth
                    disabled
                    value={profile?.role === 'ADMIN' ? 'Administrator' : 'Standard User'}
                    InputProps={{
                      startAdornment: <Shield size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'rgba(255, 255, 255, 0.4)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.03)' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.3)' },
                      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.4)' }
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </GlassPanel>
        </Grid>
      </Grid>
    </Box>
  );
}
