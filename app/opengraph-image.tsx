import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 830 };
export const contentType = 'image/png';

const CYAN = '#00d9ff';
const GREEN = '#00ff9d';
const NAVY = '#050912';
const CARD = '#0d1521';
const BORDER = '#1a2d42';
const TEXT = '#f1f5f9';
const MUTED = '#94a3b8';
const PANEL = 'rgba(13, 21, 33, 0.86)';
const SOFT_PANEL = 'rgba(10, 18, 31, 0.74)';

const VALUE_POINTS = [
  {
    label: 'Posicionamiento',
    title: 'Mensajes claros y presencia profesional',
    tone: GREEN,
  },
  {
    label: 'Ejecucion',
    title: 'Diseno web, branding y sistemas con criterio',
    tone: CYAN,
  },
  {
    label: 'Seguimiento',
    title: 'Hosting gestionado y soporte real despues del lanzamiento',
    tone: '#A594F9',
  },
];

const SERVICE_LABELS = ['Web design', 'Branding', 'Hosting', 'Digital systems'];

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
          top: '-40px',
          left: '-110px',
          width: '700px',
          height: '820px',
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
          top: '120px',
          right: '240px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '180px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          opacity: 0.32,
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
          borderRadius: '42px',
          border: `1px solid rgba(255,255,255,0.06)`,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.02)`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '42px 46px 38px 46px',
          position: 'relative',
          gap: '26px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
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
                Web • Branding • Hosting
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '999px',
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
              Claridad • Oficio • Confianza
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '28px', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '58%',
              padding: '18px 2px 10px 2px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                  Diseno web • Branding • Hosting gestionado
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: 1 }}>
                <div
                  style={{
                    fontSize: '74px',
                    fontWeight: 900,
                    color: TEXT,
                    letterSpacing: '-2.8px',
                  }}
                >
                  Marcas claras.
                </div>
                <div
                  style={{
                    fontSize: '74px',
                    fontWeight: 900,
                    color: CYAN,
                    letterSpacing: '-2.8px',
                  }}
                >
                  Sitios web serios.
                </div>
                <div
                  style={{
                    fontSize: '74px',
                    fontWeight: 900,
                    color: TEXT,
                    letterSpacing: '-2.8px',
                  }}
                >
                  Presencia que inspira confianza.
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '22px',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.035)',
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    background: 'rgba(0,217,255,0.12)',
                    border: '1px solid rgba(0,217,255,0.16)',
                    color: CYAN,
                    fontSize: '18px',
                    fontWeight: 900,
                  }}
                >
                  DG
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    maxWidth: '520px',
                  }}
                >
                  <div style={{ color: TEXT, fontSize: '18px', fontWeight: 700 }}>
                    Diseño digital con estructura, criterio y seguimiento real.
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: MUTED,
                      lineHeight: 1.55,
                    }}
                  >
                    Branding, sitios web y hosting gestionado para negocios que quieren verse mejor,
                    comunicar con claridad y proyectar más confianza.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0px',
                  flexWrap: 'wrap',
                }}
              >
                {SERVICE_LABELS.map((item) => (
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
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                paddingTop: '18px',
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <div
                style={{
                  color: MUTED,
                  fontSize: '15px',
                  lineHeight: 1.5,
                  maxWidth: '420px',
                }}
              >
                Web, branding y sistemas digitales pensados para negocios que valoran una imagen
                profesional y una ejecución cuidada.
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

          <div
            style={{
              width: '42%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '24px',
                borderRadius: '36px',
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
                DualGrid
              </div>
              <div style={{ color: TEXT, fontSize: '30px', fontWeight: 800, lineHeight: 1.1 }}>
                Diseno sobrio. Ejecucion seria. Soporte real.
              </div>
              <div style={{ color: MUTED, fontSize: '15px', lineHeight: 1.6 }}>
                Una presencia digital pensada para ordenar tu mensaje, elevar tu imagen y dar mas
                seguridad desde la primera impresion.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '22px',
                borderRadius: '36px',
                background: SOFT_PANEL,
                border: `1px solid ${BORDER}`,
              }}
            >
              {VALUE_POINTS.map((point) => (
                <div
                  key={point.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '16px 18px',
                    borderRadius: '22px',
                    background: CARD,
                    border: `1px solid rgba(255,255,255,0.04)`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        color: point.tone,
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '2.2px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {point.label}
                    </span>
                    <span style={{ color: point.tone, fontSize: '18px', fontWeight: 800 }}>•</span>
                  </div>
                  <div
                    style={{
                      color: TEXT,
                      fontSize: '20px',
                      fontWeight: 750,
                      lineHeight: 1.25,
                      width: '100%',
                    }}
                  >
                    {point.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
