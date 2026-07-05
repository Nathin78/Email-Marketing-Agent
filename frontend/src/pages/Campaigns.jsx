import { useEffect, useState, useContext, useMemo } from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Chip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api';
import { SearchContext } from '../context/SearchContext';
import GlassPanel from '../components/GlassPanel';
import { useRealtimeCampaignStatus } from '../hooks/useRealtime';
import { Plus, Send, BarChart3 } from 'lucide-react';

const mockCampaigns = [
  { id: 1, name: 'Q3 Summer Sale', status: 'sending', progress: 65, recipients: 12450, sent: 8092, opened: 2156, clicked: 287 },
  { id: 2, name: 'Product Launch Beta', status: 'sent', progress: 100, recipients: 8320, sent: 8320, opened: 1829, clicked: 412 },
  { id: 3, name: 'Newsletter July', status: 'scheduled', progress: 0, recipients: 45230, sent: 0, opened: 0, clicked: 0 }
];

export default function Campaigns() {
  const { searchQuery } = useContext(SearchContext);
  const campaignStream = useRealtimeCampaignStatus();
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return campaigns;
    const query = searchQuery.toLowerCase();
    return campaigns.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.status.toLowerCase().includes(query)
    );
  }, [campaigns, searchQuery]);

  // Update campaign from real-time data
  useEffect(() => {
    if (campaignStream.data) {
      setCampaigns(prev => 
        prev.map(c => 
          c.id === (campaignStream.data.campaignId || 1) 
            ? {
                ...c,
                progress: campaignStream.data.progress || c.progress,
                status: campaignStream.data.status || c.status,
                sent: campaignStream.data.sentCount || c.sent
              }
            : c
        )
      );
    }
  }, [campaignStream.data]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/campaigns', data);
      toast.success('Campaign created successfully');
      setCampaigns(prev => [...prev, {
        id: prev.length + 1,
        name: data.campaignName,
        status: 'scheduled',
        progress: 0,
        recipients: 0,
        sent: 0,
        opened: 0,
        clicked: 0
      }]);
      reset();
      setOpenDialog(false);
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sending': return 'rgba(34,197,94,0.2)';
      case 'sent': return 'rgba(59,130,246,0.2)';
      case 'scheduled': return 'rgba(255,140,0,0.2)';
      default: return 'rgba(255,255,255,0.1)';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'sending': return '#86efac';
      case 'sent': return '#93c5fd';
      case 'scheduled': return '#FFD700';
      default: return '#fff';
    }
  };

  return (
    <Box>
      <GlassPanel sx={{ p: { xs: 3, md: 4 }, mb: 3, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(255,140,0,0.22), transparent 45%), radial-gradient(circle at bottom right, rgba(255,184,0,0.18), transparent 40%)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Campaign Management</Typography>
              <Typography color="text.secondary">Create and monitor your email campaigns in real-time</Typography>
            </Box>
            <Button 
              variant="contained" 
              onClick={() => setOpenDialog(true)}
              sx={{ background: 'linear-gradient(135deg,#FF8C00,#FFD700)', px: 3, py: 1.3, borderRadius: 4, color: '#000', fontWeight: 600 }} 
              startIcon={<Plus size={18} />}
            >
              New Campaign
            </Button>
          </Stack>
        </Box>
      </GlassPanel>

      {/* Create Campaign Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#FFD700' }}>Create New Campaign</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <form>
            <Stack spacing={2}>
              <TextField label="Campaign Name" {...register('campaignName')} fullWidth />
              <TextField label="Product Name" {...register('productName')} fullWidth />
              <TextField label="Goal" {...register('goal')} fullWidth />
              <TextField label="Tone" {...register('tone')} fullWidth />
              <TextField label="Language" {...register('language')} fullWidth />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" sx={{ background: 'linear-gradient(135deg,#FF8C00,#FFD700)', color: '#000' }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Real-time Connection Status */}
      <Chip 
        label={campaignStream.connected ? "🔴 Real-time Active" : "⏸ Offline"}
        sx={{ 
          mb: 2,
          background: campaignStream.connected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', 
          color: campaignStream.connected ? '#86efac' : '#ef4444' 
        }} 
      />

      {/* Campaigns List */}
      <Grid container spacing={2.5}>
        {filteredCampaigns.map(campaign => (
          <Grid item xs={12} key={campaign.id}>
            <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{campaign.name}</Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={campaign.status}
                          size="small"
                          sx={{ background: getStatusColor(campaign.status), color: getStatusTextColor(campaign.status) }}
                        />
                        <Typography variant="caption" color="text.secondary">{campaign.recipients.toLocaleString()} recipients</Typography>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" startIcon={<Send size={16} />}>Send</Button>
                      <Button size="small" startIcon={<BarChart3 size={16} />}>Analytics</Button>
                    </Stack>
                  </Stack>

                  {campaign.status !== 'scheduled' && (
                    <>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="caption">Progress</Typography>
                          <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600 }}>{campaign.progress}%</Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={campaign.progress}
                          sx={{
                            height: 6,
                            borderRadius: 999,
                            background: 'rgba(255,140,0,0.2)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #FF8C00, #FFD700)'
                            }
                          }}
                        />
                      </Box>

                      <Grid container spacing={1.5}>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ background: 'rgba(255,140,0,0.1)', p: 1.5, borderRadius: 1, border: '1px solid rgba(255,140,0,0.2)' }}>
                            <Typography variant="caption" color="text.secondary">Sent</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{campaign.sent.toLocaleString()}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ background: 'rgba(255,184,0,0.1)', p: 1.5, borderRadius: 1, border: '1px solid rgba(255,184,0,0.2)' }}>
                            <Typography variant="caption" color="text.secondary">Opens</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{campaign.opened.toLocaleString()}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ background: 'rgba(76,175,80,0.1)', p: 1.5, borderRadius: 1, border: '1px solid rgba(76,175,80,0.2)' }}>
                            <Typography variant="caption" color="text.secondary">Clicks</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{campaign.clicked.toLocaleString()}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ background: 'rgba(100,200,255,0.1)', p: 1.5, borderRadius: 1, border: '1px solid rgba(100,200,255,0.2)' }}>
                            <Typography variant="caption" color="text.secondary">CTR</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{((campaign.clicked / campaign.sent) * 100).toFixed(1)}%</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
