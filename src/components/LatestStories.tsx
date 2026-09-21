import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { StoriesSkeleton } from './SkeletonLoader';
import { SmoothImage } from './SmoothImage';
import type { Story } from '../types';

interface LatestStoriesProps {
  stories: Story[];
  isLoading?: boolean;
  onSelectStory: (story: Story) => void;
}

const storiesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const storyCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const LatestStories: React.FC<LatestStoriesProps> = ({ stories, onSelectStory, isLoading }) => {
  return (
    <section
      id="blog"
      style={{
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-20)',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div className="container">
        {/* Section Header */}
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
            <h2 className="heading-section">LATEST STORIES</h2>
          </div>

          {stories.length > 0 && (
            <motion.a
              href="#blog"
              className="section-link-action"
              whileHover={{ x: 3 }}
              onClick={(e) => {
                e.preventDefault();
                onSelectStory(stories[0]);
              }}
            >
              <span>VIEW ALL POSTS</span>
              <span className="section-link-badge">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </motion.a>
          )}
        </motion.div>

        {isLoading ? (
          <StoriesSkeleton />
        ) : stories.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              border: '1px dashed var(--border-medium)',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              Field Journal Ready
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Belum ada artikel cerita lapangan. Publikasikan cerita baru di panel <strong>/admin</strong>.
            </p>
          </div>
        ) : (
          /* 4-Card Publication Grid with Staggered Entrance */
          <motion.div
            variants={storiesContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-5)',
            }}
            className="stories-grid"
          >
          {stories.map((story) => (
            <motion.article
              key={story.id}
              variants={storyCardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => onSelectStory(story)}
              style={{
                backgroundColor: 'var(--surface-card)',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              className="story-card"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStory(story);
                }
              }}
            >
              {/* Image Container with Progressive Fade-in */}
              <div
                style={{
                  height: '190px',
                  width: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'var(--surface-subtle)',
                }}
              >
                <SmoothImage
                  src={story.coverImage}
                  alt={story.title}
                  className="story-card-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Story Content Block */}
              <div
                style={{
                  padding: 'var(--space-4) var(--space-4) var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                {/* Yellow Tag */}
                <div style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-gold-dark)',
                      backgroundColor: 'var(--accent-gold-subtle)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {story.tag}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-4)',
                    flex: 1,
                    transition: 'color 180ms ease',
                  }}
                  className="story-title"
                >
                  {story.title}
                </h3>

                {/* Date and Read Time Footer matching reference */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span>{story.date}</span>
                  <span>•</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} />
                    <span>{story.readTime}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .stories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 600px) {
          .stories-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .story-card:hover {
          box-shadow: var(--shadow-lg);
          border-color: var(--border-active);
        }

        .story-card:hover .story-card-img {
          transform: scale(1.06);
        }

        .story-card:hover .story-title {
          color: var(--accent-gold-dark);
        }
      `}</style>
    </section>
  );
};
