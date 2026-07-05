import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, Chip, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Eye, MousePointerClick, Mail } from 'lucide-react';
import { useRealtimeAnalytics } from '../hooks/useRealtime';
import GlassPanel from '../components/GlassPanel';

const analyticsData = [
  { name: 'Jan', opens: 3200, clicks: 1398, bounces: 240 },
  { name: 'Feb', opens: 4521, clicks: 2210, bounces: 290 },
  { name: 'Mar', opens: 6211, clicks: 2929, bounces: 200 },
  { name: 'Apr', opens: 7290, clicks: 3200, bounces: 221 },
  { name: 'May', opens: 8321, clicks: 3708, bounces: 250 },
  { name: 'Jun', opens: 9451, clicks: 4200, bounces: 210 }
];

const performanceData = [
  { name: 'Excellent', value: 45, fill: '#86efac' },
  { name: 'Good', value: 35, fill: '#FFD700' },
  { name: 'Needs Work', value: 20, fill: '#FF8C00' }
];

export default function Analytics() {
  const analyticsStream = useRealtimeAnalytics();
  const [metrics, setMetrics] = useState({
    totalOpens: 42987,
    totalClicks: 14645,
    avgOpenRate: 34.2,
    avgClickRate: 11.8
  });

  // Update metrics from real-time data
  useEffect(() => {
    if (analyticsStream.data) {
      setMetrics(prev => ({
        ...prev,
        totalOpens: analyticsStream.data.opens || prev.totalOpens,
        totalClicks: analyticsStream.data.clicks || prev.totalClicks,
        avgOpenRate: parseFloat((analyticsStream.data.opens / 125500 * 100).toFixed(1)) || prev.avgOpenRate,
        avgClickRate: parseFloat((analyticsStream.data.clicks / 125500 * 100).toFixed(1)) || prev.avgClickRate
      }));
    }
  }, [analyticsStream.data]);

  const statCards = [
    { label: 'Total Opens', value: metrics.totalOpens.toLocaleString(), icon: Eye, color: '#FFD700' },
    { label: 'Total Clicks', value: metrics.totalClicks.toLocaleString(), icon: MousePointerClick, color: '#FF8C00' },
    { label: 'Avg Open Rate', value: `${metrics.avgOpenRate}%`, icon: TrendingUp, color: '#86efac' },
    { label: 'Avg Click Rate', value: `${metrics.avgClickRate}%`, icon: Mail, color: '#93c5fd' }
  ];

  return (
    <Box>
      <GlassPanel sx={{ p: { xs: 3, md: 4 }, mb: 3, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(255,140,0,0.22), transparent 45%), radial-gradient(circle at bottom right, rgba(255,184,0,0.18), transparent 40%)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Analytics & Performance</Typography>
              <Typography color="text.secondary">Real-time email engagement metrics</Typography>
            </Box>
            <Chip 
              label={analyticsStream.connected ? "🔴 Live" : "⏸ Offline"} 
              sx={{ background: analyticsStream.connected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: analyticsStream.connected ? '#86efac' : '#ef4444' }}
            />
          </Stack>
        </Box>
      </GlassPanel>

      {/* Key Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                      <Icon size={18} color={stat.color} />
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Engagement Trends (Last 6 Months)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,140,0,0.3)', borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="opens" stroke="#FFD700" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#FF8C00" strokeWidth={2} />
                  <Line type="monotone" dataKey="bounces" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Email Quality Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={performanceData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
