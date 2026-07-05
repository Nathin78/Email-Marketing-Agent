import { useEffect, useState, useContext, useMemo } from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from '@mui/material';
import { Delete, Edit, Mail } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api';
import { SearchContext } from '../context/SearchContext';
import GlassPanel from '../components/GlassPanel';
import { useRealtimeActivity } from '../hooks/useRealtime';
import { Activity, MessageSquare } from 'lucide-react';

const mockCustomers = [
  { id: 1, name: 'Sarah Johnson', company: 'TechCorp', email: 'sarah@techcorp.com', interest: 'Marketing', joinDate: '2024-06-15' },
  { id: 2, name: 'Michael Chen', company: 'FinanceHub', email: 'michael@financehub.com', interest: 'Analytics', joinDate: '2024-05-20' },
  { id: 3, name: 'Emma Wilson', company: 'Creative Co', email: 'emma@creative.com', interest: 'Design', joinDate: '2024-07-01' }
];

const mockActivityLog = [
  { id: 1, customer: 'Sarah Johnson', action: 'Email opened', timestamp: '2 minutes ago', type: 'open' },
  { id: 2, customer: 'Michael Chen', action: 'Clicked link in email', timestamp: '5 minutes ago', type: 'click' },
  { id: 3, customer: 'Emma Wilson', action: 'Replied to email', timestamp: '12 minutes ago', type: 'reply' },
  { id: 4, customer: 'Sarah Johnson', action: 'Added to campaign', timestamp: '1 hour ago', type: 'campaign' }
];

export default function Customers() {
  const { searchQuery } = useContext(SearchContext);
  const activityStream = useRealtimeActivity();
  const [customers, setCustomers] = useState(mockCustomers);
  const [activityLog, setActivityLog] = useState(mockActivityLog);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.company.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.interest.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  // Update activity log from real-time data
  useEffect(() => {
    if (activityStream.data) {
      const newActivity = {
        id: activityLog.length + 1,
        customer: activityStream.data.userId || 'Unknown',
        action: activityStream.data.action || 'Activity',
        timestamp: 'Just now',
        type: activityStream.data.type || 'activity'
      };
      setActivityLog(prev => [newActivity, ...prev.slice(0, 9)]);
    }
  }, [activityStream.data]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/customers', data);
      toast.success('Customer added successfully');
      setCustomers(prev => [...prev, {
        id: prev.length + 1,
        name: data.name,
        company: data.company,
        email: data.email,
        interest: data.interest,
        joinDate: new Date().toISOString().split('T')[0]
      }]);
      reset();
      setOpenDialog(false);
    } catch (error) {
      toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted');
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch {
      toast.error('Failed to delete customer');
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'open': return 'rgba(255,184,0,0.2)';
      case 'click': return 'rgba(76,175,80,0.2)';
      case 'reply': return 'rgba(100,200,255,0.2)';
      case 'campaign': return 'rgba(255,140,0,0.2)';
      default: return 'rgba(255,255,255,0.1)';
    }
  };

  const getActivityTextColor = (type) => {
    switch (type) {
      case 'open': return '#FFD700';
      case 'click': return '#86efac';
      case 'reply': return '#93c5fd';
      case 'campaign': return '#FF8C00';
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
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Customer Management</Typography>
              <Typography color="text.secondary">Track customer activity and engagement in real-time</Typography>
            </Box>
            <Button 
              variant="contained" 
              onClick={() => setOpenDialog(true)}
              sx={{ background: 'linear-gradient(135deg,#FF8C00,#FFD700)', px: 3, py: 1.3, borderRadius: 4, color: '#000', fontWeight: 600 }} 
              startIcon={<Mail />}
            >
              Add Customer
            </Button>
          </Stack>
        </Box>
      </GlassPanel>

      {/* Add Customer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#FFD700' }}>Add New Customer</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField label="Name" {...register('name')} fullWidth />
            <TextField label="Company" {...register('company')} fullWidth />
            <TextField label="Email" {...register('email')} fullWidth />
            <TextField label="Interest" {...register('interest')} fullWidth />
            <TextField label="Job Title" {...register('jobTitle')} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" sx={{ background: 'linear-gradient(135deg,#FF8C00,#FFD700)', color: '#000' }}>Add</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2.5}>
        {/* Customers List */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>All Customers ({customers.length})</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map(customer => (
                    <TableRow key={customer.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.04)' } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg,#FF8C00,#FFD700)', fontSize: '14px', fontWeight: 700 }}>
                            {customer.name.charAt(0)}
                          </Avatar>
                          {customer.name}
                        </Stack>
                      </TableCell>
                      <TableCell>{customer.company}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: '#FFD700' }}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(customer.id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Activity Feed */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)', height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Activity Feed</Typography>
                <Chip 
                  label={activityStream.connected ? "🔴 Live" : "⏸ Offline"}
                  size="small"
                  sx={{ background: activityStream.connected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: activityStream.connected ? '#86efac' : '#ef4444' }}
                />
              </Stack>
              <Stack spacing={1.5}>
                {activityLog.map(activity => (
                  <Box
                    key={activity.id}
                    sx={{
                      background: getActivityColor(activity.type),
                      p: 1.5,
                      borderRadius: 1.5,
                      border: `1px solid ${getActivityTextColor(activity.type)}33`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5
                    }}
                  >
                    <Activity size={18} color={getActivityTextColor(activity.type)} style={{ marginTop: 2, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.customer}</Typography>
                      <Typography variant="caption" color="text.secondary">{activity.action}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: getActivityTextColor(activity.type), fontWeight: 500, mt: 0.5 }}>{activity.timestamp}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
