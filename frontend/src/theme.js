import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#070B16', paper: '#111827' },
    primary: { main: '#8B5CF6' },
    secondary: { main: '#00E5FF' },
    success: { main: '#7CFF6B' },
    warning: { main: '#FBBF24' },
    error: { main: '#FF5A5F' },
    text: { primary: '#F8FAFC', secondary: '#A7B4C8' }
  },
  shape: { borderRadius: 22 },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontFamily: 'Space Grotesk, sans-serif' },
    h2: { fontFamily: 'Space Grotesk, sans-serif' },
    h3: { fontFamily: 'Space Grotesk, sans-serif' },
    h4: { fontFamily: 'Space Grotesk, sans-serif' },
    h5: { fontFamily: 'Space Grotesk, sans-serif' },
    h6: { fontFamily: 'Space Grotesk, sans-serif' },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=Manrope:wght@500;700&display=swap');
        body { background: #070B16; color: #F8FAFC; }
        * { box-sizing: border-box; }
      `
    },
    MuiCard: { styleOverrides: { root: { backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 18, boxShadow: 'none', padding: '10px 18px' } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 16, background: 'rgba(255,255,255,0.04)' } } } }
  }
});
