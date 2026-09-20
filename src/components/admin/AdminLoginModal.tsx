import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api/client';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (token: string) => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the CMS key password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await api.login(password.trim());
      if (res.success && res.token) {
        localStorage.setItem('cms_token', res.token);
        if (onLoginSuccess) onLoginSuccess(res.token);
        if (onSuccess) onSuccess();
        setPassword('');
        onClose();
      } else {
        setError(res.message || 'Invalid key password.');
      }
    } catch {
      setError('Failed to connect to backend server. Make sure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            backgroundColor: 'rgba(18, 19, 22, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: '#FFFFFF',
              maxWidth: '420px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: 'var(--space-5)',
                right: 'var(--space-5)',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>

            {/* Icon & Title */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--accent-gold-subtle)',
                  color: 'var(--accent-gold-dark)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Lock size={24} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                CMS Studio Access
              </h3>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Enter the master credential key password to manage portfolio photos, stories, and site settings.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label
                  htmlFor="cms-password"
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  Credential Key Password
                </label>

                <div style={{ position: 'relative' }}>
                  <input
                    id="cms-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter key password..."
                    autoFocus
                    style={{
                      width: '100%',
                      height: '46px',
                      padding: '0 42px 0 14px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      backgroundColor: 'var(--bg-canvas)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold-dark)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      padding: '4px',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      color: '#DC2626',
                      fontSize: '0.75rem',
                      marginTop: '6px',
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#111215',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Unlock Studio</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Note */}
            <div
              style={{
                marginTop: 'var(--space-4)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={14} color="var(--accent-gold-dark)" />
              <span>Protected by master key: Ra_sy6a7e2</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
