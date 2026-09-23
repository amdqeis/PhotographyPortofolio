import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { InstagramIcon } from './Icons';
import type { SiteSettings } from '../types';

interface NavbarProps {
  onOpenSearch: () => void;
  activeSection: string;
  settings?: SiteSettings | null;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  activeSection,
  settings,
  isLoading,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Auto-hide capsule on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 24);

      if (currentScrollY < 60) {
        // Always visible at the top of the page
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          // Scrolling down: hide capsule
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 6) {
          // Scrolling up: reveal capsule
          setIsVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { label: 'HOME', href: '#home', id: 'home' },
    { label: 'GALLERY', href: '#portfolio', id: 'portfolio' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      {/* Subtle Golden Reading Progress Line at Top Edge */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2.5px',
          backgroundColor: 'var(--accent-gold)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 70,
        }}
      />

      {/* Floating Island Capsule Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -95,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.32,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: 'fixed',
          top: '16px',
          left: 0,
          right: 0,
          zIndex: 60,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 16px',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: isScrolled ? 'rgba(250, 248, 245, 0.9)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(220, 215, 206, 0.8)',
            borderRadius: '9999px',
            padding: '6px 10px 6px 18px',
            boxShadow: isScrolled
              ? '0 12px 36px -4px rgba(24, 24, 27, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
              : '0 8px 24px -4px rgba(24, 24, 27, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
            transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '920px',
            width: '100%',
          }}
          className="floating-capsule-bar"
        >
          {/* Brand Monogram */}
          <a
            href="#home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              userSelect: 'none',
            }}
          >
            {isLoading || !settings?.brandName ? (
              <span
                style={{
                  display: 'inline-block',
                  width: '90px',
                  height: '16px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, rgba(229,169,30,0.08) 0%, rgba(229,169,30,0.2) 50%, rgba(229,169,30,0.08) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.9375rem',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {settings.brandName}
              </span>
            )}
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold)',
                display: 'inline-block',
              }}
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backgroundColor: 'rgba(24, 24, 27, 0.035)',
              padding: '3px 4px',
              borderRadius: '9999px',
              border: '1px solid rgba(24, 24, 27, 0.04)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    position: 'relative',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    transition: 'color 180ms ease',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activePillIndicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '9999px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
                        zIndex: -1,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {/* Quick Search */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08, backgroundColor: 'rgba(24, 24, 27, 0.06)' }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenSearch}
              aria-label="Search stories and photos"
              title="Search stories and photos"
              style={{
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <Search size={16} strokeWidth={2.2} />
            </motion.button>

            {/* Instagram Profile Link */}
            <motion.a
              href="https://instagram.com/amdqeis__"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Instagram profile @amdqeis__"
              title="Instagram @amdqeis__"
              whileHover={{ scale: 1.08, backgroundColor: 'rgba(24, 24, 27, 0.06)' }}
              whileTap={{ scale: 0.94 }}
              style={{
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                textDecoration: 'none',
              }}
              className="desktop-only"
            >
              <InstagramIcon size={16} />
            </motion.a>

            {/* Mobile Menu Toggle Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="mobile-menu-toggle"
              style={{
                display: 'none',
                color: 'var(--text-primary)',
                padding: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Floating Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              backgroundColor: 'rgba(18, 19, 22, 0.4)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -15, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -15, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '74px',
                left: '16px',
                right: '16px',
                backgroundColor: 'rgba(250, 248, 245, 0.98)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: activeSection === item.id ? 'var(--accent-gold-dark)' : 'var(--text-primary)',
                    padding: '8px 0',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              ))}
              <div
                style={{
                  marginTop: 'var(--space-3)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <a
                  href="https://instagram.com/amdqeis__"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  <InstagramIcon size={16} /> @amdqeis__
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-only {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
          .floating-capsule-bar {
            padding: 6px 12px 6px 16px !important;
          }
        }
      `}</style>
    </>
  );
};
