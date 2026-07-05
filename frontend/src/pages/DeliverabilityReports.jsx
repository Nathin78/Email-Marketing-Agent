import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Mail, AlertTriangle, CheckCircle, Activity, ArrowUp } from 'lucide-react';
import GlassPanel from '../components/GlassPanel';
import { useRealtimeDeliverability } from '../hooks/useRealtime';

const deliverabilityData = [
  { date: 'Jul 1', delivered: 8500, bounced: 120, spam: 45 },
  { date: 'Jul 2', delivered: 9200, bounced: 98, spam: 32 },
  { date: 'Jul 3', delivered: 8800, bounced: 150, spam: 58 },
  { date: 'Jul 4', delivered: 9500, bounced: 110, spam: 40 },
  { date: 'Jul 5', delivered: 9100, bounced: 125, spam: 52 },
  { date: 'Jul 6', delivered: 9800, bounced: 88, spam: 35 },
  { date: 'Jul 7', delivered: 10200, bounced: 140, spam: 48 }
];

const spamScoreData = [
  { name: 'Clean', value: 87, fill: '#86efac' },
  { name: 'Warning', value: 10, fill: '#FFD700' },
  { name: 'Risk', value: 3, fill: '#ef4444' }
];

const bounceReasons = [
  { reason: 'Invalid Email', count: 245, percentage: 29.5 },
  { reason: 'Mailbox Full', count: 189, percentage: 22.7 },
  { reason: 'Domain Issues', count: 156, percentage: 18.8 },
  { reason: 'Server Rejection', count: 134, percentage: 16.1 },
  { reason: 'User Unknown', count: 107, percentage: 12.9 }
];

export default function DeliverabilityReports() {
  const deliverabilityStream = useRealtimeDeliverability();
  const [metrics, setMetrics] = useState({
    delivered: 65692,
    bounced: 831,
    spam: 310,
    openRate: 34.2
  });

  // Update metrics from real-time data
  useEffect(() => {
    if (deliverabilityStream.data) {
      setMetrics(prev => ({
        delivered: deliverabilityStream.data.delivered || prev.delivered,
        bounced: deliverabilityStream.data.bounced || prev.bounced,
        spam: deliverabilityStream.data.spam || prev.spam,
        openRate: prev.openRate
      }));
    }
  }, [deliverabilityStream.data]);

  const stats = [
    { label: 'Delivered', value: metrics.delivered.toLocaleString(), icon: CheckCircle, color: '#86efac', change: '+2.4%' },
    { label: 'Bounced', value: metrics.bounced.toLocaleString(), icon: AlertTriangle, color: '#FFD700', change: '-0.8%' },
    { label: 'Spam Reports', value: metrics.spam.toLocaleString(), icon: AlertTriangle, color: '#ef4444', change: '+1.2%' },
    { label: 'Open Rate', value: `${metrics.openRate}%`, icon: Mail, color: '#93c5fd', change: '+4.1%' }
  ];

  return (
    <Box>
      <GlassPanel sx={{ p: { xs: 3, md: 4 }, mb: 3, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(255,140,0,0.22), transparent 45%), radial-gradient(circle at bottom right, rgba(255,184,0,0.18), transparent 40%)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Activity size={24} color="#FF8C00" />
                <Typography variant="h3" sx={{ fontWeight: 800 }}>Deliverability Reports</Typography>
              </Stack>
              <Typography color="text.secondary">Monitor email delivery performance and health with live metrics</Typography>
            </Box>
            <Chip 
              label={deliverabilityStream.connected ? "🔴 Live" : "⏸ Offline"}
              sx={{ background: deliverabilityStream.connected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: deliverabilityStream.connected ? '#86efac' : '#ef4444' }}
            />
          </Stack>
        </Box>
      </GlassPanel>

      {/* Key Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {stats.map((stat, idx) => {
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
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <ArrowUp size={14} color={stat.change.includes('-') ? '#ef4444' : stat.color} />
                      <Typography variant="caption" sx={{ color: stat.change.includes('-') ? '#ef4444' : stat.color }}>{stat.change}</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Delivery Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Delivery Trend (Last 7 Days)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={deliverabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,140,0,0.3)', borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="delivered" stroke="#86efac" strokeWidth={2} dot={{ fill: '#86efac' }} />
                  <Line type="monotone" dataKey="bounced" stroke="#FFD700" strokeWidth={2} dot={{ fill: '#FFD700' }} />
                  <Line type="monotone" dataKey="spam" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Spam Score Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Email Quality Distribution</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={spamScoreData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    {spamScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,140,0,0.3)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {spamScoreData.map((item) => (
                  <Stack direction="row" justifyContent="space-between" key={item.name}>
                    <Typography variant="body2" color="text.secondary">{item.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: item.fill }}>{item.value}%</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bounce Reasons */}
      <Card sx={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.1)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Top Bounce Reasons</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bounceReasons}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="reason" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,140,0,0.3)', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#FF8C00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {bounceReasons.map((item, idx) => (
              <Stack direction="row" justifyContent="space-between" alignItems="center" key={idx}>
                <Typography variant="body2">{item.reason}</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 150, height: 6, borderRadius: 999, background: 'rgba(255,140,0,0.2)', overflow: 'hidden' }}>
                    <Box sx={{ width: `${item.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #FF8C00, #FFD700)' }} />
                  </Box>
                  <Typography variant="caption" sx={{ minWidth: 50, textAlign: 'right' }}>{item.percentage}%</Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
