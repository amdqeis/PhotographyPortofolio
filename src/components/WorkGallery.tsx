import React from 'react';
import { ArrowRight, Maximize2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { GallerySkeleton } from './SkeletonLoader';
import { SmoothImage } from './SmoothImage';
import type { Photo } from '../types';

interface WorkGalleryProps {
  photos: Photo[];
  isLoading?: boolean;
  onSelectPhoto: (photo: Photo, index: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const WorkGallery: React.FC<WorkGalleryProps> = ({ photos, onSelectPhoto, isLoading }) => {
  return (
    <section
      id="portfolio"
      style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-20)',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div className="container">
        {/* Section Header with Motion Reveal */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-title-wrap">
            <motion.span
              className="section-accent-bar"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ transformOrigin: 'left' }}
            />
            <h2 className="heading-section">MY GALLERY</h2>
          </div>

          {photos.length > 0 && (
            <motion.a
              href="#portfolio"
              className="section-link-action"
              whileHover={{ x: 3 }}
              onClick={(e) => {
                e.preventDefault();
                onSelectPhoto(photos[0], 0);
              }}
            >
              <span>VIEW ALL PHOTOS</span>
              <span className="section-link-badge">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </motion.a>
          )}
        </motion.div>

        {isLoading ? (
          <GallerySkeleton />
        ) : photos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 20px',
              border: '1px dashed var(--border-medium)',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229, 169, 30, 0.12)',
                color: 'var(--accent-gold-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Camera size={26} strokeWidth={1.8} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              Portfolio Ready to Fill
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
              The photo database is currently empty. Go to <strong>/admin</strong> to add your photos directly from a Google Drive link.
            </p>
          </div>
        ) : (
          /* Gallery Masonry - CSS Columns for natural aspect ratios */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="portfolio-masonry-grid"
          >
          {photos.map((photo, index) => {
            const hasCaption = Boolean(photo.title || photo.subtitle);
            const hasExif = Boolean(photo.exif?.camera);

            return (
              <motion.div
                key={photo.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => onSelectPhoto(photo, index)}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: 'var(--surface-dark)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className={`gallery-card ${!hasCaption ? 'pure-photo-card' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPhoto(photo, index);
                  }
                }}
              >
                {/* Photo Image - natural aspect ratio, no cropping */}
                <SmoothImage
                  src={photo.imageUrl}
                  alt={photo.title || 'Portfolio Photography'}
                  className="gallery-card-img"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />

                {/* Adaptive Overlay: Displays elegant title/subtitle if present, or pure clean hover vignette if no caption */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: hasCaption
                      ? 'linear-gradient(to top, rgba(12, 13, 16, 0.88) 0%, rgba(12, 13, 16, 0.25) 50%, rgba(12, 13, 16, 0.05) 100%)'
                      : 'linear-gradient(to top, rgba(12, 13, 16, 0.4) 0%, transparent 40%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: hasCaption ? 'flex-end' : 'center',
                    alignItems: hasCaption ? 'flex-start' : 'center',
                    padding: 'var(--space-5)',
                    transition: 'all var(--transition-base)',
                  }}
                  className="gallery-card-overlay"
                >
                  {/* Expand Icon Badge (Centered when no caption, top-right when caption present) */}
                  <div
                    className={hasCaption ? 'gallery-hover-icon' : 'gallery-center-icon'}
                    style={
                      hasCaption
                        ? {
                            position: 'absolute',
                            top: 'var(--space-4)',
                            right: 'var(--space-4)',
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transform: 'translateY(-4px)',
                            transition: 'all var(--transition-fast)',
                          }
                        : {
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(24, 24, 27, 0.75)',
                            backdropFilter: 'blur(8px)',
                            color: 'var(--accent-gold)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transform: 'scale(0.85)',
                            transition: 'all var(--transition-fast)',
                            border: '1px solid rgba(229, 169, 30, 0.4)',
                          }
                    }
                  >
                    <Maximize2 size={hasCaption ? 14 : 18} />
                  </div>

                  {/* Render Caption only if present */}
                  {hasCaption && (
                    <>
                      {photo.title && (
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.9375rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            marginBottom: '4px',
                          }}
                        >
                          {photo.title}
                        </h3>
                      )}

                      {photo.subtitle && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          <span>{photo.subtitle}</span>
                        </div>
                      )}

                      {/* Quick EXIF tag preview on hover if available */}
                      {hasExif && (
                        <div
                          className="gallery-exif-mini"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '8px',
                            fontSize: '0.6875rem',
                            color: 'var(--accent-gold)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 600,
                            opacity: 0,
                            transform: 'translateY(4px)',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          <Camera size={12} />
                          <span>{photo.exif?.camera} {photo.exif?.aperture ? `• ${photo.exif.aperture}` : ''}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        )}
      </div>

      <style>{`
        /* Masonry layout using CSS columns */
        .portfolio-masonry-grid {
          columns: 4;
          column-gap: var(--space-4, 16px);
        }

        .portfolio-masonry-grid > * {
          break-inside: avoid;
          margin-bottom: var(--space-4, 16px);
        }

        @media (max-width: 1200px) {
          .portfolio-masonry-grid {
            columns: 3;
          }
        }

        @media (max-width: 768px) {
          .portfolio-masonry-grid {
            columns: 2;
          }
        }

        @media (max-width: 480px) {
          .portfolio-masonry-grid {
            columns: 2;
            column-gap: var(--space-2, 8px);
          }
          .portfolio-masonry-grid > * {
            margin-bottom: var(--space-2, 8px);
          }
        }

        .gallery-card:hover .gallery-card-img {
          transform: scale(1.04);
          filter: contrast(1.05);
        }

        .gallery-card .gallery-card-img {
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-card:hover .gallery-hover-icon {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery-card:hover .gallery-center-icon {
          opacity: 1;
          transform: scale(1);
        }

        .gallery-card:hover .gallery-exif-mini {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
};
