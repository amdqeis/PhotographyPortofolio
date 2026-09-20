import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        right: 'var(--space-6)',
        zIndex: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            backgroundColor: '#18181B',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-xs)',
            padding: '12px 18px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '280px',
            animation: 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <CheckCircle2 size={18} color="var(--accent-gold)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {toast.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {toast.message}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            style={{ color: 'rgba(255, 255, 255, 0.5)', padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(12px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
