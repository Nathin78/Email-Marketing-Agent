import { AppBar, Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, TextField, Popover, Badge, List as MuiList, ListItem } from '@mui/material';
import { Sparkles, RadioTower, Users, LineChart, History, LayoutGrid, Settings, Search, Bell, MoonStar, Sun, Zap, ChevronRight, PenTool, LogOut, X, FileText, Calendar, Activity } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { SearchContext } from '../context/SearchContext';
import AuroraBackground from '../components/AuroraBackground';
import GlassPanel from '../components/GlassPanel';
import FloatingChatbot from '../components/FloatingChatbot';
import { useRealtimeNotifications } from '../hooks/useRealtime';

const drawerWidth = 260;
const items = [
  ['Dashboard', '/dashboard', <LayoutGrid size={18} />],
  ['AI Email Studio', '/generate', <Sparkles size={18} />],
  ['Campaigns', '/campaigns', <PenTool size={18} />],
  ['Email Templates', '/templates', <FileText size={18} />],
  ['Schedule Emails', '/schedule', <Calendar size={18} />],
  ['Deliverability', '/deliverability', <Activity size={18} />],
  ['Customers', '/customers', <Users size={18} />],
  ['Analytics', '/analytics', <LineChart size={18} />],
  ['History', '/history', <History size={18} />],
  ['Settings', '/settings', <Settings size={18} />]
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const notificationStream = useRealtimeNotifications();
  const [darkMode, setDarkMode] = useState(true);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Campaign "Q4 Sales" sent successfully', time: '2 mins ago', type: 'success' },
    { id: 2, message: 'New customer added: Acme Corp', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'Your AI analysis is ready', time: '3 hours ago', type: 'info' }
  ]);

  // Update notifications from real-time stream
  useEffect(() => {
    if (notificationStream.data) {
      const newNotif = {
        id: notifications.length + 1,
        message: notificationStream.data.message || 'New notification',
        time: 'Just now',
        type: notificationStream.data.severity || 'info'
      };
      setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
    }
  }, [notificationStream.data]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNotificationClick = (e) => {
    setNotifAnchor(e.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotifAnchor(null);
  };

  const notifOpen = Boolean(notifAnchor);
  const notifId = notifOpen ? 'notification-popover' : undefined;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0F0F0F', color: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
      <AuroraBackground />
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)', borderRight: '2px solid #FF8C00', backdropFilter: 'blur(24px)' } }}>
        <Toolbar />
        <Box sx={{ p: 2.5 }}>
          <GlassPanel sx={{ p: 2.5, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5, background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.3)' }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '14px', background: 'linear-gradient(135deg,#FF8C00,#FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={18} color="#000" /></Box>
            <Box><Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Nexora AI</Typography><Typography variant="caption" color="text.secondary">Smart Email Marketing</Typography></Box>
          </GlassPanel>
          <List sx={{ mt: 2 }}>
            {items.map(([label, path, icon]) => {
              const active = location.pathname === path;
              return (
                <ListItemButton key={label} component={Link} to={path} sx={{ borderRadius: 3, mb: 0.6, px: 1.5, py: 1, color: active ? '#fff' : '#A7B4C8', background: active ? 'linear-gradient(90deg, rgba(255,140,0,0.24), rgba(255,184,0,0.14))' : 'transparent', border: active ? '1px solid rgba(255,140,0,0.3)' : '1px solid transparent', '&:hover': { background: 'rgba(255,140,0,0.08)' } }}>
                  <ListItemIcon sx={{ minWidth: 34, color: active ? '#FFD700' : '#A7B4C8' }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
                  {active && <ChevronRight size={16} />}
                </ListItemButton>
              );
            })}
          </List>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,140,0,0.2)' }} />
          <GlassPanel sx={{ p: 2, background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}>
            <Typography variant="caption" color="text.secondary">AI STATUS</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700, color: '#FFD700' }}>Systems online</Typography>
            <Box sx={{ mt: 1.5, height: 6, borderRadius: 999, background: 'rgba(255,140,0,0.2)', overflow: 'hidden' }}><Box sx={{ width: '82%', height: '100%', background: 'linear-gradient(90deg,#FF8C00,#FFD700)' }} /></Box>
          </GlassPanel>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
        <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none', mb: 2 }}><Toolbar disableGutters sx={{ gap: 1.5 }}>
          <GlassPanel sx={{ flex: 1, px: 2, py: 0.8, display: 'flex', alignItems: 'center', gap: 1, background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}>
            <Search size={18} color="#FF8C00" />
            <TextField 
              placeholder="Search campaigns, customers, ideas…" 
              value={searchQuery}
              onChange={handleSearch}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
              sx={{ '& input': { color: '#FFB800', fontSize: 14, '&::placeholder': { color: '#A7B4C8', opacity: 1 } } }}
            />
          </GlassPanel>
          <Badge badgeContent={notifications.length} color="primary" overlap="circular">
            <IconButton 
              aria-describedby={notifId}
              onClick={handleNotificationClick}
              sx={{ color: notificationStream.connected ? '#86efac' : '#FF8C00', background: notificationStream.connected ? 'rgba(134,239,172,0.1)' : 'rgba(255,140,0,0.1)', border: notificationStream.connected ? '1px solid rgba(134,239,172,0.3)' : '1px solid rgba(255,140,0,0.3)', position: 'relative' }}
            >
              <Bell size={18} />
              {notificationStream.connected && <Box sx={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: '#86efac', animation: 'pulse 2s infinite' }} />}
            </IconButton>
          </Badge>
          <Popover
            id={notifId}
            open={notifOpen}
            anchorEl={notifAnchor}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { background: 'rgba(26,26,26,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,140,0,0.2)', mt: 1 } }}
          >
            <Box sx={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,140,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFD700' }}>Notifications {notificationStream.connected && <span style={{ color: '#86efac', fontSize: '12px', marginLeft: '4px' }}>🔴 Live</span>}</Typography>
                <IconButton size="small" onClick={handleNotificationClose}><X size={16} /></IconButton>
              </Box>
              <MuiList>
                {notifications.map((notif) => {
                  const getTypeColor = (type) => {
                    switch (type) {
                      case 'success': return '#86efac';
                      case 'error': return '#ef4444';
                      case 'warning': return '#FFD700';
                      default: return '#93c5fd';
                    }
                  };
                  return (
                    <ListItem key={notif.id} sx={{ py: 1.5, px: 2, borderBottom: '1px solid rgba(255,140,0,0.1)', '&:hover': { background: 'rgba(255,140,0,0.08)' }, borderLeft: `3px solid ${getTypeColor(notif.type)}` }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#fff' }}>{notif.message}</Typography>
                        <Typography variant="caption" color="text.secondary">{notif.time}</Typography>
                      </Box>
                    </ListItem>
                  );
                })}
              </MuiList>
            </Box>
          </Popover>
          <IconButton 
            onClick={() => setDarkMode(!darkMode)}
            sx={{ color: '#FFD700', background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)' }}
          >
            {darkMode ? <Sun size={18} /> : <MoonStar size={18} />}
          </IconButton>
          <IconButton onClick={handleLogout} sx={{ color: '#FF8C00', background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.3)' }}><LogOut size={18} /></IconButton>
          <GlassPanel sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', gap: 1, background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF8C00' }}>{user?.name?.[0] || 'U'}</Avatar>
            <Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.name || 'User'}</Typography><Typography variant="caption" color="text.secondary">Premium</Typography></Box>
          </GlassPanel>
        </Toolbar></AppBar>
        {children}
        <FloatingChatbot />
      </Box>
    </Box>
  );
}
