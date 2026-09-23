import React, { useState, useRef } from 'react';
import { Camera, MapPin, Award, X, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { SmoothImage } from './SmoothImage';
import type { SiteSettings } from '../types';

interface AboutStoryProps {
  photo1?: string;
  photo2?: string;
  photo3?: string;
  settings?: SiteSettings | null;
  isLoading?: boolean;
}

export const AboutStory: React.FC<AboutStoryProps> = ({ photo1, photo2, photo3, settings, isLoading }) => {
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activePhoto1 = photo1 || settings?.aboutPhoto1;
  const activePhoto2 = photo2 || settings?.aboutPhoto2;
  const activePhoto3 = photo3 || settings?.aboutPhoto3;

  // Multi-layer parallax scroll controls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const photo1Y = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const photo2Y = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const photo3Y = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const signatureY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)',
        backgroundColor: 'var(--bg-canvas)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Far Right Vertical Decorative Script Text matching reference */}
      <motion.div
        className="vertical-script-accent"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 0.7, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          right: 'var(--space-8)',
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          fontFamily: 'var(--font-script)',
          fontSize: '1.75rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        Street. Candid. Authentic.
      </motion.div>

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 'var(--space-12)',
            alignItems: 'center',
          }}
          className="about-grid"
        >
          {/* Left Column: Asymmetric Editorial Photographic Collage with Layered Parallax */}
          <div
            style={{
              position: 'relative',
              minHeight: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="about-collage-container"
          >
            {/* Dot Matrix Pattern */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '120px',
                height: '120px',
                backgroundImage: 'radial-gradient(var(--border-medium) 1.5px, transparent 1.5px)',
                backgroundSize: '12px 12px',
                zIndex: 1,
              }}
            />

            {/* Main Upper Image: Explorer with camera (Parallax layer 1) */}
            <motion.div
              style={{
                position: 'absolute',
                top: '20px',
                left: '60px',
                width: '260px',
                height: '240px',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 2,
                border: '4px solid #FFFFFF',
                y: photo1Y,
                willChange: 'transform',
              }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="about-photo-card"
            >
              {activePhoto1 ? (
                <SmoothImage
                  src={activePhoto1}
                  alt="Photographer Main Portrait"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--surface-dark, #1E1F24)',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(229,169,30,0.08) 50%, rgba(255,255,255,0.02) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'skeletonPulse 1.6s infinite ease-in-out',
                  }}
                />
              )}
            </motion.div>

            {/* Secondary Left Image: Cliff adventure vista (Parallax layer 2) */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '30px',
                left: '10px',
                width: '190px',
                height: '190px',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 3,
                border: '4px solid #FFFFFF',
                y: photo2Y,
                willChange: 'transform',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="about-photo-card"
            >
              {activePhoto2 ? (
                <SmoothImage
                  src={activePhoto2}
                  alt="Adventure landscape explorer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--surface-dark, #1E1F24)',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(229,169,30,0.08) 50%, rgba(255,255,255,0.02) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'skeletonPulse 1.6s infinite ease-in-out',
                  }}
                />
              )}
            </motion.div>

            {/* Third Foreground Image: B&W Portrait (Parallax layer 3) */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '210px',
                width: '220px',
                height: '270px',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 4,
                border: '4px solid #FFFFFF',
                y: photo3Y,
                willChange: 'transform',
              }}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="about-photo-card"
            >
              {activePhoto3 ? (
                <SmoothImage
                  src={activePhoto3}
                  alt="Artistic portrait of photographer"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%) contrast(1.1)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--surface-dark, #1E1F24)',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(229,169,30,0.08) 50%, rgba(255,255,255,0.02) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'skeletonPulse 1.6s infinite ease-in-out',
                  }}
                />
              )}
            </motion.div>

            {/* Interactive Rotating Stamp Badge ("DO WHAT YOU LOVE • LOVE WHAT YOU DO") */}
            <motion.div
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute',
                top: '110px',
                right: '40px',
                zIndex: 5,
                width: '90px',
                height: '90px',
                userSelect: 'none',
                cursor: 'pointer',
              }}
              className="stamp-badge-wrap"
            >
              <svg
                viewBox="0 0 100 100"
                className="animate-spin-slow"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <path
                  id="textCircle"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text
                  style={{
                    fontSize: '9.2px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    fill: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  <textPath href="#textCircle">
                    • DO WHAT YOU LOVE • LOVE WHAT YOU DO
                  </textPath>
                </text>
              </svg>

              {/* Camera Center Icon inside Stamp */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                }}
              >
                <Camera size={18} strokeWidth={2} />
              </div>
            </motion.div>

            {/* Yellow Cursive Signature floating over bottom corner */}
            <motion.div
              className="font-script"
              style={{
                position: 'absolute',
                bottom: '-15px',
                left: '140px',
                zIndex: 6,
                fontSize: '4.5rem',
                color: 'var(--accent-gold)',
                transform: 'rotate(-8deg)',
                userSelect: 'none',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                y: signatureY,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Ahmad Qeis
            </motion.div>
          </div>

          {/* Right Column: Bio Narrative & Stats */}
          <motion.div
            style={{ maxWidth: '520px' }}
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tag */}
            <div
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold-dark)',
                marginBottom: 'var(--space-2)',
              }}
            >
              ABOUT ME
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {"HI, I'M AHMAD QEIS"}
            </h2>

            {/* Subtle Divider Line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '32px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                height: '3px',
                backgroundColor: 'var(--accent-gold)',
                borderRadius: '2px',
                marginBottom: 'var(--space-6)',
              }}
            />

            {/* Narrative Paragraph matching reference */}
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-8)',
              }}
            >
              {"Photography found me years ago and it changed the way I see the world. It's more than taking pictures — it's about preserving memories, telling stories and connecting with people."}
            </p>

            {/* 3 Metric Counters — 100% from DB settings (statYears, statCountries, statAwards) */}
            {(() => {
              const dbStats = [
                {
                  id: 'stat-exp',
                  value: '7+',
                  label: 'Years Shooting',
                  icon: 'camera' as const,
                },
                {
                  id: 'stat-countries',
                  value: '120+',
                  label: 'Photos in Portfolio',
                  icon: 'globe' as const,
                },
                {
                  id: 'stat-awards',
                  value: '50+',
                  label: 'Projects Done',
                  icon: 'award' as const,
                },
              ];
              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'var(--space-4)',
                    paddingTop: 'var(--space-6)',
                    paddingBottom: 'var(--space-8)',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: 'var(--space-8)',
                  }}
                >
                  {dbStats.map((stat, i) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                    >
                      <div
                        style={{
                          color: 'var(--accent-gold-dark)',
                          marginTop: '3px',
                        }}
                      >
                        {stat.icon === 'camera' && <Camera size={22} strokeWidth={1.8} />}
                        {stat.icon === 'globe' && <MapPin size={22} strokeWidth={1.8} />}
                        {stat.icon === 'award' && <Award size={22} strokeWidth={1.8} />}
                      </div>

                      <div>
                        {isLoading ? (
                          <div
                            style={{
                              height: '24px',
                              width: '50px',
                              backgroundColor: 'rgba(229,169,30,0.1)',
                              borderRadius: '4px',
                              marginBottom: '6px',
                              background: 'linear-gradient(90deg, rgba(229,169,30,0.06) 0%, rgba(229,169,30,0.18) 50%, rgba(229,169,30,0.06) 100%)',
                              backgroundSize: '200% 100%',
                              animation: 'skeletonPulse 1.6s infinite ease-in-out',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.625rem',
                              fontWeight: 800,
                              lineHeight: 1,
                              color: 'var(--text-primary)',
                              marginBottom: '4px',
                            }}
                          >
                            {stat.value}
                          </div>
                        )}
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.25,
                            fontWeight: 500,
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })()}

            {/* Editorial Button */}
            <motion.button
              type="button"
              onClick={() => setBioModalOpen(true)}
              className="btn-editorial"
              whileHover={{ y: -2, backgroundColor: 'var(--text-primary)', color: '#FFFFFF' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              MORE ABOUT ME
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Interactive Bio & Gear Modal with AnimatePresence */}
      <AnimatePresence>
        {bioModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90,
              backgroundColor: 'rgba(18, 19, 22, 0.75)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-4)',
            }}
            onClick={() => setBioModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: '#FFFFFF',
                maxWidth: '680px',
                width: '100%',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-8)',
                position: 'relative',
                boxShadow: 'var(--shadow-xl)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setBioModalOpen(false)}
                aria-label="Close bio"
                style={{
                  position: 'absolute',
                  top: 'var(--space-6)',
                  right: 'var(--space-6)',
                  color: 'var(--text-muted)',
                  padding: '6px',
                }}
              >
                <X size={20} />
              </button>

              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'var(--accent-gold-dark)',
                  textTransform: 'uppercase',
                }}
              >
                Street Photographer — Bandung
              </span>
              <h3
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 800,
                  marginTop: '4px',
                  marginBottom: 'var(--space-4)',
                }}
              >
                'The Frame of Ahmad Qeis'
              </h3>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                {'Capturing the unscripted moments of Bandung streets and beyond. The best frame happens in a fraction of a second — honest expressions, light that forms itself, and moments that will never repeat.'}
              </p>

              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginTop: 'var(--space-6)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--text-primary)',
                }}
              >
                Gear Kit
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {[
                  'Sony Alpha A6400 — Primary Body',
                  'Sony E 35mm f/1.8 OSS — Street Staple',
                  'Sony E 18-135mm f/3.5-5.6 OSS',
                  'Sony E 50mm f/1.8 OSS — Portrait',
                  'Peak Design Clip — Run and Gun',
                  'Lightroom Classic — Post Processing',
                ].map((gear, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-gold-dark)" />
                    <span>{gear}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 960px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-8) !important;
          }
          .vertical-script-accent {
            display: none !important;
          }
          .about-collage-container {
            min-height: 420px !important;
            transform: scale(0.9);
          }
        }

        @media (max-width: 540px) {
          .about-collage-container {
            transform: scale(0.75);
            margin-left: -30px;
          }
        }
      `}</style>
    </section>
  );
};
