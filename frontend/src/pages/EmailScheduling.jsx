import { useState, useContext, useMemo } from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Switch, FormControlLabel, Chip } from '@mui/material';
import { Plus, Calendar, Clock, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { SearchContext } from '../context/SearchContext';
import GlassPanel from '../components/GlassPanel';

const scheduledEmails = [
  { id: 1, campaign: 'Q4 Flash Sale', recipients: 5240, scheduledTime: '2024-07-10 14:00', status: 'scheduled', timezone: 'EST' },
  { id: 2, campaign: 'Product Launch', recipients: 8120, scheduledTime: '2024-07-12 09:00', status: 'scheduled', timezone: 'PST' },
  { id: 3, campaign: 'Newsletter July', recipients: 12500, scheduledTime: '2024-07-08 10:00', status: 'sent', timezone: 'UTC' },
  { id: 4, campaign: 'Re-engagement', recipients: 3400, scheduledTime: '2024-07-15 16:00', status: 'scheduled', timezone: 'EST' },
  { id: 5, campaign: 'VIP Offer', recipients: 890, scheduledTime: '2024-07-11 12:00', status: 'scheduled', timezone: 'PST' }
];

export default function EmailScheduling() {
  const { searchQuery } = useContext(SearchContext);
  const [emails, setEmails] = useState(scheduledEmails);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEmail, setNewEmail] = useState({
    campaign: '',
    recipients: '',
    date: '',
    time: '',
    timezone: 'UTC',
    sendNow: false
  });

  const timezones = ['UTC', 'EST', 'CST', 'PST', 'GMT', 'IST'];

  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) return emails;
    const query = searchQuery.toLowerCase();
    return emails.filter(e => 
      e.campaign.toLowerCase().includes(query) ||
      e.status.toLowerCase().includes(query) ||
      e.timezone.toLowerCase().includes(query)
    );
  }, [emails, searchQuery]);

  const handleAddSchedule = () => {
    if (newEmail.campaign.trim() && newEmail.recipients && newEmail.date && newEmail.time) {
      if (editingId) {
        setEmails(emails.map(e => e.id === editingId ? {
          ...e,
          campaign: newEmail.campaign,
          recipients: parseInt(newEmail.recipients),
          scheduledTime: `${newEmail.date} ${newEmail.time}`,
          status: newEmail.sendNow ? 'sent' : 'scheduled',
          timezone: newEmail.timezone
        } : e));
      } else {
        setEmails([...emails, {
          id: Math.max(...emails.map(e => e.id), 0) + 1,
          campaign: newEmail.campaign,
          recipients: parseInt(newEmail.recipients),
          scheduledTime: `${newEmail.date} ${newEmail.time}`,
          status: newEmail.sendNow ? 'sent' : 'scheduled',
          timezone: newEmail.timezone
        }]);
      }
      setNewEmail({ campaign: '', recipients: '', date: '', time: '', timezone: 'UTC', sendNow: false });
      setEditingId(null);
      setOpenDialog(false);
    }
  };

  const handleEditSchedule = (email) => {
    const [date, time] = email.scheduledTime.split(' ');
    setNewEmail({
      campaign: email.campaign,
      recipients: email.recipients.toString(),
      date,
      time,
      timezone: email.timezone,
      sendNow: email.status === 'sent'
    });
    setEditingId(email.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setNewEmail({ campaign: '', recipients: '', date: '', time: '', timezone: 'UTC', sendNow: false });
  };

  const handleDeleteSchedule = (id) => {
    setEmails(emails.filter(e => e.id !== id));
  };

  return (
    <Box>
      <GlassPanel sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Calendar size={24} color="#00E5FF" />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Schedule Emails</Typography>
            </Stack>
            <Typography color="text.secondary">Plan and schedule your email campaigns</Typography>
          </Box>
          <Button
            onClick={() => setOpenDialog(true)}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', px: 3, borderRadius: 4, color: '#000', fontWeight: 600 }}
            startIcon={<Plus size={18} />}
          >
            Schedule Email
          </Button>
        </Stack>
      </GlassPanel>

      <Grid container spacing={2.5}>
        {filteredEmails.map((email) => (
          <Grid item xs={12} key={email.id}>
            <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{email.campaign}</Typography>
                      <Chip
                        size="small"
                        icon={email.status === 'sent' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        label={email.status === 'sent' ? 'Sent' : 'Scheduled'}
                        sx={{
                        background: email.status === 'sent' ? 'rgba(34,197,94,0.2)' : 'rgba(255,140,0,0.2)',
                        color: email.status === 'sent' ? '#86efac' : '#FFD700',
                        border: email.status === 'sent' ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,140,0,0.4)'
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={3}>
                      <Typography variant="body2" color="text.secondary">Recipients: <span style={{ color: '#fff', fontWeight: 600 }}>{email.recipients.toLocaleString()}</span></Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Clock size={14} color="#A7B4C8" />
                        <Typography variant="body2" color="text.secondary">{email.scheduledTime} ({email.timezone})</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleEditSchedule(email)} variant="outlined" startIcon={<Edit2 size={14} />} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Edit</Button>
                    <Button size="small" onClick={() => handleDeleteSchedule(email.id)} sx={{ color: '#ef4444' }} startIcon={<Trash2 size={14} />}>Delete</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { background: 'rgba(10,16,35,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>{editingId ? 'Edit Email Schedule' : 'Schedule Email Campaign'}</DialogTitle>
        <DialogContent sx={{ color: '#fff', pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Campaign Name"
              fullWidth
              value={newEmail.campaign}
              onChange={(e) => setNewEmail({ ...newEmail, campaign: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              label="Number of Recipients"
              type="number"
              value={newEmail.recipients}
              onChange={(e) => setNewEmail({ ...newEmail, recipients: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              label="Send Date"
              type="date"
              value={newEmail.date}
              onChange={(e) => setNewEmail({ ...newEmail, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              label="Send Time"
              type="time"
              value={newEmail.time}
              onChange={(e) => setNewEmail({ ...newEmail, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              select
              label="Timezone"
              value={newEmail.timezone}
              onChange={(e) => setNewEmail({ ...newEmail, timezone: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            >
              {timezones.map((tz) => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
            </TextField>
            <FormControlLabel
              control={<Switch checked={newEmail.sendNow} onChange={(e) => setNewEmail({ ...newEmail, sendNow: e.target.checked })} />}
              label="Send immediately"
              sx={{ color: '#fff' }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#fff' }}>Cancel</Button>
          <Button onClick={handleAddSchedule} variant="contained" sx={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', color: '#000', fontWeight: 600 }}>{editingId ? 'Update Schedule' : 'Schedule'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
