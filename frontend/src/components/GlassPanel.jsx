import { Box } from '@mui/material';

export default function GlassPanel({ children, sx = {}, ...props }) {
  return (
    <Box
      {...props}
      sx={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        borderRadius: 4,
        boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
        ...sx
      }}
    >
      {children}
    </Box>
  );
}
