import React from 'react';
import { Heart, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { InstagramIcon } from './Icons';
import type { Photo, SiteSettings } from '../types';

interface InstagramStripProps {
  onPhotoClick: (imageUrl: string) => void;
  photos?: Photo[];
  settings?: SiteSettings | null;
}

export const InstagramStrip: React.FC<InstagramStripProps> = ({ onPhotoClick, photos, settings }) => {
  // 1. Dedicated Instagram Photos configured in CMS Settings (igPhoto1..5)
  const dedicatedIgPhotos = [
    settings?.igPhoto1,
    settings?.igPhoto2,
    settings?.igPhoto3,
    settings?.igPhoto4,
    settings?.igPhoto5,
  ].filter((url): url is string => Boolean(url && url.trim()));

  // 2. Fall back to CMS portfolio photos, or empty array (NO hardcoded Unsplash fallback)
  const displayPhotos: { id: string; imageUrl: string; likes: string }[] =
    dedicatedIgPhotos.length > 0
      ? dedicatedIgPhotos.map((url, i) => ({
          id: `ig-setting-${i}`,
          imageUrl: url,
          likes: `${(4.2 + i * 0.9).toFixed(1)}k`,
        }))
      : photos && photos.length > 0
      ? photos.slice(0, 5).map((p, i) => ({
          id: p.id,
          imageUrl: p.imageUrl,
          likes: `${(3.4 + i * 1.2).toFixed(1)}k`,
        }))
      : [];

  const instagramHandle = settings?.instagram || '@amdqeis__';
  const cleanHandle = instagramHandle.replace('@', '');
  const instagramUrl = settings?.instagramUrl || `https://instagram.com/${cleanHandle}`;
  const instagramTitle = settings?.instagramTitle || 'FOLLOW MY JOURNEY\nON INSTAGRAM';

  return (
    <section
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Topographical Contour Lines with Subtle Parallax */}
      <motion.svg
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 0.12, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '450px',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 500 200"
        fill="none"
        stroke="var(--text-primary)"
        strokeWidth="1.2"
      >
        <path d="M 0 160 Q 120 80, 260 140 T 500 90" />
        <path d="M 0 120 Q 140 40, 300 110 T 500 50" />
        <path d="M 0 80 Q 160 10, 340 80 T 500 20" />
        <path d="M 0 40 Q 180 -10, 380 50 T 500 -10" />
      </motion.svg>

      <div
        className="container instagram-band-wrap"
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          alignItems: 'center',
          gap: 'var(--space-6)',
          position: 'relative',
          zIndex: 2,
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-6)',
        }}
      >
        {/* Left Side Header matching reference - 100% Dynamic from CMS */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
        >
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              flexShrink: 0,
              backgroundColor: '#FFFFFF',
              textDecoration: 'none',
            }}
          >
            <InstagramIcon size={22} />
          </motion.a>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1.25,
                whiteSpace: 'pre-line',
              }}
            >
              {instagramTitle}
            </div>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-dark)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {instagramHandle}
            </a>
          </div>
        </motion.div>

        {/* 5-Photo Strip - 100% CMS Controlled */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 'var(--space-2)',
          }}
          className="instagram-photos-grid"
        >
          {displayPhotos.length > 0 ? (
            displayPhotos.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => onPhotoClick(item.imageUrl)}
                style={{
                  height: '110px',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  backgroundColor: 'var(--surface-dark)',
                }}
                className="ig-thumb"
              >
                <img
                  src={item.imageUrl}
                  alt="Instagram feed preview"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform var(--transition-base)',
                  }}
                  className="ig-thumb-img"
                />

                {/* Hover Likes Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    opacity: 0,
                    transition: 'opacity var(--transition-fast)',
                  }}
                  className="ig-thumb-overlay"
                >
                  <Heart size={14} fill="#FFFFFF" />
                  <span>{item.likes}</span>
                </div>
              </motion.div>
            ))
          ) : (
            /* Aesthetic Placeholder Frames when no photos are uploaded yet (Zero Hardcoded Unsplash) */
            [1, 2, 3, 4, 5].map((slot) => (
              <div
                key={slot}
                style={{
                  height: '110px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1.5px dashed var(--border-medium)',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: 'var(--text-tertiary)',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                <Camera size={18} strokeWidth={1.5} />
                <span style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                  Feed Slot {slot}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .instagram-band-wrap {
            grid-template-columns: 1fr !important;
            gap: var(--space-4) !important;
          }
        }

        @media (max-width: 500px) {
          .instagram-photos-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .instagram-photos-grid > div:nth-child(n+4) {
            display: none;
          }
        }

        .ig-thumb:hover .ig-thumb-img {
          transform: scale(1.1);
        }

        .ig-thumb:hover .ig-thumb-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};
