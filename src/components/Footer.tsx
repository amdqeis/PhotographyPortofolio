import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, TwitterIcon, FacebookIcon } from './Icons';
import type { SiteSettings } from '../types';

interface FooterProps {
  settings?: SiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings: _settings }) => {
  return (
    <footer
      id="contact"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-12)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1.3fr',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-12)',
          }}
          className="footer-grid"
        >
          {/* Brand Philosophy */}
          <div>
            <a
              href="#home"
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                lineHeight: 1,
                marginBottom: 'var(--space-4)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  letterSpacing: '0.04em',
                  color: 'var(--text-primary)',
                }}
              >
                portofolio
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                }}
              >
                PHOTOGRAPHER
              </span>
            </a>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '260px',
              }}
            >
              Documenting the unscripted moments of Bandung's streets, one frame at a time.
            </p>
          </div>

          {/* Column 1: PAGES */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              PAGES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Home', 'Portfolio', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: PORTFOLIO */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              PORTFOLIO
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Street', 'Human Interest', 'Nature', 'Candid'].map((item) => (
                <li key={item}>
                  <a
                    href="#portfolio"
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* Column 4: LET'S CONNECT */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              LET'S CONNECT
            </h4>

            {/* Social Icons row matching reference */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
              {[
                {
                  icon: InstagramIcon,
                  href: 'https://instagram.com/amdqeis__',
                  label: 'Instagram',
                },
                { icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
                { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
                { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                      e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>

            {/* Email, Phone & Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <a
                href="mailto:ahmad.qeis122@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Mail size={14} color="var(--accent-gold-dark)" />
                <span>ahmad.qeis122@gmail.com</span>
              </a>

              <a
                href="tel:081934193454"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Phone size={14} color="var(--accent-gold-dark)" />
                <span>+62 81934193454</span>
              </a>

              <a
                href="https://instagram.com/amdqeis__"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <InstagramIcon size={14} color="var(--accent-gold-dark)" />
                <span>@amdqeis__</span>
              </a>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <MapPin size={14} />
                <span>Bandung, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div
          style={{
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Ahmad Qeis. All rights reserved.
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 990px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
