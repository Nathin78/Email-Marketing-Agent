import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      login(res.data.data);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 50%, #FF8C00 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 140, 0, 0.1)',
        filter: 'blur(40px)',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(255, 184, 0, 0.1)',
        filter: 'blur(40px)',
      }
    }}>
      <Card sx={{
        width: '100%',
        maxWidth: 480,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        position: 'relative',
        zIndex: 1
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>Create Account</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>Join thousands of marketers creating AI-powered campaigns.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                fullWidth
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#fff' }
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#fff' }
                }}
              />
              <TextField
                label="Email"
                fullWidth
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#fff' }
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#fff' }
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#fff' }
                  },
                  '& .MuiOutlinedInput-input': { color: '#fff' },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#fff' }
                }}
              />
              <Button type="submit" variant="contained" sx={{
                background: '#FF8C00',
                color: '#fff',
                fontWeight: 600,
                py: 1.5,
                borderRadius: '999px',
                '&:hover': { background: 'rgba(255, 255, 255, 0.9)' }
              }}>Create Account</Button>
            </Stack>
          </form>
          <Typography variant="body2" sx={{ mt: 3, color: '#fff', textAlign: 'center' }}
            >Already have an account? <Link to="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
