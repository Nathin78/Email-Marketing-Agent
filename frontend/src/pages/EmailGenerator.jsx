import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, CircularProgress, Chip, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function EmailGenerator() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-email', data);
      setResult(res.data.data);
      toast.success('Email generated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI email generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>AI Email Generator</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card><CardContent><Typography variant="h6" gutterBottom>Campaign Inputs</Typography><form onSubmit={handleSubmit(onSubmit)}><Stack spacing={2}><TextField label="Campaign Name" {...register('campaignName')} /><TextField label="Product" {...register('product')} /><TextField label="Target Audience" {...register('targetAudience')} /><TextField label="Customer Name" {...register('customerName')} /><TextField label="Tone" {...register('tone')} /><TextField label="Language" {...register('language')} /><TextField label="Goal" {...register('goal')} /><Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Generate Email'}</Button></Stack></form></CardContent></Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card><CardContent>{result ? <Stack spacing={2}><Typography variant="h6">Generated Email</Typography><Alert severity="info">Score: {result.score}</Alert><Typography><strong>Subject:</strong> {result.subject}</Typography><Typography><strong>Preview:</strong> {result.preview}</Typography><Typography><strong>Body:</strong> {result.body}</Typography><Typography><strong>CTA:</strong> {result.cta}</Typography><Typography><strong>Spam Score:</strong> {result.spamScore}</Typography><Typography><strong>Readability:</strong> {result.readability}</Typography>{result.tips && <Box>{result.tips.split(',').map((tip, index) => <Chip key={index} label={tip.trim()} sx={{ mr: 1, mb: 1 }} />)}</Box>}</Stack> : <Typography color="text.secondary">Generate a personalized email using AI.</Typography>}</CardContent></Card>
        </Grid>
      </Grid>
    </Box>
  );
}
