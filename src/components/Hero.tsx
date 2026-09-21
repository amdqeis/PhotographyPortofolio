import React, { useRef } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { InstagramIcon, YoutubeIcon, TwitterIcon, FacebookIcon } from './Icons';
import { SmoothImage } from './SmoothImage';
import type { SiteSettings } from '../types';

interface HeroProps {
  onViewPortfolio: () => void;
  onReadStories: () => void;
  heroImageUrl?: string;
  settings?: SiteSettings | null;
  isLoading?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onViewPortfolio, onReadStories, heroImageUrl, settings, isLoading }) => {
  const containerRef = useRef<HTMLElement>(null);

  // Parallax scroll controls for background lake & dock image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '40px']);

  const activeHeroImage = heroImageUrl || settings?.heroImageUrl;

  return (
    <section
      id="home"
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '40px',
        paddingBottom: 'var(--space-12)',
        overflow: 'hidden',
      }}
    >
      {/* High-Resolution Scenic Background with Parallax (Zero hardcoded images) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          y: bgY,
          scale: bgScale,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {activeHeroImage ? (
          <SmoothImage
            src={activeHeroImage}
            alt="Hero Background Scenic View"
            style={{
              width: '100%',
              height: '115%',
              objectFit: 'cover',
              objectPosition: 'center 42%',
              filter: 'brightness(0.96) saturate(1.05)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '115%',
              background: 'radial-gradient(ellipse at 70% 30%, rgba(229, 169, 30, 0.15) 0%, rgba(24, 24, 27, 0.95) 100%)',
            }}
          />
        )}

        {/* Ambient Warm Gradient Overlays for Readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to right, rgba(250, 248, 245, 0.96) 0%, rgba(250, 248, 245, 0.85) 32%, rgba(250, 248, 245, 0.2) 65%, rgba(0, 0, 0, 0.25) 100%),
              linear-gradient(to bottom, rgba(250, 248, 245, 0.7) 0%, transparent 20%, transparent 80%, rgba(250, 248, 245, 0.85) 100%)
            `,
          }}
        />
      </motion.div>

      {/* Floating Right Vertical Social Rail */}
      <motion.div
        className="hero-social-rail"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          right: 'var(--space-6)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          alignItems: 'center',
        }}
      >
        {[
          {
            icon: InstagramIcon,
            href: settings?.instagramUrl || (settings?.instagram ? `https://instagram.com/${settings.instagram.replace('@', '')}` : 'https://instagram.com'),
            label: 'Instagram',
          },
          { icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
          { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
          { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
        ].map((social) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              whileHover={{ scale: 1.25, color: '#E5A91E' }}
              whileTap={{ scale: 0.9 }}
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                padding: '6px',
                transition: 'color 180ms ease',
              }}
            >
              <Icon size={17} />
            </motion.a>
          );
        })}
      </motion.div>

      {/* Main Content Container with Subtle Parallax Float */}
      <motion.div
        className="container"
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 160px)',
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        {/* Top-Left Headline & Narrative */}
        <div style={{ maxWidth: '640px', marginTop: 'var(--space-8)' }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: 'var(--space-4)',
            }}
          >
            <span
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: 'var(--accent-gold)',
              }}
            />
            {isLoading ? (
              <span
                style={{
                  display: 'inline-block',
                  width: '140px',
                  height: '14px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, rgba(229,169,30,0.1) 0%, rgba(229,169,30,0.25) 50%, rgba(229,169,30,0.1) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            ) : settings?.eyebrow ? (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                }}
              >
                {settings.eyebrow}
              </span>
            ) : null}
          </motion.div>

          {/* Heading Display */}
          <motion.h1
            className="heading-hero"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-5)',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)',
              whiteSpace: 'pre-line',
            }}
          >
            {settings?.tagline || 'PORTFOLIO &\nVISUAL STORIES'}
          </motion.h1>

          {/* Narrative Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(1rem, 1.2vw + 0.5rem, 1.125rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '480px',
              marginBottom: 'var(--space-8)',
              fontWeight: 400,
            }}
          >
            {settings?.bio || ''}
          </motion.p>

          {/* Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}
          >
            <motion.button
              type="button"
              onClick={onViewPortfolio}
              className="btn-primary"
              whileHover={{ y: -2, scale: 1.02, boxShadow: 'var(--shadow-md)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              VIEW PORTFOLIO
              <ArrowRight size={16} strokeWidth={2.5} />
            </motion.button>

            <motion.button
              type="button"
              onClick={onReadStories}
              className="btn-outline"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              ABOUT ME
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom Right Credential & Signature */}
        <motion.div
          className="hero-signature-block"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            alignSelf: 'flex-end',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginTop: 'var(--space-12)',
            paddingRight: 'var(--space-4)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '2px',
            }}
          >
            <MapPin size={12} color="var(--accent-gold)" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              BASED IN
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: '0 1px 6px rgba(0,0,0,0.7)',
            }}
          >
            {settings?.location ? settings.location.toUpperCase() : 'LOCATION NOT SET'}
          </div>

          {/* Golden Script Signature matching reference */}
          {(settings?.fullName || settings?.brandName) && (
            <motion.div
              className="font-script"
              initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -4, scale: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: '3.75rem',
                color: 'var(--accent-gold)',
                lineHeight: 0.9,
                marginTop: '4px',
                userSelect: 'none',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
              }}
            >
              {settings.fullName || settings.brandName}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-social-rail {
            display: none !important;
          }
          .hero-signature-block {
            align-self: flex-start !important;
            text-align: left !important;
            align-items: flex-start !important;
            margin-top: var(--space-8) !important;
          }
        }
      `}</style>
    </section>
  );
};
