import React from 'react';

export const GallerySkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 'var(--space-4)',
      }}
      className="portfolio-cards-grid"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            height: '360px',
            borderRadius: 'var(--radius-xs)',
            overflow: 'hidden',
            backgroundColor: '#1E1F24',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(229,169,30,0.06) 50%, rgba(255,255,255,0.02) 100%)',
              backgroundSize: '200% 100%',
              animation: 'skeletonPulse 1.6s infinite ease-in-out',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ height: '14px', width: '65%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
            <div style={{ height: '10px', width: '40%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes skeletonPulse {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export const StoriesSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-5)',
      }}
      className="stories-grid"
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            backgroundColor: 'var(--surface-card, #FFFFFF)',
            borderRadius: 'var(--radius-xs)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
            display: 'flex',
            flexDirection: 'column',
            height: '320px',
          }}
        >
          <div
            style={{
              height: '190px',
              width: '100%',
              backgroundColor: '#27272A',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(229,169,30,0.08) 50%, rgba(255,255,255,0.02) 100%)',
                backgroundSize: '200% 100%',
                animation: 'skeletonPulse 1.6s infinite ease-in-out',
              }}
            />
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ height: '12px', width: '50px', backgroundColor: 'var(--accent-gold-subtle, rgba(229,169,30,0.15))', borderRadius: '4px' }} />
            <div style={{ height: '16px', width: '85%', backgroundColor: 'var(--border-subtle, #E4E4E7)', borderRadius: '4px' }} />
            <div style={{ height: '12px', width: '60%', backgroundColor: 'var(--border-subtle, #E4E4E7)', borderRadius: '4px', marginTop: 'auto' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const InstagramSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 'var(--space-2)',
      }}
      className="instagram-photos-grid"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            height: '110px',
            borderRadius: 'var(--radius-xs)',
            overflow: 'hidden',
            backgroundColor: '#1E1F24',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(229,169,30,0.07) 50%, rgba(255,255,255,0.02) 100%)',
              backgroundSize: '200% 100%',
              animation: 'skeletonPulse 1.6s infinite ease-in-out',
            }}
          />
        </div>
      ))}
    </div>
  );
};
