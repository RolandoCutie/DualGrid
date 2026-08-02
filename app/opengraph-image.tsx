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
              {/* Logo: Interlocked circles */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  position: 'relative',
                }}
              >
                {/* Outer background */}
                <div
                  style={{
                    position: 'absolute',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `rgba(0,217,255,0.1)`,
                    border: `2px solid ${CYAN}`,
                  }}
                />
                {/* Inner accent */}
                <div
                  style={{
                    position: 'absolute',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid ${GREEN}`,
                    opacity: 0.8,
                  }}
                />
              </div>
              {/* Brand text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: TEXT }}>
                  <span style={{ color: CYAN }}>Dual</span>
                  <span style={{ color: GREEN }}>Grid</span>
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
                dualgrid.studio
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
            <div style={{ lineHeight: 1.1 }}>
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
