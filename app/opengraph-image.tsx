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
const PANEL = 'rgba(13, 21, 33, 0.86)';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: `linear-gradient(180deg, #09111f 0%, ${NAVY} 100%)`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-140px',
          left: '-110px',
          width: '700px',
          height: '520px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, rgba(0,217,255,0.22) 0%, transparent 65%)`,
          filter: 'blur(78px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          right: '-80px',
          width: '620px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, rgba(0,255,157,0.24) 0%, transparent 65%)`,
          filter: 'blur(82px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '30px',
          borderRadius: '38px',
          border: `1px solid rgba(255,255,255,0.06)`,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.02)`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flex: 1,
          padding: '52px 58px',
          position: 'relative',
          gap: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '36px',
                  fontWeight: 900,
                  color: TEXT,
                }}
              >
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
                Web • Branding • Digital
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              borderRadius: '28px',
              border: `1px solid rgba(0,217,255,0.24)`,
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
              Web • Branding • Hosting
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '62%',
              padding: '30px 4px 12px 4px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
                  Clarity • Craft • Execution
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.02 }}>
                <h1
                  style={{
                    fontSize: '66px',
                    fontWeight: 900,
                    color: TEXT,
                    margin: '0 0 8px 0',
                    letterSpacing: '-1.8px',
                  }}
                >
                  Brands and websites
                </h1>
                <h1
                  style={{
                    fontSize: '66px',
                    fontWeight: 900,
                    color: CYAN,
                    margin: '0 0 8px 0',
                    letterSpacing: '-1.8px',
                  }}
                >
                  built with clarity
                </h1>
                <h1
                  style={{
                    fontSize: '66px',
                    fontWeight: 900,
                    color: TEXT,
                    margin: 0,
                    letterSpacing: '-1.8px',
                  }}
                >
                  and made to earn trust
                </h1>
              </div>

              <p
                style={{
                  fontSize: '18px',
                  color: MUTED,
                  margin: 0,
                  fontWeight: 400,
                  lineHeight: 1.65,
                  maxWidth: '620px',
                }}
              >
                Strategy, design and digital execution for businesses that value professionalism,
                clear communication and work done with real care.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              {['Custom websites', 'Visual identity', 'Managed hosting', 'Real support'].map(
                (item) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${BORDER}`,
                      fontSize: '13px',
                      color: TEXT,
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div
            style={{
              width: '38%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '22px',
                borderRadius: '32px',
                background: PANEL,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 24px 60px rgba(0,0,0,0.24)',
              }}
            >
              <div
                style={{
                  color: GREEN,
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '2.8px',
                  textTransform: 'uppercase',
                }}
              >
                What businesses value
              </div>
              <div style={{ color: TEXT, fontSize: '28px', fontWeight: 800, lineHeight: 1.1 }}>
                Clear positioning
              </div>
              <div style={{ color: MUTED, fontSize: '15px', lineHeight: 1.55 }}>
                Better structure, stronger presentation and more trust from the first impression.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '22px',
                borderRadius: '32px',
                background: 'rgba(255,255,255,0.035)',
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                style={{
                  color: CYAN,
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '2.8px',
                  textTransform: 'uppercase',
                }}
              >
                How we work
              </div>
              <div style={{ color: TEXT, fontSize: '22px', fontWeight: 800, lineHeight: 1.15 }}>
                Clarity. Care. Commitment.
              </div>
              <div style={{ color: MUTED, fontSize: '14px', lineHeight: 1.55 }}>
                Thoughtful process, solid execution and real follow-through from start to finish.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '22px',
                borderRadius: '32px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${BORDER}`,
              }}
            >
              {['Web design', 'Branding', 'Landing pages', 'Managed hosting'].map((service) => (
                <div
                  key={service}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '18px',
                    background: CARD,
                    color: TEXT,
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <span>{service}</span>
                  <span style={{ color: GREEN }}>•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            paddingTop: '18px',
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ color: MUTED, fontSize: '15px' }}>
            Branding, websites and digital systems shaped to support real business growth.
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(0,255,157,0.08)',
              border: `1px solid rgba(0,255,157,0.2)`,
              color: GREEN,
              fontSize: '13px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: GREEN,
                boxShadow: `0 0 12px ${GREEN}`,
              }}
            />
            <span>dualgrid.io</span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
