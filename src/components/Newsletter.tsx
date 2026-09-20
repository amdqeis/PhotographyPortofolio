import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterProps {
  onSubscribeSuccess: (email: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onSubscribeSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSubmitted(true);
    onSubscribeSuccess(cleanEmail);
    setEmail('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section
      style={{
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-12)',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-6) var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-6)',
            boxShadow: 'var(--shadow-sm)',
          }}
          className="newsletter-card-wrap"
        >
          {/* Left Info with Circle Mail Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-5)',
              maxWidth: '560px',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--surface-subtle)',
                flexShrink: 0,
              }}
            >
              <Mail size={22} strokeWidth={1.8} />
            </motion.div>

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  marginBottom: '2px',
                }}
              >
                STAY INSPIRED
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}
              >
                Get photography tips, behind the scenes and travel stories straight to your inbox.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div style={{ flex: 1, maxWidth: '440px' }}>
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#166534',
                    backgroundColor: '#DCFCE7',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>You're on the list! Watch your inbox soon.</span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Your email address"
                    aria-label="Email address"
                    style={{
                      flex: 1,
                      height: '46px',
                      padding: '0 16px',
                      fontSize: '0.875rem',
                      border: '1px solid var(--border-medium)',
                      borderRight: 'none',
                      borderRadius: 'var(--radius-xs) 0 0 var(--radius-xs)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      minWidth: '180px',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold-dark)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ backgroundColor: '#D19414' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      height: '46px',
                      padding: '0 24px',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#111215',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      borderRadius: '0 var(--radius-xs) var(--radius-xs) 0',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    SUBSCRIBE
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', fontWeight: 500 }}>
                {error}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .newsletter-card-wrap {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: var(--space-6) !important;
          }
          .newsletter-card-wrap > div {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};
