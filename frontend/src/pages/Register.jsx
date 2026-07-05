import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Card sx={{ width: '100%', maxWidth: 480 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Create Account</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField label="Name" fullWidth {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
              <TextField label="Email" fullWidth {...register('email', { required: 'Email is required' })} error={!!errors.email} helperText={errors.email?.message} />
              <TextField label="Password" type="password" fullWidth {...register('password', { required: 'Password is required' })} error={!!errors.password} helperText={errors.password?.message} />
              <Button type="submit" variant="contained">Create Account</Button>
            </Stack>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>Already have an account? <Link to="/login">Login</Link></Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
