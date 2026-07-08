import { useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography, Grid, Chip } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Zap, Sparkles, Users, Lock, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import AuroraBackground from '../components/AuroraBackground';
import GlassPanel from '../components/GlassPanel';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Step 1: Send request code, Step 2: Reset using code
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSendCode = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setEmail(data.email);
      toast.success('Reset code generated. Check server console logs!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset code');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', {
        email,
        code: data.code,
        newPassword: data.newPassword
      });
      toast.success('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0F0F0F',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dynamic particles and floating glow shapes */}
      <AuroraBackground />

      <Grid container sx={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {/* Left Side: Mock Dashboard Showcase */}
        <Grid item xs={12} md={6} sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          p: 6,
          borderRight: '1px solid rgba(255, 140, 0, 0.15)',
          background: 'linear-gradient(135deg, rgba(15,15,15,0.85) 0%, rgba(26,26,26,0.9) 100%)',
          backdropFilter: 'blur(10px)',
        }}>
          <Box sx={{ maxWidth: 520, mx: 'auto' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{
                width: 42,
                height: 42,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #FF8C00, #FFD700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(255, 140, 0, 0.25)'
              }}>
                <Zap size={20} color="#000" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 850, letterSpacing: '-0.5px', fontFamily: 'Space Grotesk, sans-serif' }}>
                Nexora AI
              </Typography>
            </Stack>

            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.8,
              py: 0.6,
              borderRadius: 99,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              width: 'fit-content',
              mb: 3
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                animation: 'pulse 1.8s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(34,197,94,0.7)' },
                  '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(34,197,94,0)' },
                  '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(34,197,94,0)' }
                }
              }} />
              <Typography variant="caption" sx={{ color: '#86efac', fontWeight: 700, letterSpacing: '0.5px' }}>
                SYSTEM ENGINE ONLINE
              </Typography>
            </Box>

            <Typography variant="h3" sx={{
              fontWeight: 800,
              mb: 2.5,
              lineHeight: 1.1,
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #A7B4C8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Turn every email into a high-converting conversation.
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 5, fontSize: '1.05rem', lineHeight: 1.6 }}>
              Launch AI-powered campaigns, manage customer prospects, and deliver smarter outreach from one premium workspace.
            </Typography>

            {/* Mock Dashboard Layout */}
            <Grid container spacing={2} sx={{ mb: 3.5 }}>
              {[
                { label: 'Prospects Reached', value: '1,420', icon: <Users size={16} />, color: '#FF8C00', bg: 'rgba(255,140,0,0.1)' },
                { label: 'AI Quality Score', value: '96%', icon: <Sparkles size={16} />, color: '#FFD700', bg: 'rgba(255,215,0,0.1)' }
              ].map((card) => (
                <Grid item xs={6} key={card.label}>
                  <GlassPanel sx={{ p: 2, background: 'rgba(255,255,255,0.03)' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{
                        p: 1,
                        borderRadius: '10px',
                        background: card.bg,
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {card.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                          {card.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800 }}>
                          {card.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </GlassPanel>
                </Grid>
              ))}
            </Grid>

            {/* Mock Active Campaign Card */}
            <GlassPanel sx={{
              p: 2.5,
              background: 'rgba(255,140,0,0.03)',
              border: '1px solid rgba(255,140,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              mb: 3.5
            }}>
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at top left, rgba(255,140,0,0.08), transparent 60%)'
              }} />
              <Stack spacing={1.8} sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Active Campaign Status</Typography>
                  <Chip label="Processing" size="small" sx={{
                    background: 'rgba(255,140,0,0.15)',
                    color: '#FF8C00',
                    fontWeight: 700,
                    height: 20,
                    fontSize: '0.7rem'
                  }} />
                </Stack>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Q4 Sales Outreach</Typography>
                    <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 800 }}>82%</Typography>
                  </Stack>
                  <Box sx={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <Box sx={{
                      width: '82%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #FF8C00, #FFD700)',
                      borderRadius: 999,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                        animation: 'shimmer 2s infinite linear'
                      },
                      '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' }
                      }
                    }} />
                  </Box>
                </Box>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Sent</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>1,164</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Open Rate</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#86efac' }}>68.4%</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Bounce Rate</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF5A5F' }}>0.4%</Typography>
                  </Box>
                </Stack>
              </Stack>
            </GlassPanel>
          </Box>
        </Grid>

        {/* Right Side: Forgot Password Form */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}>
          <GlassPanel sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 3.5, sm: 5 },
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
          }}>
            {step === 1 ? (
              <>
                <Stack spacing={1} sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Reset Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter your email address and we'll generate a verification reset code.
                  </Typography>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3.5, borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit(onSendCode)}>
                  <Stack spacing={3}>
                    <TextField
                      label="Email Address"
                      fullWidth
                      {...register('email', { required: 'Email is required' })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: <Mail size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&.Mui-focused fieldset': { borderColor: '#FF8C00' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FF8C00' }
                      }}
                    />

                    <Button type="submit" disabled={loading} variant="contained" sx={{
                      background: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
                      color: '#000',
                      fontWeight: 700,
                      py: 1.6,
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(255, 140, 0, 0.2)',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(255, 140, 0, 0.35)',
                        opacity: 0.95
                      }
                    }}>
                      {loading ? 'Sending Request...' : 'Send Reset Code'}
                    </Button>
                  </Stack>
                </form>
              </>
            ) : (
              <>
                <Stack spacing={1} sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Enter Reset Code
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verification code has been generated. Check your backend console logs for the code.
                  </Typography>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3.5, borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit(onResetPassword)}>
                  <Stack spacing={3}>
                    <TextField
                      label="6-Digit Reset Code"
                      fullWidth
                      {...register('code', { required: 'Verification code is required' })}
                      error={!!errors.code}
                      helperText={errors.code?.message}
                      InputProps={{
                        startAdornment: <KeyRound size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&.Mui-focused fieldset': { borderColor: '#FF8C00' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FF8C00' }
                      }}
                    />

                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      {...register('newPassword', { required: 'New password is required' })}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                      InputProps={{
                        startAdornment: <Lock size={18} style={{ marginRight: 12, color: 'rgba(255,255,255,0.4)' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&.Mui-focused fieldset': { borderColor: '#FF8C00' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FF8C00' }
                      }}
                    />

                    <Button type="submit" disabled={loading} variant="contained" sx={{
                      background: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
                      color: '#000',
                      fontWeight: 700,
                      py: 1.6,
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(255, 140, 0, 0.2)',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(255, 140, 0, 0.35)',
                        opacity: 0.95
                      }
                    }}>
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                  </Stack>
                </form>
              </>
            )}

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 4, justifyContent: 'center' }}>
              <ArrowLeft size={16} style={{ color: '#FF8C00' }} />
              <Link to="/login" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                Back to Login
              </Link>
            </Stack>
          </GlassPanel>
        </Grid>
      </Grid>
    </Box>
  );
}
