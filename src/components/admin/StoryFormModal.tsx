import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseGoogleDriveLink } from '../../utils/drive';
import type { Story } from '../../types';

interface StoryFormModalProps {
  isOpen: boolean;
  storyToEdit: Story | null;
  onClose: () => void;
  onSave: (storyData: Partial<Story>) => Promise<void>;
}

export const StoryFormModal: React.FC<StoryFormModalProps> = ({
  isOpen,
  storyToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('TRAVEL');
  const [date, setDate] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImageInput, setCoverImageInput] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentRaw, setContentRaw] = useState('');
  const [quote, setQuote] = useState('');
  const [location, setLocation] = useState('');

  const [previewUrl, setPreviewUrl] = useState('');
  const [isDrive, setIsDrive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (storyToEdit) {
      setTitle(storyToEdit.title);
      setTag(storyToEdit.tag);
      setDate(storyToEdit.date);
      setReadTime(storyToEdit.readTime);
      setCoverImageInput(storyToEdit.coverImage);
      setExcerpt(storyToEdit.excerpt);
      setContentRaw(storyToEdit.content.join('\n\n'));
      setQuote(storyToEdit.quote || '');
      setLocation(storyToEdit.location || '');

      const parsed = parseGoogleDriveLink(storyToEdit.coverImage);
      setPreviewUrl(parsed.directUrl);
      setIsDrive(parsed.isDriveLink);
    } else {
      setTitle('');
      setTag('TRAVEL');
      setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setReadTime('5 min read');
      setCoverImageInput('');
      setExcerpt('');
      setContentRaw('');
      setQuote('');
      setLocation('');
      setPreviewUrl('');
      setIsDrive(false);
    }
    setError('');
  }, [storyToEdit, isOpen]);

  const handleCoverChange = (val: string) => {
    setCoverImageInput(val);
    if (!val.trim()) {
      setPreviewUrl('');
      setIsDrive(false);
      return;
    }
    const parsed = parseGoogleDriveLink(val);
    setPreviewUrl(parsed.directUrl);
    setIsDrive(parsed.isDriveLink);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImageInput.trim() || !excerpt.trim()) {
      setError('Title, cover image, and excerpt are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const parsed = parseGoogleDriveLink(coverImageInput);
      const paragraphs = contentRaw
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      await onSave({
        title: title.trim(),
        tag: tag.trim().toUpperCase(),
        date: date.trim(),
        readTime: readTime.trim(),
        coverImage: parsed.directUrl,
        driveFileId: parsed.fileId,
        excerpt: excerpt.trim(),
        content: paragraphs.length > 0 ? paragraphs : [excerpt.trim()],
        quote: quote.trim() || undefined,
        location: location.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save story.');
    } finally {
      setIsSaving(false);
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
            zIndex: 160,
            backgroundColor: 'rgba(18, 19, 22, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            overflowY: 'auto',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: '#FFFFFF',
              maxWidth: '720px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '92vh',
              overflowY: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-gold-dark)',
                  }}
                >
                  Journal Article
                </span>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {storyToEdit ? 'Edit Field Story' : 'Create New Story'}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{ color: 'var(--text-muted)', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Title & Tag */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Story Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Hiking The Canadian Rockies..."
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Category Tag
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="TRAVEL">TRAVEL</option>
                    <option value="GEAR">GEAR</option>
                    <option value="WEDDING">WEDDING</option>
                    <option value="PORTRAIT">PORTRAIT</option>
                    <option value="TIPS">TIPS</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Google Drive Link */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <LinkIcon size={14} color="var(--accent-gold-dark)" />
                  <span>Cover Image Google Drive Link or URL *</span>
                </label>
                <input
                  type="text"
                  value={coverImageInput}
                  onChange={(e) => handleCoverChange(e.target.value)}
                  placeholder="Paste Drive link or image URL"
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.875rem',
                  }}
                />
                {isDrive && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
                    <Check size={14} />
                    <span>Google Drive link detected & transformed into streamable CDN URL</span>
                  </div>
                )}
              </div>

              {/* Live Image Preview */}
              {previewUrl && (
                <div style={{ height: '140px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#18181B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={previewUrl} alt="Cover preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              )}

              {/* Excerpt */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Excerpt / Lead Narrative *
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="A short punchy intro summary..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Full Paragraphs */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Full Article Content (Separate paragraphs with double enter)
                </label>
                <textarea
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  rows={5}
                  placeholder="Write the full story body here..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Pull Quote & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Pull Quote (Optional)
                  </label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Memorable quote from the shoot..."
                    style={{ width: '100%', height: '38px', padding: '0 12px', fontSize: '0.8125rem', border: '1px solid var(--border-medium)', borderRadius: '3px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Amalfi, Italy"
                    style={{ width: '100%', height: '38px', padding: '0 12px', fontSize: '0.8125rem', border: '1px solid var(--border-medium)', borderRadius: '3px' }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontSize: '0.75rem' }}>
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>

                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '8px 24px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#111215',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {isSaving ? 'Saving...' : storyToEdit ? 'Update Story' : 'Publish Story'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
