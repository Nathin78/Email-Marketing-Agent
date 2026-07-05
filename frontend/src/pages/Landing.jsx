import { Box, Button, Chip, Container, Grid, Stack, Typography, Card, CardContent } from '@mui/material';
import { ArrowRight, BarChart3, MailCheck, Sparkles, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: <Sparkles size={18} />, title: 'AI-crafted campaigns', text: 'Generate persuasive emails, subject lines, and CTAs with one prompt.' },
  { icon: <Users size={18} />, title: 'Customer intelligence', text: 'Organize contacts and tailor every send to the right audience.' },
  { icon: <BarChart3 size={18} />, title: 'Live performance', text: 'Track engagement and optimize your outreach with real-time insight.' }
];

export default function Landing() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, rgba(255,140,0,0.25), transparent 35%), linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)', color: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,140,0,0.18), transparent 24%), radial-gradient(circle at 80% 10%, rgba(255,184,0,0.24), transparent 20%)', pointerEvents: 'none' }} />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3} sx={{ mb: 6 }}>
          <Box>
            <Chip icon={<Zap size={14} />} label="Nexora AI" sx={{ mb: 2, background: 'rgba(255,140,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,140,0,0.3)' }} />
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.05, maxWidth: 680 }}>
              Turn every email into a high-converting conversation.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, maxWidth: 620 }}>
              Launch AI-powered campaigns, manage prospects, and deliver smarter outreach from one premium command center.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={Link} to="/login" variant="contained" size="large" sx={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', px: 3, py: 1.2, borderRadius: 999, color: '#000', fontWeight: 600 }} endIcon={<ArrowRight size={18} />}>
              Sign in
            </Button>
            <Button component={Link} to="/signup" variant="outlined" size="large" sx={{ borderColor: 'rgba(255,140,0,0.5)', color: '#FFD700', px: 3, py: 1.2, borderRadius: 999, '&:hover': { borderColor: '#FF8C00', background: 'rgba(255,140,0,0.08)' } }}>
              Create account
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 60px rgba(0,0,0,0.24)' }}>
                <CardContent>
                  <Box sx={{ width: 42, height: 42, borderRadius: '14px', background: 'linear-gradient(135deg, rgba(139,92,246,0.24), rgba(0,229,255,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{feature.title}</Typography>
                  <Typography color="text.secondary">{feature.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ p: { xs: 3, md: 4 }, background: 'rgba(10,16,35,0.72)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Ready to launch your next campaign?</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.8 }}>Sign in to start generating emails, managing customers, and tracking results.</Typography>
            </Box>
            <Button component={Link} to="/login" variant="contained" sx={{ background: 'linear-gradient(135deg,#8B5CF6,#00E5FF)', borderRadius: 999, px: 3 }}>
              Open workspace
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
