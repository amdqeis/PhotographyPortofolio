import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Check, AlertCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseGoogleDriveLink } from '../../utils/drive';
import type { Photo } from '../../types';

interface PhotoFormModalProps {
  isOpen: boolean;
  photoToEdit: Photo | null;
  onClose: () => void;
  onSave: (photoData: Partial<Photo>) => Promise<void>;
}

export const PhotoFormModal: React.FC<PhotoFormModalProps> = ({
  isOpen,
  photoToEdit,
  onClose,
  onSave,
}) => {
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [camera, setCamera] = useState('');
  const [lens, setLens] = useState('');
  const [aperture, setAperture] = useState('');
  const [shutterSpeed, setShutterSpeed] = useState('');
  const [iso, setIso] = useState('');
  const [focalLength, setFocalLength] = useState('');

  const [previewUrl, setPreviewUrl] = useState('');
  const [isDrive, setIsDrive] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (photoToEdit) {
      setImageUrlInput(photoToEdit.imageUrl);
      setTitle(photoToEdit.title || '');
      setSubtitle(photoToEdit.subtitle || '');
      setLocation(photoToEdit.location || '');
      setYear(photoToEdit.year || '');
      setCamera(photoToEdit.exif?.camera || '');
      setLens(photoToEdit.exif?.lens || '');
      setAperture(photoToEdit.exif?.aperture || '');
      setShutterSpeed(photoToEdit.exif?.shutterSpeed || '');
      setIso(photoToEdit.exif?.iso || '');
      setFocalLength(photoToEdit.exif?.focalLength || '');

      const parsed = parseGoogleDriveLink(photoToEdit.imageUrl);
      setPreviewUrl(parsed.directUrl);
      setIsDrive(parsed.isDriveLink);
      setFileId(parsed.fileId);
    } else {
      setImageUrlInput('');
      setTitle('');
      setSubtitle('');
      setLocation('');
      setYear(new Date().getFullYear().toString());
      setCamera('');
      setLens('');
      setAperture('');
      setShutterSpeed('');
      setIso('');
      setFocalLength('');
      setPreviewUrl('');
      setIsDrive(false);
      setFileId(null);
    }
    setError('');
  }, [photoToEdit, isOpen]);

  // Handle URL change & live Drive parsing
  const handleUrlChange = (val: string) => {
    setImageUrlInput(val);
    if (!val.trim()) {
      setPreviewUrl('');
      setIsDrive(false);
      setFileId(null);
      return;
    }

    const parsed = parseGoogleDriveLink(val);
    setPreviewUrl(parsed.directUrl);
    setIsDrive(parsed.isDriveLink);
    setFileId(parsed.fileId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) {
      setError('Please provide a Google Drive share link or image URL.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const parsed = parseGoogleDriveLink(imageUrlInput);
      await onSave({
        imageUrl: parsed.directUrl,
        driveFileId: parsed.fileId,
        title: title.trim() || undefined,
        subtitle: subtitle.trim() || undefined,
        location: location.trim() || undefined,
        year: year.trim() || undefined,
        exif: {
          camera: camera.trim() || undefined,
          lens: lens.trim() || undefined,
          aperture: aperture.trim() || undefined,
          shutterSpeed: shutterSpeed.trim() || undefined,
          iso: iso.trim() || undefined,
          focalLength: focalLength.trim() || undefined,
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save photo.');
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
              maxWidth: '680px',
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
            {/* Header */}
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
                  Portfolio Asset
                </span>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {photoToEdit ? 'Edit Portfolio Photo' : 'Add Photo via Google Drive'}
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
              {/* Google Drive Link Input */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '6px',
                  }}
                >
                  <LinkIcon size={14} color="var(--accent-gold-dark)" />
                  <span>Google Drive Link or Image URL *</span>
                </label>

                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Paste Drive link (e.g. https://drive.google.com/file/d/1A2B3C.../view?usp=sharing)"
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'var(--bg-canvas)',
                  }}
                />

                {isDrive && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      color: '#166534',
                      marginTop: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <Check size={14} />
                    <span>Valid Google Drive Link detected (File ID: {fileId?.slice(0, 10)}...)</span>
                  </div>
                )}
              </div>

              {/* Live Preview Box */}
              {previewUrl && (
                <div
                  style={{
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: '#18181B',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Live preview"
                    referrerPolicy="no-referrer"
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    onError={() => {
                      setError('Could not load image preview. Ensure the Google Drive file is set to "Anyone with the link can view".');
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#FFFFFF',
                      fontSize: '0.6875rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600,
                    }}
                  >
                    Live Preview
                  </div>
                </div>
              )}

              {/* Title & Subtitle (Optional for adaptive pure photo mode) */}
              <div
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Caption & Title (Optional)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                  If left empty, the photo will display in <strong>pure photo mode</strong> with no empty text/badges.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. PORTRAITS, BROMO VISTA..."
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-medium)',
                        fontSize: '0.8125rem',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Subtitle / Action Prompt (Optional)
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. View Gallery →"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-medium)',
                        fontSize: '0.8125rem',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Location & Year */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bali, Indonesia"
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 12px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.8125rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Year (Optional)
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 12px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.8125rem',
                    }}
                  />
                </div>
              </div>

              {/* Optional Camera EXIF Settings */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <Camera size={13} color="var(--accent-gold-dark)" />
                  <span>Camera EXIF Metadata (Optional)</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
                  <input
                    type="text"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    placeholder="Camera (Sony A7)"
                    style={{ height: '34px', padding: '0 8px', fontSize: '0.75rem', border: '1px solid var(--border-medium)', borderRadius: '3px' }}
                  />
                  <input
                    type="text"
                    value={lens}
                    onChange={(e) => setLens(e.target.value)}
                    placeholder="Lens (35mm f/1.4)"
                    style={{ height: '34px', padding: '0 8px', fontSize: '0.75rem', border: '1px solid var(--border-medium)', borderRadius: '3px' }}
                  />
                  <input
                    type="text"
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                    placeholder="Aperture (f/1.8)"
                    style={{ height: '34px', padding: '0 8px', fontSize: '0.75rem', border: '1px solid var(--border-medium)', borderRadius: '3px' }}
                  />
                  <input
                    type="text"
                    value={shutterSpeed}
                    onChange={(e) => setShutterSpeed(e.target.value)}
                    placeholder="Shutter (1/500s)"
                    style={{ height: '34px', padding: '0 8px', fontSize: '0.75rem', border: '1px solid var(--border-medium)', borderRadius: '3px' }}
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
                    color: 'var(--text-secondary)',
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
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {isSaving ? 'Saving...' : photoToEdit ? 'Update Photo' : 'Add to Portfolio'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
