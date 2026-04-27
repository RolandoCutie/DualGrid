import { ImageResponse } from 'next/og';

import { getBaseUrl } from '@/lib/base-url';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const baseUrl = getBaseUrl();
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#ffffff',
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '60px',
        position: 'relative',
      }}
    >
      {/* Background glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.18)',
          filter: 'blur(90px)',
        }}
      />
      {/* Background glow bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'rgba(96, 165, 250, 0.12)',
          filter: 'blur(90px)',
        }}
      />
      {/* Subtle light vignette for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 10% 10%, rgba(0,0,0,0.02), transparent 12%, transparent 100%), radial-gradient(circle at 90% 90%, rgba(0,0,0,0.02), transparent 12%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          zIndex: 2,
        }}
      >
        {/* Green glow behind the logo to match the green brand */}
        <div
          style={{
            position: 'absolute',
            width: '380px',
            height: '220px',
            borderRadius: '140px',
            background:
              'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.22), rgba(34,197,94,0.08) 36%, transparent 60%)',
            filter: 'blur(56px)',
            top: '6%',
            zIndex: 1,
          }}
        />

        <img
          src={`${baseUrl}/icon.png`}
          alt="CubaWay"
          width={820}
          height={420}
          style={{
            display: 'block',
            objectFit: 'contain',
            background: 'transparent',
          }}
        />
      </div>

      {/* Accent line */}
      <div
        style={{
          width: '72px',
          height: '6px',
          background: 'linear-gradient(90deg, #16a34a, #22c55e)',
          borderRadius: '4px',
          marginTop: '8px',
          marginBottom: '16px',
          boxShadow: '0 6px 20px rgba(34,197,94,0.12)',
        }}
      />

      {/* Tagline */}
      <p
        style={{
          color: '#0f172a',
          fontSize: '28px',
          margin: 0,
          letterSpacing: '-0.01em',
          textAlign: 'center',
          maxWidth: '880px',
          fontWeight: 600,
          lineHeight: 1.18,
          // slight subtle letter shadow for crispness on some renderers
          textShadow: '0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        Premium Car Rental · Fast WhatsApp Booking
      </p>

      {/* URL */}
      <p
        style={{
          color: '#065f46',
          fontSize: '18px',
          margin: 0,
          marginTop: '30px',
          opacity: 0.95,
          fontWeight: 500,
        }}
      >
        cubaway.vercel.app
      </p>
    </div>,
    { ...size },
  );
}
