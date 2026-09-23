import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Settings,
  Image as ImageIcon,
  BookOpen,
  LogOut,
  Save,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PhotoFormModal } from './PhotoFormModal';
import { StoryFormModal } from './StoryFormModal';
import { api } from '../../api/client';
import { parseGoogleDriveLink } from '../../utils/drive';
import type { Photo, Story, SiteSettings } from '../../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  photos: Photo[];
  stories: Story[];
  settings?: SiteSettings | null;
  onPhotosUpdated?: () => void;
  onStoriesUpdated?: () => void;
  onSettingsUpdated?: () => void;
  onDataChange?: () => void;
  showToast?: (title: string, message: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  photos,
  stories,
  settings,
  onPhotosUpdated,
  onStoriesUpdated,
  onSettingsUpdated,
  onDataChange,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'stories' | 'settings'>('photos');

  // Photo modal states
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhotoToEdit, setSelectedPhotoToEdit] = useState<Photo | null>(null);

  // Story modal states
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedStoryToEdit, setSelectedStoryToEdit] = useState<Story | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(
    settings || {
      heroImageUrl: '',
      aboutPhoto1: '',
      aboutPhoto2: '',
      aboutPhoto3: '',
      igPhoto1: '',
      igPhoto2: '',
      igPhoto3: '',
      igPhoto4: '',
      igPhoto5: '',
    }
  );

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Photo actions
  const handleSavePhoto = async (photoData: Partial<Photo>) => {
    if (selectedPhotoToEdit) {
      await api.updatePhoto(selectedPhotoToEdit.id, photoData);
      showToast?.('Photo Updated', 'Portfolio photo updated successfully.');
    } else {
      await api.createPhoto(photoData);
      showToast?.('Photo Added', 'New photo added to portfolio from Google Drive.');
    }
    onPhotosUpdated?.();
    onDataChange?.();
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this photo from the portfolio?')) {
      await api.deletePhoto(id);
      showToast?.('Photo Removed', 'The photo was removed.');
      onPhotosUpdated?.();
      onDataChange?.();
    }
  };

  // Story actions
  const handleSaveStory = async (storyData: Partial<Story>) => {
    if (selectedStoryToEdit) {
      await api.updateStory(selectedStoryToEdit.id, storyData);
      showToast?.('Story Updated', 'Field story updated.');
    } else {
      await api.createStory(storyData);
      showToast?.('Story Published', 'New field story published.');
    }
    onStoriesUpdated?.();
    onDataChange?.();
  };

  const handleDeleteStory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      await api.deleteStory(id);
      showToast?.('Story Deleted', 'The story was deleted.');
      onStoriesUpdated?.();
      onDataChange?.();
    }
  };

  // Settings actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings(settingsForm);
      showToast?.('Settings Saved', 'Site configuration and contact info updated live.');
      onSettingsUpdated?.();
      onDataChange?.();
    } catch {
      showToast?.('Error', 'Failed to update settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 140,
        backgroundColor: 'rgba(18, 19, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'center',
        padding: 'var(--space-6) var(--space-4)',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundColor: '#FFFFFF',
          maxWidth: '1080px',
          width: '100%',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-8)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
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
                Content Management System
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {'STUDIO CMS'}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={onLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#DC2626',
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: '#FEE2E2',
              }}
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Studio"
              style={{ color: 'var(--text-muted)', padding: '6px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF',
            padding: '0 var(--space-8)',
            gap: 'var(--space-6)',
          }}
        >
          {[
            { id: 'photos', label: `Photos (${photos.length})`, icon: ImageIcon },
            { id: 'stories', label: `Field Stories (${stories.length})`, icon: BookOpen },
            { id: 'settings', label: 'Site Settings & Contact', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 0',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: isActive ? 'var(--accent-gold-dark)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2.5px solid var(--accent-gold)' : '2.5px solid transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8)' }}>
          {/* TAB 1: PHOTOS */}
          {activeTab === 'photos' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Portfolio Photo Stream</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Add photos via Google Drive links. Captions are optional — cards adapt automatically.
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPhotoToEdit(null);
                    setPhotoModalOpen(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#111215',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Plus size={16} />
                  <span>Add Photo via Drive</span>
                </motion.button>
              </div>

              {/* Photos Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                {photos.map((photo) => {
                  const hasCaption = Boolean(photo.title || photo.subtitle);
                  return (
                    <div
                      key={photo.id}
                      style={{
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        backgroundColor: 'var(--bg-canvas)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ height: '160px', position: 'relative', backgroundColor: '#18181B' }}>
                        <img
                          src={photo.imageUrl}
                          alt={photo.title || 'Portfolio item'}
                          referrerPolicy="no-referrer"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            backgroundColor: hasCaption ? 'rgba(0,0,0,0.65)' : 'rgba(229, 169, 30, 0.9)',
                            color: hasCaption ? '#FFFFFF' : '#111215',
                            fontSize: '0.625rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '2px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {hasCaption ? 'With Caption' : 'Pure Photo'}
                        </div>
                      </div>

                      <div style={{ padding: 'var(--space-3)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {photo.title || '(No Title / Pure Photo)'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                          {photo.location || 'Location unspecified'}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPhotoToEdit(photo);
                              setPhotoModalOpen(true);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              fontWeight: 600,
                            }}
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              color: '#DC2626',
                              fontWeight: 600,
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STORIES */}
          {activeTab === 'stories' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Field Stories & Journal</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Manage articles and stories displayed on the homepage.
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedStoryToEdit(null);
                    setStoryModalOpen(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#111215',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  <Plus size={16} />
                  <span>Create Story</span>
                </motion.button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {stories.map((story) => (
                  <div
                    key={story.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-canvas)',
                    }}
                  >
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 800,
                            color: 'var(--accent-gold-dark)',
                            backgroundColor: 'var(--accent-gold-subtle)',
                            padding: '2px 6px',
                            borderRadius: '2px',
                          }}
                        >
                          {story.tag}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{story.date}</span>
                      </div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {story.title}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStoryToEdit(story);
                          setStoryModalOpen(true);
                        }}
                        style={{ color: 'var(--text-secondary)', padding: '6px' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStory(story.id)}
                        style={{ color: '#DC2626', padding: '6px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2px' }}>Image Management</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Kelola gambar website — hero background, foto about, dan foto instagram strip. Informasi personal sudah ditentukan di kode.
                </p>
              </div>

              {/* Section Images */}

              <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '4px' }}>
                  Website Editorial & Profile Imagery (Google Drive Links)
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  All website images are managed via public Google Drive links without storing files on disk.
                </p>

                {/* Hero Image */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                    1. Hero Section Background (Drive Link)
                  </label>
                  <input
                    type="text"
                    placeholder="Google Drive link for Hero background..."
                    value={settingsForm.heroImageUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 12px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                  />
                  {settingsForm.heroImageUrl && (
                    <img
                      src={parseGoogleDriveLink(settingsForm.heroImageUrl).directUrl}
                      alt="Hero preview"
                      referrerPolicy="no-referrer"
                      style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '4px', marginTop: '6px' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>

                {/* About Photos */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '4px' }}>
                      2. About Foto 1 (Portrait)
                    </label>
                    <input
                      type="text"
                      placeholder="Link Drive..."
                      value={settingsForm.aboutPhoto1 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutPhoto1: e.target.value })}
                      style={{ width: '100%', height: '36px', padding: '0 8px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '4px' }}>
                      3. About Foto 2 (Vista)
                    </label>
                    <input
                      type="text"
                      placeholder="Link Drive..."
                      value={settingsForm.aboutPhoto2 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutPhoto2: e.target.value })}
                      style={{ width: '100%', height: '36px', padding: '0 8px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '4px' }}>
                      4. About Foto 3 (B&W)
                    </label>
                    <input
                      type="text"
                      placeholder="Link Drive..."
                      value={settingsForm.aboutPhoto3 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutPhoto3: e.target.value })}
                      style={{ width: '100%', height: '36px', padding: '0 8px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-2)' }}>
                <motion.button
                  type="submit"
                  disabled={isSavingSettings}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#111215',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-xs)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Save size={16} />
                  <span>{isSavingSettings ? 'Saving...' : 'Save Settings Live'}</span>
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>

      {/* Sub-modals */}
      <PhotoFormModal
        isOpen={photoModalOpen}
        photoToEdit={selectedPhotoToEdit}
        onClose={() => setPhotoModalOpen(false)}
        onSave={handleSavePhoto}
      />

      <StoryFormModal
        isOpen={storyModalOpen}
        storyToEdit={selectedStoryToEdit}
        onClose={() => setStoryModalOpen(false)}
        onSave={handleSaveStory}
      />
    </div>
  );
};
