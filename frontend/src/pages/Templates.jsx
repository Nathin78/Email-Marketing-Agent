import { useState, useContext, useMemo } from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Plus, Copy, Trash2, Edit2, FileText } from 'lucide-react';
import { SearchContext } from '../context/SearchContext';
import GlassPanel from '../components/GlassPanel';

const defaultTemplates = [
  { id: 1, name: 'Welcome Series', category: 'Welcome', preview: 'Welcome to our community...', created: '2 weeks ago', uses: 245 },
  { id: 2, name: 'Product Update', category: 'Product', preview: 'Check out our latest features...', created: '1 month ago', uses: 189 },
  { id: 3, name: 'Re-engagement', category: 'Retention', preview: 'We miss you! Come back...', created: '3 weeks ago', uses: 67 },
  { id: 4, name: 'Flash Sale', category: 'Promotion', preview: '24-hour limited offer...', created: '5 days ago', uses: 412 },
  { id: 5, name: 'Newsletter', category: 'Newsletter', preview: 'This month\'s highlights...', created: '1 week ago', uses: 156 },
  { id: 6, name: 'Event Invitation', category: 'Event', preview: 'Join us for an exclusive event...', created: '2 days ago', uses: 89 }
];

export default function Templates() {
  const { searchQuery } = useContext(SearchContext);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', category: 'Custom', preview: '' });

  const categories = ['Welcome', 'Product', 'Retention', 'Promotion', 'Newsletter', 'Event', 'Custom'];

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const query = searchQuery.toLowerCase();
    return templates.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.preview.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  const handleAddTemplate = () => {
    if (newTemplate.name.trim()) {
      if (editingId) {
        setTemplates(templates.map(t => t.id === editingId ? {
          ...t,
          ...newTemplate
        } : t));
      } else {
        setTemplates([...templates, {
          id: Math.max(...templates.map(t => t.id), 0) + 1,
          ...newTemplate,
          created: 'just now',
          uses: 0
        }]);
      }
      setNewTemplate({ name: '', category: 'Custom', preview: '' });
      setEditingId(null);
      setOpenDialog(false);
    }
  };

  const handleEditTemplate = (template) => {
    setNewTemplate({
      name: template.name,
      category: template.category,
      preview: template.preview
    });
    setEditingId(template.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setNewTemplate({ name: '', category: 'Custom', preview: '' });
  };

  const handleDuplicateTemplate = (template) => {
    setTemplates([...templates, {
      id: Math.max(...templates.map(t => t.id), 0) + 1,
      name: `${template.name} (Copy)`,
      category: template.category,
      preview: template.preview,
      created: 'just now',
      uses: 0
    }]);
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <Box>
      <GlassPanel sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <FileText size={24} color="#00E5FF" />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Email Templates</Typography>
            </Stack>
            <Typography color="text.secondary">Browse and manage your email templates</Typography>
          </Box>
          <Button
            onClick={() => setOpenDialog(true)}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', px: 3, borderRadius: 4, color: '#000', fontWeight: 600 }}
            startIcon={<Plus size={18} />}
          >
            New Template
          </Button>
        </Stack>
      </GlassPanel>

      <Grid container spacing={2.5}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{template.name}</Typography>
                    <Box sx={{ display: 'inline-block', px: 1.2, py: 0.4, borderRadius: 1.5, background: 'rgba(255,140,0,0.2)', border: '1px solid rgba(255,140,0,0.4)' }}>
                      <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600 }}>{template.category}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>{template.preview}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="caption" color="text.secondary">{template.uses} uses</Typography>
                    <Typography variant="caption" color="text.secondary">{template.created}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleDuplicateTemplate(template)} variant="outlined" startIcon={<Copy size={14} />} sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Duplicate</Button>
                    <Button size="small" onClick={() => handleEditTemplate(template)} variant="outlined" startIcon={<Edit2 size={14} />} sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Edit</Button>
                    <Button size="small" onClick={() => handleDeleteTemplate(template.id)} sx={{ p: 1, minWidth: 'auto', color: '#ef4444' }}><Trash2 size={14} /></Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { background: 'rgba(10,16,35,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>{editingId ? 'Edit Template' : 'Create New Template'}</DialogTitle>
        <DialogContent sx={{ color: '#fff', pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Template Name"
              fullWidth
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              select
              label="Category"
              value={newTemplate.category}
              onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            >
              {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </TextField>
            <TextField
              label="Preview Text"
              multiline
              rows={3}
              fullWidth
              value={newTemplate.preview}
              onChange={(e) => setNewTemplate({ ...newTemplate, preview: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#fff' }}>Cancel</Button>
          <Button onClick={handleAddTemplate} variant="contained" sx={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', color: '#000', fontWeight: 600 }}>{editingId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
