import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '../types';

interface LightboxModalProps {
  photo: Photo | null;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showExif, setShowExif] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    if (photo) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [photo, currentIndex, photos.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(10, 11, 14, 0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Controls Bar */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  fontSize: '0.9375rem',
                  color: 'var(--accent-gold)',
                }}
              >
                {photo.title || `PHOTO ${currentIndex + 1}`}
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.8125rem' }}>
                ({currentIndex + 1} / {photos.length})
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Toggle zoom"
                style={{
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isZoomed ? 'rgba(229, 169, 30, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowExif(!showExif)}
                aria-label="Toggle camera details"
                style={{
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: showExif ? 'rgba(229, 169, 30, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Info size={18} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                whileTap={{ scale: 0.94 }}
                onClick={onClose}
                aria-label="Close lightbox"
                style={{
                  color: '#FFFFFF',
                  padding: '8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </motion.button>
            </div>
          </motion.div>

          {/* Center Image Area with Navigation Buttons */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: 'var(--space-4)',
              overflow: isZoomed ? 'auto' : 'hidden',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            {/* Previous Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(229, 169, 30, 0.8)' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
              aria-label="Previous photo"
              style={{
                position: 'absolute',
                left: 'var(--space-6)',
                zIndex: 10,
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={24} />
            </motion.button>

            {/* Main Photo with smooth cross-dissolve motion */}
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.id}
                src={photo.imageUrl}
                alt={photo.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  maxWidth: isZoomed ? '160%' : '90%',
                  maxHeight: isZoomed ? 'none' : '82vh',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </AnimatePresence>

            {/* Next Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(229, 169, 30, 0.8)' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onNavigate((currentIndex + 1) % photos.length)}
              aria-label="Next photo"
              style={{
                position: 'absolute',
                right: 'var(--space-6)',
                zIndex: 10,
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Bottom EXIF Metadata Drawer with AnimatePresence */}
          <AnimatePresence>
            {showExif && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  backgroundColor: 'rgba(18, 19, 22, 0.95)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: 'var(--space-3) var(--space-6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-4)',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <MapPin size={14} color="var(--accent-gold)" />
                  <span>{photo.location || 'Location Unspecified'}</span>
                  {photo.year && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{photo.year}</span>
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    flexWrap: 'wrap',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {photo.exif?.camera && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Camera size={14} color="var(--accent-gold)" />
                      <span style={{ fontWeight: 600 }}>{photo.exif.camera}</span>
                    </div>
                  )}
                  {photo.exif?.lens && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                      <span>{photo.exif.lens}</span>
                    </>
                  )}
                  {photo.exif?.aperture && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                      <span style={{ color: 'var(--accent-gold)' }}>{photo.exif.aperture}</span>
                    </>
                  )}
                  {photo.exif?.shutterSpeed && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                      <span>{photo.exif.shutterSpeed}</span>
                    </>
                  )}
                  {photo.exif?.iso && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                      <span>ISO {photo.exif.iso}</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
