import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#fafafa',
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.15)',
          filter: 'blur(100px)',
        }}
      />
      {/* Glow bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(139,92,246,0.10)',
          filter: 'blur(100px)',
        }}
      />

      {/* Logo badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: '#6366f1',
          marginBottom: '28px',
          boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
        }}
      >
        <span style={{ color: '#fff', fontSize: '38px', fontWeight: 800, letterSpacing: '-1px' }}>
          DG
        </span>
      </div>

      {/* Brand name */}
      <h1
        style={{
          color: '#18181b',
          fontSize: '68px',
          fontWeight: 800,
          letterSpacing: '-2px',
          margin: 0,
          lineHeight: 1,
        }}
      >
        DualGrid
      </h1>

      {/* Accent line */}
      <div
        style={{
          width: '60px',
          height: '5px',
          background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
          borderRadius: '4px',
          margin: '20px 0',
        }}
      />

      {/* Tagline */}
      <p
        style={{
          color: '#52525b',
          fontSize: '30px',
          fontWeight: 500,
          margin: 0,
          textAlign: 'center',
          maxWidth: '760px',
          lineHeight: 1.3,
        }}
      >
        Sitios web que convierten visitas en clientes.
      </p>

      {/* URL label */}
      <p
        style={{
          color: '#6366f1',
          fontSize: '18px',
          margin: 0,
          marginTop: '32px',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        dualgrid.studio
      </p>
    </div>,
    { ...size },
  );
}
