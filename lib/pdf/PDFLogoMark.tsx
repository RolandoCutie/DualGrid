/**
 * DualGrid logo mark for react-pdf documents.
 * Renders the interlocked DG circles in cyan (#00d9ff) and green (#00ff9d).
 * Must be used inside a react-pdf <Page> — NOT in a React DOM component.
 */
import { G, Path, Svg } from '@react-pdf/renderer';

interface PDFLogoMarkProps {
  /** Total width in PDF points. Height is auto-calculated to keep aspect ratio. */
  size?: number;
}

export default function PDFLogoMark({ size = 32 }: PDFLogoMarkProps) {
  // The DG mark occupies viewBox "18 18 68 50" within the horizontal SVG
  // We render a 86×68 viewBox encompassing both circles
  const h = Math.round(size * (50 / 68));

  return (
    <Svg width={size} height={h} viewBox="18 18 68 50">
      <G>
        {/* Cyan circle (bottom-left) */}
        <Path fill="#00d9ff" d="M38.1,57.11c-.16.03-.34.03-.49.03v-.03h.49Z" />
        <Path
          fill="#00d9ff"
          d="M56.82,47.6v19.11h-19.14c-10.56,0-19.14-8.55-19.14-19.11s8.57-19.14,19.14-19.14h9.58v9.55h-9.58c-5.28,0-9.55,4.3-9.55,9.58s4.27,9.55,9.55,9.55c.16,0,.34,0,.49-.03h9.09v-9.53h9.55Z"
        />
        {/* Green circle (top-right) */}
        <Path
          fill="#00ff9d"
          d="M47.26,38.02v-19.11h19.14c10.56,0,19.14,8.55,19.14,19.11s-8.57,19.14-19.14,19.14h-9.58v-9.55h9.58c5.28,0,9.55-4.3,9.55-9.58s-4.27-9.55-9.55-9.55c-.16,0-.34,0-.49.03h-9.09v9.53h-9.55Z"
        />
      </G>
    </Svg>
  );
}
