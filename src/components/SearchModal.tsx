import React, { useState, useEffect } from 'react';
import { Search, X, Camera, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo, Story } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  stories: Story[];
  onSelectPhoto: (photo: Photo, index: number) => void;
  onSelectStory: (story: Story) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  photos,
  stories,
  onSelectPhoto,
  onSelectStory,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const trimmed = query.toLowerCase().trim();

  const matchingPhotos = trimmed
    ? photos.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(trimmed)) ||
          (p.location && p.location.toLowerCase().includes(trimmed)) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(trimmed)) ||
          (p.exif?.camera && p.exif.camera.toLowerCase().includes(trimmed))
      )
    : [];

  const matchingStories = trimmed
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(trimmed) ||
          s.tag.toLowerCase().includes(trimmed) ||
          s.excerpt.toLowerCase().includes(trimmed)
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            backgroundColor: 'rgba(18, 19, 22, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 'var(--space-16) var(--space-4) var(--space-8)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: 'var(--bg-canvas)',
              maxWidth: '640px',
              width: '100%',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: '1px solid var(--border-subtle)',
                gap: 'var(--space-3)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Search size={20} color="var(--text-muted)" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search portraits, landscape, gear tips, locations..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-body)',
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  style={{ color: 'var(--text-muted)', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--surface-subtle)',
                }}
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div
              style={{
                maxHeight: '440px',
                overflowY: 'auto',
                padding: 'var(--space-4) var(--space-6)',
              }}
            >
              {!trimmed ? (
                <div style={{ padding: 'var(--space-6) 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Type a keyword like "landscape", "wedding", "camera", or "Rockies" to search.
                </div>
              ) : matchingPhotos.length === 0 && matchingStories.length === 0 ? (
                <div style={{ padding: 'var(--space-6) 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No results found for "{query}".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {matchingPhotos.length > 0 && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--accent-gold-dark)',
                          marginBottom: '8px',
                        }}
                      >
                        <Camera size={13} />
                        <span>Photos ({matchingPhotos.length})</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {matchingPhotos.map((photo) => {
                          const idx = photos.findIndex((p) => p.id === photo.id);
                          return (
                            <motion.div
                              key={photo.id}
                              whileHover={{ x: 4, backgroundColor: '#FAF8F5' }}
                              transition={{ duration: 0.15 }}
                              onClick={() => {
                                onSelectPhoto(photo, idx);
                                onClose();
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-xs)',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid var(--border-subtle)',
                                cursor: 'pointer',
                              }}
                            >
                              <img
                                src={photo.imageUrl}
                                alt={photo.title || 'Photo capture'}
                                style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '3px' }}
                              />
                              <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {photo.title || photo.location || 'Photograph'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {[photo.location, photo.exif?.camera].filter(Boolean).join(' • ') || 'Field Capture'}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {matchingStories.length > 0 && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--accent-gold-dark)',
                          marginBottom: '8px',
                          marginTop: 'var(--space-2)',
                        }}
                      >
                        <BookOpen size={13} />
                        <span>Stories ({matchingStories.length})</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {matchingStories.map((story) => (
                          <motion.div
                            key={story.id}
                            whileHover={{ x: 4, backgroundColor: '#FAF8F5' }}
                            transition={{ duration: 0.15 }}
                            onClick={() => {
                              onSelectStory(story);
                              onClose();
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                            }}
                          >
                            <img
                              src={story.coverImage}
                              alt={story.title}
                              style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '3px' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {story.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {story.tag} • {story.date}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
