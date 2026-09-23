import React, { useEffect } from 'react';
import { X, Clock, Calendar, MapPin, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Story, SiteSettings } from '../types';

interface StoryReaderModalProps {
  story: Story | null;
  onClose: () => void;
  onShare: (title: string) => void;
  settings?: SiteSettings | null;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  story,
  onClose,
  onShare,
  settings: _settings,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (story) document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [story, onClose]);

  return (
    <AnimatePresence>
      {story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(18, 19, 22, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            padding: 'var(--space-6) var(--space-4)',
            overflowY: 'auto',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: 'var(--bg-canvas)',
              maxWidth: '780px',
              width: '100%',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
              position: 'relative',
              margin: 'auto',
              border: '1px solid var(--border-subtle)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Floating */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              aria-label="Close article"
              style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                zIndex: 10,
                color: '#FFFFFF',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 150ms ease',
              }}
            >
              <X size={18} />
            </motion.button>

            {/* Hero Cover Header */}
            <div
              style={{
                height: '340px',
                position: 'relative',
                backgroundColor: 'var(--surface-dark)',
              }}
            >
              <img
                src={story.coverImage}
                alt={story.title}
                referrerPolicy="no-referrer"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(18, 19, 22, 0.9) 0%, rgba(18, 19, 22, 0.2) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 'var(--space-6)',
                  color: '#FFFFFF',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-gold)',
                    marginBottom: '8px',
                  }}
                >
                  {story.tag} • FIELD JOURNAL
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.125rem)',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: '#FFFFFF',
                  }}
                >
                  {story.title}
                </h2>
              </div>
            </div>

            {/* Metadata Strip */}
            <div
              style={{
                padding: 'var(--space-3) var(--space-8)',
                backgroundColor: 'var(--surface-card)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  <span>{story.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} />
                  <span>{story.readTime}</span>
                </div>
                {story.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--accent-gold-dark)" />
                    <span>{story.location}</span>
                  </div>
                )}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onShare(story.title)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--surface-subtle)',
                }}
              >
                <Share2 size={13} />
                <span>Share</span>
              </motion.button>
            </div>

            {/* Article Body */}
            <div
              style={{
                padding: 'var(--space-8)',
              }}
            >
              {/* Excerpt Lead */}
              <p
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-6)',
                  fontStyle: 'italic',
                  borderLeft: '3px solid var(--accent-gold)',
                  paddingLeft: 'var(--space-4)',
                }}
              >
                {story.excerpt}
              </p>

              {/* Paragraphs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {story.content.map((p, idx) => (
                  <p
                    key={idx}
                    style={{
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Pull Quote */}
              {story.quote && (
                <blockquote
                  style={{
                    margin: 'var(--space-8) 0',
                    padding: 'var(--space-6)',
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    borderLeft: '4px solid var(--accent-gold)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                  }}
                >
                  "{story.quote}"
                  <footer
                    style={{
                      marginTop: 'var(--space-2)',
                      fontFamily: 'var(--font-script)',
                      fontSize: '1.5rem',
                      color: 'var(--accent-gold-dark)',
                    }}
                  >
                    — Ahmad Qeis
                  </footer>
                </blockquote>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
