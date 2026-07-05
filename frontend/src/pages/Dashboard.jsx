import { useEffect, useState } from 'react';
import { Button, Chip, CircularProgress, Grid, Stack, Typography, Box, Card, CardContent, LinearProgress } from '@mui/material';
import { ArrowRight, Sparkles, RadioTower, TrendingUp, Users, Zap, Play, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlassPanel from '../components/GlassPanel';
import { useRealtimeDashboard, useRealtimeCampaignStatus } from '../hooks/useRealtime';

export default function Dashboard() {
  const navigate = useNavigate();
  const dashboardData = useRealtimeDashboard();
  const campaignData = useRealtimeCampaignStatus();
  const [data, setData] = useState({ customers: 0, campaigns: 0, emailsGenerated: 0, averageScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setData(res.data.data || { customers: 0, campaigns: 0, emailsGenerated: 0, averageScore: 0 });
      setLoading(false);
    }).catch(() => {
      setData({ customers: 0, campaigns: 0, emailsGenerated: 0, averageScore: 0 });
      setLoading(false);
    });
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Box>
      <GlassPanel sx={{ p: { xs: 3, md: 4 }, mb: 3, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(255,140,0,0.22), transparent 45%), radial-gradient(circle at bottom right, rgba(255,184,0,0.18), transparent 40%)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Chip 
                icon={dashboardData.connected ? <Zap size={14} /> : undefined}
                label={dashboardData.connected ? "🔴 Live Updates Active" : "⏸ Offline"} 
                sx={{ mb: 2, background: dashboardData.connected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: dashboardData.connected ? '#86efac' : '#ef4444', border: dashboardData.connected ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(239,68,68,0.4)' }} 
              />
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.05, maxWidth: 620 }}>Welcome back — your campaigns are running live.</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.2, maxWidth: 620 }}>Real-time updates flowing in. Watch your emails in motion with live analytics.</Typography>
            </Box>
            <Button variant="contained" onClick={() => navigate('/generate')} sx={{ background: 'linear-gradient(135deg,#FF8C00,#FFD700)', px: 3, py: 1.3, borderRadius: 4, color: '#000', fontWeight: 600 }} endIcon={<ArrowRight size={18} />}>Generate New Campaign</Button>
          </Stack>
        </Box>
      </GlassPanel>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          ['Customers', data.customers, <Users size={18} />],
          ['Campaigns', data.campaigns, <RadioTower size={18} />],
          ['Emails', data.emailsGenerated, <Sparkles size={18} />],
          ['Score', `${data.averageScore}%`, <TrendingUp size={18} />]
        ].map(([label, value, icon]) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <GlassPanel sx={{ p: 2.4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">{label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
                </Box>
                <Box sx={{ width: 42, height: 42, borderRadius: '14px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
              </Stack>
            </GlassPanel>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <GlassPanel sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Campaign Status Updates</Typography>
              <Chip 
                label={campaignData.connected ? "🟢 Live" : "Waiting..."} 
                sx={{ background: campaignData.connected ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)', color: campaignData.connected ? '#86efac' : '#93c5fd' }} 
              />
            </Stack>
            {campaignData.data ? (
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Campaign #{campaignData.data.campaignId || 1}</Typography>
                    <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>{campaignData.data.progress || 0}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={campaignData.data.progress || 0} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 999, 
                      background: 'rgba(255,140,0,0.2)', 
                      '& .MuiLinearProgress-bar': { 
                        background: 'linear-gradient(90deg, #FF8C00, #FFD700)' 
                      } 
                    }} 
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ background: 'rgba(255,140,0,0.1)', p: 2, borderRadius: 2, border: '1px solid rgba(255,140,0,0.2)' }}>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#86efac', mt: 0.5 }}>{campaignData.data.status || 'pending'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ background: 'rgba(255,184,0,0.1)', p: 2, borderRadius: 2, border: '1px solid rgba(255,184,0,0.2)' }}>
                      <Typography variant="caption" color="text.secondary">Sent</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>{(campaignData.data.sentCount || 0).toLocaleString()}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            ) : (
              <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Waiting for real-time updates...</Typography>
              </Box>
            )}
          </GlassPanel>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Stack spacing={2.5}>
            <GlassPanel sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick actions</Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'Generate new email', path: '/generate' },
                  { label: 'Launch campaign', path: '/campaigns' },
                  { label: 'Review AI score', path: '/analytics' }
                ].map((action) => <Button key={action.label} variant="outlined" onClick={() => navigate(action.path)} sx={{ justifyContent: 'space-between', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: 3 }} endIcon={<Play size={16} />}>{action.label}</Button>)}
              </Stack>
            </GlassPanel>
            <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>REAL-TIME STATUS</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>Connection</Typography>
                  </Box>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: dashboardData.connected ? '#86efac' : '#ef4444', boxShadow: dashboardData.connected ? '0 0 12px rgba(134,239,172,0.5)' : 'none' }} />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
