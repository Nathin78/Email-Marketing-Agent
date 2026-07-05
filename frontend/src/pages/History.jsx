import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import api from '../services/api';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await api.get('/history');
      setItems(res.data.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const handleDelete = async (id) => {
    await api.delete(`/history/${id}`);
    loadHistory();
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>History</Typography>
      <Card><CardContent><Table><TableHead><TableRow><TableCell>Subject</TableCell><TableCell>Preview</TableCell><TableCell>Score</TableCell><TableCell>Actions</TableCell></TableRow></TableHead><TableBody>{items.map(item => <TableRow key={item.id}><TableCell>{item.subject}</TableCell><TableCell>{item.preview}</TableCell><TableCell>{item.score}</TableCell><TableCell><IconButton onClick={() => handleDelete(item.id)}><Delete /></IconButton></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    </Box>
  );
}
