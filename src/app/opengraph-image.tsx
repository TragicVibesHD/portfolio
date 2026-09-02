import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';
import { isPlaceholder } from '@/lib/utils';

/**
 * Social sharing card, generated at build time.
 *
 * Generated rather than a static PNG so it always matches the current name
 * and headline — a stale hand-made OG image is a classic portfolio bug.
 */

export const alt = site.seo.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const displayName = isPlaceholder(site.name) ? site.role : site.name;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#08090b',
        padding: 80,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          top: -260,
          right: -160,
          width: 640,
          height: 640,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(46,230,197,0.28) 0%, rgba(8,9,11,0) 70%)',
          display: 'flex',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: '#2ee6c5',
            display: 'flex',
          }}
        />
        <div
          style={{
            color: '#2ee6c5',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {site.location}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            color: '#ededf1',
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {displayName}
        </div>
        <div
          style={{
            color: '#969ba5',
            fontSize: 36,
            marginTop: 20,
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          {site.headline}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #202329',
          paddingTop: 32,
        }}
      >
        <div style={{ color: '#969ba5', fontSize: 24 }}>{site.educationStatus}</div>
        {/* Single interpolated string: Satori requires an explicit
              display value on any element with more than one child node. */}
        <div style={{ color: '#2ee6c5', fontSize: 24 }}>
          {`Graduating ${site.expectedGraduation}`}
        </div>
      </div>
    </div>,
    size,
  );
}
