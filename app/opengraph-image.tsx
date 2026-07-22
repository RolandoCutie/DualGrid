import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Brand palette
const CYAN = '#00d9ff';
const GREEN = '#00ff9d';
const NAVY = '#050912';
const CARD = '#0d1521';
const BORDER = '#1a2d42';
const TEXT = '#f1f5f9';
const MUTED = '#94a3b8';

const SERVICES = [
  { icon: '🌐', label: 'Landing Express' },
  { icon: '🖼️', label: 'Portafolio Pro' },
  { icon: '🍽️', label: 'Restaurante Pro' },
  { icon: '🛒', label: 'Tienda Online' },
  { icon: '✨', label: 'Sistema Custom' },
];

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: NAVY,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cyan glow top-left */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-60px',
          width: '600px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.22) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Green glow bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-80px',
          width: '650px',
          height: '550px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.24) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Grid dot pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.028,
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top gradient border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, transparent 0%, ${CYAN} 30%, ${GREEN} 70%, transparent 100%)`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '52px 64px 40px',
          position: 'relative',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '44px',
          }}
        >
          {/* Logo: SVG mark + brand name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* DualGrid interlocked circles mark */}
            <svg width="54" height="42" viewBox="18 18 68 50" style={{ display: 'flex' }}>
              <path fill={CYAN} d="M38.1,57.11c-.16.03-.34.03-.49.03v-.03h.49Z" />
              <path
                fill={CYAN}
                d="M56.82,47.6v19.11h-19.14c-10.56,0-19.14-8.55-19.14-19.11s8.57-19.14,19.14-19.14h9.58v9.55h-9.58c-5.28,0-9.55,4.3-9.55,9.58s4.27,9.55,9.55,9.55c.16,0,.34,0,.49-.03h9.09v-9.53h9.55Z"
              />
              <path
                fill={GREEN}
                d="M47.26,38.02v-19.11h19.14c10.56,0,19.14,8.55,19.14,19.11s-8.57,19.14-19.14,19.14h-9.58v-9.55h9.58c5.28,0,9.55-4.3,9.55-9.58s-4.27-9.55-9.55-9.55c-.16,0-.34,0-.49.03h-9.09v9.53h-9.55Z"
              />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span
                style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: TEXT,
                  lineHeight: 1,
                }}
              >
                <span style={{ color: CYAN }}>Dual</span>
                <span style={{ color: GREEN }}>Grid</span>
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: MUTED,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                }}
              >
                Studio
              </span>
            </div>
          </div>

          {/* URL badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              background: 'rgba(0,217,255,0.08)',
              border: '1px solid rgba(0,217,255,0.28)',
              borderRadius: '24px',
              padding: '9px 22px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: CYAN,
                boxShadow: `0 0 10px ${CYAN}`,
              }}
            />
            <span
              style={{ color: CYAN, fontSize: '15px', fontWeight: 600, letterSpacing: '0.4px' }}
            >
              dualgrid.studio
            </span>
          </div>
        </div>

        {/* Hero headline */}
        <div
          style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: GREEN,
                boxShadow: `0 0 12px ${GREEN}`,
              }}
            />
            <span
              style={{
                color: GREEN,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '3.5px',
                textTransform: 'uppercase',
              }}
            >
              Agencia de desarrollo web
            </span>
          </div>

          <h1
            style={{
              color: TEXT,
              fontSize: '72px',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              margin: 0,
              lineHeight: 1.0,
            }}
          >
            Sitios web que
          </h1>
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              margin: 0,
              lineHeight: 1.05,
              color: CYAN,
            }}
          >
            convierten visitas
          </h1>
          <h1
            style={{
              color: TEXT,
              fontSize: '72px',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              margin: 0,
              lineHeight: 1.0,
            }}
          >
            en clientes
          </h1>

          <p
            style={{
              color: MUTED,
              fontSize: '20px',
              fontWeight: 400,
              margin: '22px 0 0',
              lineHeight: 1.5,
              maxWidth: '680px',
            }}
          >
            Diseño 100% personalizado · Código limpio y seguro · Soporte directo por WhatsApp
          </p>
        </div>

        {/* Services strip */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          {SERVICES.map((s) => (
            <div
              key={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: '10px',
                padding: '11px 16px',
                flex: 1,
              }}
            >
              <span style={{ fontSize: '16px' }}>{s.icon}</span>
              <span
                style={{ color: TEXT, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
