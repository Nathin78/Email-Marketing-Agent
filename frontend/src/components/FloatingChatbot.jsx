import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { Bot, Send, Sparkles, X, Copy, RotateCcw } from 'lucide-react';
import api from '../services/api';

const suggestions = ['Generate a marketing email', 'Rewrite this email', 'Improve subject line', 'Analyze campaign'];

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am Nexora AI. Ask me to draft emails, improve copy, translate, or suggest strategy.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const getDemoResponse = (userPrompt) => {
    const responses = {
      'generate a marketing email': 'Subject: Unlock Your Potential Today 🚀\n\nHi there,\n\nWe\'ve noticed you\'re interested in maximizing your email campaigns. Our AI-powered platform helps create personalized emails that convert.\n\nWith Nexora, you can:\n✓ Generate high-converting copy in seconds\n✓ Personalize at scale\n✓ Track performance in real-time\n\nReady to transform your email marketing?',
      'rewrite this email': 'Here\'s a more engaging version:\n\nSubject: Your Exclusive Offer Awaits ✨\n\nWe\'re thrilled to share something special just for you.\n\nOur latest campaign shows a 40% open rate increase when using personalized subject lines like this one. Let\'s boost your engagement together!',
      'improve subject line': '5 Subject Line Options:\n\n1. "Nexora AI: 40% More Opens (Guaranteed)" — Direct & Proven\n2. "Your Emails Just Got Smarter 🤖" — Curiosity-Driven\n3. "[Action Required] See Your Personalization Score" — Urgency\n4. "Join 10K+ Marketers Using AI Emails" — Social Proof\n5. "3-Minute Setup: Your First AI Email Awaits" — Ease\n\nTip: Test all 5 variations with Nexora\'s built-in A/B testing!',
      'analyze campaign': 'Campaign Analysis:\n\n📊 Performance Metrics:\n• Open Rate: 34.2% (Benchmark: 28%)\n• Click Rate: 8.7% (Benchmark: 5.2%)\n• Conversion: 2.1% (Benchmark: 1.8%)\n\n✅ Strengths:\n- Subject line resonates with audience\n- CTA placement is optimal\n- Personalization tokens working well\n\n⚠️ Opportunities:\n- Consider A/B testing send time\n- Mobile optimization needed\n- Footer links underperforming\n\n💡 Recommendation: Focus on mobile experience for 15% improvement.'
    };

    const lowerPrompt = userPrompt.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerPrompt.includes(key)) return response;
    }

    return `That's a great question! I'm running in demo mode right now, so I can use our template responses.\n\nFor personalized AI assistance, make sure the backend API is connected. You can still:\n✓ Test my chat interface\n✓ Try: "Generate a marketing email"\n✓ Try: "Improve subject line"\n✓ Try: "Analyze campaign"\n\nWhat would you like help with?`;
  };

  const sendMessage = async (prompt = input) => {
    if (!prompt?.trim()) return;
    const nextMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: prompt });
      const assistantText = res.data?.data?.response ?? 'Nexora did not return a reply.';
      setMessages([...nextMessages, { role: 'assistant', content: assistantText }]);
    } catch (error) {
      // Fallback to demo responses when API fails
      const demoResponse = getDemoResponse(prompt);
      setMessages([...nextMessages, { role: 'assistant', content: demoResponse }]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const panel = useMemo(() => (
    <Paper elevation={8} sx={{ position: 'fixed', bottom: 24, right: 24, width: { xs: 'calc(100% - 32px)', sm: 400 }, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,140,0,0.3)', background: 'rgba(26,26,26,0.84)', backdropFilter: 'blur(24px)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', zIndex: 1400 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,140,0,0.2)', background: 'linear-gradient(135deg, rgba(255,140,0,0.24), rgba(255,184,0,0.16))' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>
              <Bot size={18} color="#000" />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Nexora AI</Typography>
              <Typography variant="caption" color="text.secondary">Marketing assistant online</Typography>
            </Box>
          </Stack>
          <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff' }}><X size={18} /></IconButton>
        </Stack>
      </Box>
      <Box sx={{ height: 360, overflowY: 'auto', p: 2, background: 'rgba(255,140,0,0.03)' }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ mb: 1.5, display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <Box sx={{ maxWidth: '85%', p: 1.5, borderRadius: 2.5, background: message.role === 'user' ? 'linear-gradient(135deg, #FF8C00, #FFD700)' : 'rgba(255,140,0,0.08)', border: message.role === 'user' ? 'none' : '1px solid rgba(255,140,0,0.2)' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: message.role === 'user' ? '#000' : '#fff' }}>{message.content}</Typography>
              {message.role === 'assistant' && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <IconButton size="small" onClick={() => copyMessage(message.content)}><Copy size={14} /></IconButton>
                  <IconButton size="small" onClick={() => sendMessage(message.content)}><RotateCcw size={14} /></IconButton>
                </Stack>
              )}
            </Box>
          </Box>
        ))}
        {loading && <Typography variant="body2" color="text.secondary">Nexora is typing…</Typography>}
        <div ref={endRef} />
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.4, flexWrap: 'wrap' }}>
          {suggestions.map((suggestion) => (
            <Chip key={suggestion} label={suggestion} onClick={() => sendMessage(suggestion)} variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer' }} />
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField fullWidth size="small" placeholder="Ask Nexora AI" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
          <Button variant="contained" onClick={() => sendMessage()} disabled={loading} sx={{ minWidth: 48, px: 1.5, background: 'linear-gradient(135deg,#FF8C00,#FFD700)', color: '#000' }}><Send size={16} /></Button>
        </Stack>
      </Box>
    </Paper>
  ), [copyMessage, input, loading, messages, sendMessage]);

  return (
    <Box>
      {!open ? (
        <IconButton onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 24, right: 24, width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#FF8C00,#FFD700)', color: '#000', boxShadow: '0 16px 40px rgba(255,140,0,0.3)', zIndex: 1400, fontWeight: 600 }}>
          <Sparkles size={22} />
        </IconButton>
      ) : panel}
    </Box>
  );
}
