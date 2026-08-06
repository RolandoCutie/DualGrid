import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CYAN = '#00d9ff';
const GREEN = '#00ff9d';
const NAVY = '#050912';
const CARD = '#0d1521';
const BORDER = '#1a2d42';
const TEXT = '#f1f5f9';
const MUTED = '#94a3b8';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${NAVY} 0%, #0a1a2e 100%)`,
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
            background: `radial-gradient(ellipse at center, rgba(0,217,255,0.22) 0%, transparent 65%)`,
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
            background: `radial-gradient(ellipse at center, rgba(0,255,157,0.24) 0%, transparent 65%)`,
            filter: 'blur(70px)',
          }}
        />

        {/* Grid dot pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: `radial-gradient(circle, ${TEXT} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, transparent 0%, ${CYAN} 25%, ${GREEN} 75%, transparent 100%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '60px 80px',
            position: 'relative',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo + Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 57.55 57.55"
                width="62"
                height="62"
                style={{ display: 'flex', alignItems: 'center' }}
              >

                <path
                  fill="#00d9ff"
                  d="M18.72 38.49v9.62H9.14C-2.54 48.11-2.54 29.0 9.14 29h9.58v9.55H9.14c-5.28 0-9.55 4.3-9.55 9.58s4.27 9.55 9.55 9.55c.16 0 .34 0 .49-.03h9.09v-9.53h9.55v19.11H9.14C-1.42 67.23-10 58.68-10 48.11s8.57-19.14 19.14-19.14h9.58v9.55z"
                />

                <path
                  fill="#00ff9d"
                  d="M28.27 19.02V-.09h19.14c10.56 0 19.14 8.55 19.14 19.11s-8.57 19.14-19.14 19.14h-9.58v-9.55h9.58c5.28 0 9.55-4.3 9.55-9.58s-4.27-9.55-9.55-9.55c-.16 0-.34 0-.49.03h-9.09v9.53h-9.55z"
                />
              </svg>
              {/* Brand text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '36px', fontWeight: 900, color: TEXT }}>
                  <span style={{ color: GREEN }}>Dual</span>
                  <span style={{ color: CYAN }}>Grid</span>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: MUTED,
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Studio
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                borderRadius: '28px',
                border: `1.5px solid ${CYAN}`,
                background: `rgba(0,217,255,0.08)`,
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: GREEN,
                  boxShadow: `0 0 12px ${GREEN}`,
                }}
              />
              <span style={{ color: CYAN, fontSize: '14px', fontWeight: 700 }}>
                dualgrid.io
              </span>
            </div>
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: GREEN,
                  boxShadow: `0 0 12px ${GREEN}`,
                }}
              />
              <span
                style={{
                  color: GREEN,
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                }}
              >
                Desarrollo Web Profesional
              </span>
            </div>

            {/* Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <h1
                style={{
                  fontSize: '68px',
                  fontWeight: 900,
                  color: TEXT,
                  margin: '0 0 8px 0',
                  letterSpacing: '-1.5px',
                }}
              >
                Sitios web que
              </h1>
              <h1
                style={{
                  fontSize: '68px',
                  fontWeight: 900,
                  color: CYAN,
                  margin: '0 0 8px 0',
                  letterSpacing: '-1.5px',
                }}
              >
                convierten visitas
              </h1>
              <h1
                style={{
                  fontSize: '68px',
                  fontWeight: 900,
                  color: TEXT,
                  margin: 0,
                  letterSpacing: '-1.5px',
                }}
              >
                en clientes
              </h1>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '18px',
                color: MUTED,
                margin: 0,
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '700px',
              }}
            >
              Diseño personalizado · Código limpio · Hosting rápido · Soporte directo
            </p>
          </div>

          {/* Services strip */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            {[
              '🎨 Branding',
              '🌐 Landing',
              '🖼️ Portafolio',
              '🍽️ Restaurante',
              '🛒 E-commerce',
            ].map((service) => (
              <div
                key={service}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${BORDER}`,
                  background: CARD,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: TEXT,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
