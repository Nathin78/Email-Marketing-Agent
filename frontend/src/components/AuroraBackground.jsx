export default function AuroraBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.28), transparent 70%)', filter: 'blur(30px)', top: '8%', left: '-5%', animation: 'float 14s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,77,158,0.24), transparent 70%)', filter: 'blur(30px)', top: '16%', right: '8%', animation: 'float 16s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.22), transparent 70%)', filter: 'blur(32px)', bottom: '4%', left: '20%', animation: 'float 18s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,255,107,0.16), transparent 70%)', filter: 'blur(24px)', bottom: '10%', right: '18%', animation: 'float 12s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.08 }} />
      <style>{`@keyframes float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(24px,-18px,0)}}`}</style>
    </div>
  );
}
