import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Settings,
  Image as ImageIcon,
  BookOpen,
  LogOut,
  Save,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PhotoFormModal } from '../components/admin/PhotoFormModal';
import { StoryFormModal } from '../components/admin/StoryFormModal';
import { api } from '../api/client';
import { parseGoogleDriveLink } from '../utils/drive';
import type { Photo, Story, SiteSettings } from '../types';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => api.isAuthenticated());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Studio state
  const [activeTab, setActiveTab] = useState<'photos' | 'stories' | 'settings'>('photos');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [_settings, setSettings] = useState<SiteSettings | null>(null);

  // Modals state
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhotoToEdit, setSelectedPhotoToEdit] = useState<Photo | null>(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedStoryToEdit, setSelectedStoryToEdit] = useState<Story | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({
    heroImageUrl: '',
    aboutPhoto1: '',
    aboutPhoto2: '',
    aboutPhoto3: '',
    igPhoto1: '',
    igPhoto2: '',
    igPhoto3: '',
    igPhoto4: '',
    igPhoto5: '',
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (title: string, message: string) => {
    const type = title.startsWith('❌') ? 'error' : 'success';
    setToast({ title, message, type });
    setTimeout(() => setToast(null), type === 'error' ? 5000 : 3500);
  };

  // Fetch all CMS data from backend
  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [p, s, st] = await Promise.all([
        api.getPhotos(),
        api.getStories(),
        api.getSettings(),
      ]);
      setPhotos(p);
      setStories(s);
      if (st) {
        setSettings(st);
        setSettingsForm(st);
      }
    } catch {
      showToast('Error', 'Gagal terhubung ke server. Pastikan backend berjalan dan database aktif.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError('Please enter the administrative key password.');
      return;
    }

    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await api.login(password.trim());
      if (res.success && res.token) {
        localStorage.setItem('cms_token', res.token);
        setIsAuthenticated(true);
        setPassword('');
        showToast('Authenticated', 'Welcome back to Studio CMS.');
      } else {
        setLoginError(res.message || 'Invalid key password.');
      }
    } catch {
      setLoginError('Could not reach backend server. Make sure the server is running on port 3001.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    showToast('Logged Out', 'CMS session ended.');
  };

  // Photo handlers
  const handleSavePhoto = async (photoData: Partial<Photo>) => {
    try {
      if (selectedPhotoToEdit) {
        const res = await api.updatePhoto(selectedPhotoToEdit.id, photoData);
        if (!res.success) {
          throw new Error(res.message || 'Failed to update photo in the database.');
        }
        showToast('Photo Updated', 'Portfolio photo updated successfully.');
      } else {
        const res = await api.createPhoto(photoData);
        if (!res.success) {
          throw new Error(res.message || 'Failed to save photo to the database.');
        }
        showToast('Photo Published', 'New Google Drive photo linked to portfolio.');
      }
      await loadData();
    } catch (err: any) {
      showToast('❌ DB Error', err.message || 'Failed to save photo. Check server connection.');
      throw err; // re-throw so PhotoFormModal can show inline error too
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this photo from the portfolio?')) {
      try {
        const res = await api.deletePhoto(id);
        if (!res.success) {
          throw new Error(res.message || 'Failed to delete photo from the database.');
        }
        showToast('Photo Removed', 'The photo was removed from the database.');
        await loadData();
      } catch (err: any) {
        showToast('❌ DB Error', err.message || 'Failed to delete photo. Check server connection.');
      }
    }
  };

  // Story handlers
  const handleSaveStory = async (storyData: Partial<Story>) => {
    try {
      if (selectedStoryToEdit) {
        const res = await api.updateStory(selectedStoryToEdit.id, storyData);
        if (!res.success) {
          throw new Error(res.message || 'Failed to update story in the database.');
        }
        showToast('Story Updated', 'Field story updated successfully.');
      } else {
        const res = await api.createStory(storyData);
        if (!res.success) {
          throw new Error(res.message || 'Failed to save story to the database.');
        }
        showToast('Story Published', 'New field story published.');
      }
      await loadData();
    } catch (err: any) {
      showToast('❌ DB Error', err.message || 'Failed to save story. Check server connection.');
      throw err;
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const res = await api.deleteStory(id);
        if (!res.success) {
          throw new Error(res.message || 'Failed to delete story from the database.');
        }
        showToast('Story Deleted', 'The story was deleted from the database.');
        await loadData();
      } catch (err: any) {
        showToast('❌ DB Error', err.message || 'Failed to delete story. Check server connection.');
      }
    }
  };

  // Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await api.updateSettings(settingsForm);
      if (!res.success) {
        throw new Error(res.message || 'Server rejected the settings changes.');
      }
      showToast('Settings Saved', 'Site configuration saved to database successfully.');
      await loadData();
    } catch (err: any) {
      showToast('❌ DB Error', err.message || 'Failed to save settings. Check database connection.');
    } finally {
      setIsSavingSettings(false);
    }
  };


  // -------------------------------------------------------------
  // 1. RENDER LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0E0F12',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229, 169, 30, 0.12) 0%, transparent 70%)',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Back to Site Button */}
        <div style={{ position: 'absolute', top: '28px', left: '28px' }}>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#D4D4D8',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            <ArrowLeft size={16} /> Return to Portfolio
          </button>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#18191E',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '40px 36px',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
            zIndex: 10,
          }}
        >
          {/* Brand & Badge */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229, 169, 30, 0.15)',
                border: '1px solid rgba(229, 169, 30, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--accent-gold)',
              }}
            >
              <Lock size={22} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '0.06em',
                marginBottom: '6px',
                color: '#FFFFFF',
              }}
            >
              AMDKEY
            </h1>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
              }}
            >
              CMS STUDIO CONTROL PANEL
            </p>
          </div>

          {loginError && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#A1A1AA',
                  marginBottom: '8px',
                }}
              >
                Key Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter credential key..."
                  autoFocus
                  style={{
                    width: '100%',
                    backgroundColor: '#101115',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 42px 12px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                width: '100%',
                backgroundColor: 'var(--accent-gold)',
                color: '#18181B',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.04em',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                transition: 'all 200ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoggingIn ? 'Authenticating...' : 'Enter Studio →'}
            </button>
          </form>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#71717A',
            }}
          >
            {'Portfolio CMS — Image Management'}
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. RENDER FULL-PAGE ADMIN STUDIO (When authenticated)
  // -------------------------------------------------------------
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAF8F5',
        color: '#18181B',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Studio Header Bar */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 32px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.125rem',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
              }}
            >
              {'STUDIO CMS'}
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold-dark)',
              }}
            >
              CMS Studio • /admin
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
              }}
            />
            Live Sync Active
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            <Globe size={15} />
            View Live Portfolio
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#DC2626',
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div style={{ flex: 1, padding: '32px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
        {/* Studio Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-medium)',
            paddingBottom: '16px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'photos' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'photos' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 180ms ease',
              }}
            >
              <ImageIcon size={16} />
              Photos ({isLoadingData ? '...' : photos.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stories')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'stories' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'stories' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 180ms ease',
              }}
            >
              <BookOpen size={16} />
              Stories ({isLoadingData ? '...' : stories.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'settings' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'settings' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 180ms ease',
              }}
            >
              <Settings size={16} />
              Site Settings
            </button>
          </div>

          {activeTab === 'photos' && (
            <button
              type="button"
              onClick={() => {
                setSelectedPhotoToEdit(null);
                setPhotoModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--accent-gold)',
                color: '#18181B',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(229, 169, 30, 0.25)',
              }}
            >
              <Plus size={16} /> Add Photo via Google Drive
            </button>
          )}

          {activeTab === 'stories' && (
            <button
              type="button"
              onClick={() => {
                setSelectedStoryToEdit(null);
                setStoryModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--accent-gold)',
                color: '#18181B',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(229, 169, 30, 0.25)',
              }}
            >
              <Plus size={16} /> Write Field Story
            </button>
          )}
        </div>

        {/* ----------------- TAB 1: PHOTOS ----------------- */}
        {activeTab === 'photos' && (
          <div>
            <div
              style={{
                backgroundColor: 'rgba(229, 169, 30, 0.08)',
                border: '1px solid rgba(229, 169, 30, 0.25)',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '24px',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>Google Drive Direct Linking:</strong> Paste any public
              sharing link. The server never saves image files on disk; photos stream through Google's direct CDN.
              Captions (title/subtitle) are <em>completely optional</em> — photos without captions render in a clean,
              borderless view.
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {photos.map((photo, index) => {
                const isPhotoOnly = !photo.title && !photo.subtitle;
                return (
                  <div
                    key={photo.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-medium)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: '#EAE6DF' }}>
                      <img
                        src={photo.imageUrl}
                        alt={photo.title || 'Portfolio item'}
                        referrerPolicy="no-referrer"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(24, 24, 27, 0.75)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                        }}
                      >
                        #{index + 1}
                      </div>

                      {photo.driveFileId && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(16, 185, 129, 0.85)',
                            color: '#FFFFFF',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.625rem',
                            fontWeight: 700,
                          }}
                        >
                          Drive CDN
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ marginBottom: '12px', flex: 1 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            color: isPhotoOnly ? 'var(--text-muted)' : 'var(--text-primary)',
                            fontStyle: isPhotoOnly ? 'italic' : 'normal',
                          }}
                        >
                          {photo.title || 'Untitled Photo (No Caption)'}
                        </div>
                        {photo.subtitle && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)', marginTop: '2px' }}>
                            {photo.subtitle}
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {[photo.location, photo.year].filter(Boolean).join(' • ') || 'Location Unspecified'}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '8px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-subtle)',
                        }}
                      >
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
                            backgroundColor: 'var(--surface-subtle)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#DC2626',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: STORIES ----------------- */}
        {activeTab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stories.map((story) => (
              <div
                key={story.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-medium)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: 'var(--accent-gold-dark)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {story.tag} • {story.date}
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        margin: '4px 0 6px',
                      }}
                    >
                      {story.title}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
                      {story.excerpt}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStoryToEdit(story);
                      setStoryModalOpen(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteStory(story.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#DC2626',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------- TAB 3: SETTINGS ----------------- */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--border-medium)',
              padding: '32px',
              maxWidth: '800px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                marginBottom: '24px',
              }}
            >
              Image Management
            </h2>

            {/* IMAGE SETTINGS ONLY — personal info is hardcoded in components */}
            <div
              style={{
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(229, 169, 30, 0.08)',
                  border: '1px solid rgba(229, 169, 30, 0.25)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '24px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Image Management Only:</strong> Tab ini hanya untuk mengelola gambar — hero, foto profil about, dan foto Instagram strip. Informasi personal (nama, bio, kontak) sudah ditentukan langsung di kode aplikasi.
              </div>
            </div>
            <div
              style={{
                marginTop: '32px',
                marginBottom: '28px',
                paddingTop: '28px',
                borderTop: '1px solid var(--border-medium)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ImageIcon size={20} color="var(--accent-gold-dark)" />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    margin: 0,
                    color: 'var(--text-primary)',
                  }}
                >
                  Editorial & Profile Imagery (CMS Managed)
                </h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                All main website images (Hero background & 3 profile collage photos) are fully managed through this CMS. Enter a <strong>public Google Drive link</strong> (Share &rarr; Anyone with the link &rarr; Viewer) or a direct image URL. The system automatically streams via a high-speed CDN without storing files on the server.
              </p>

              {/* 1. Hero Section Image */}
              <div
                style={{
                  marginBottom: '20px',
                  backgroundColor: 'var(--surface-subtle)',
                  padding: '18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    1. Hero Section Background Photo
                  </label>
                  {settingsForm.heroImageUrl && parseGoogleDriveLink(settingsForm.heroImageUrl).isDriveLink && (
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(34, 197, 94, 0.12)',
                        color: '#16A34A',
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Google Drive Link Detected
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Foto latar belakang spektakuler beresolusi tinggi di bagian teratas website (Hero banner).
                </p>
                <input
                  type="text"
                  placeholder="Paste Google Drive sharing link atau direct image URL..."
                  value={settingsForm.heroImageUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                />
                {settingsForm.heroImageUrl && (
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={parseGoogleDriveLink(settingsForm.heroImageUrl).directUrl}
                      alt="Hero Live Preview"
                      referrerPolicy="no-referrer"
                      style={{
                        width: '140px',
                        height: '78px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid var(--border-medium)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Live Hero Preview. Tampil di latar belakang hero section dengan efek parallax halus.
                    </span>
                  </div>
                )}
              </div>

              {/* 3 Profile / About Photos Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Photo 1: Main Portrait */}
                <div
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        2. About: Main Photo (Explorer)
                      </label>
                      {settingsForm.aboutPhoto1 && parseGoogleDriveLink(settingsForm.aboutPhoto1).isDriveLink && (
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#16A34A' }}>Drive OK</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Portrait photo of the photographer with camera in the About collage.
                    </p>
                    <input
                      type="text"
                      placeholder="Google Drive link for photo 1..."
                      value={settingsForm.aboutPhoto1 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutPhoto1: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.8125rem',
                      }}
                    />
                  </div>
                  {settingsForm.aboutPhoto1 && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={parseGoogleDriveLink(settingsForm.aboutPhoto1).directUrl}
                        alt="About Photo 1 Preview"
                        referrerPolicy="no-referrer"
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--border-medium)',
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Photo 2: Vista / Landscape */}
                <div
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        3. About: Field Photo
                      </label>
                      {settingsForm.aboutPhoto2 && parseGoogleDriveLink(settingsForm.aboutPhoto2).isDriveLink && (
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#16A34A' }}>Drive OK</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Cliff / field action photo in the About collage.
                    </p>
                    <input
                      type="text"
                      placeholder="Google Drive link for photo 2..."
                      value={settingsForm.aboutPhoto2 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutPhoto2: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.8125rem',
                      }}
                    />
                  </div>
                  {settingsForm.aboutPhoto2 && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={parseGoogleDriveLink(settingsForm.aboutPhoto2).directUrl}
                        alt="About Photo 2 Preview"
                        referrerPolicy="no-referrer"
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--border-medium)',
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Photo 3: Artistic B&W Portrait */}
                <div
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        4. About: Artistic B&W Photo
                      </label>
                      {settingsForm.aboutPhoto3 && parseGoogleDriveLink(settingsForm.aboutPhoto3).isDriveLink && (
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#16A34A' }}>Drive OK</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Close-up / artistic black and white portrait photo.
                    </p>
                    <input
                      type="text"
                      placeholder="Google Drive link for photo 3..."
                      value={settingsForm.aboutPhoto3 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutPhoto3: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.8125rem',
                      }}
                    />
                  </div>
                  {settingsForm.aboutPhoto3 && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={parseGoogleDriveLink(settingsForm.aboutPhoto3).directUrl}
                        alt="About Photo 3 Preview"
                        referrerPolicy="no-referrer"
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--border-medium)',
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* INSTAGRAM SHOWCASE STRIP CONFIGURATION */}
              <div
                style={{
                  marginTop: '28px',
                  backgroundColor: 'var(--surface-subtle)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ImageIcon size={18} color="var(--accent-gold-dark)" />
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>
                    Instagram Showcase Strip (Header & 5 Feed Photos)
                  </h4>
                </div>
                <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Manage the 5 photos displayed in the Instagram strip at the bottom of the website. Enter a <strong>public Google Drive link</strong> for each slot. If a slot is left empty, the system will automatically pull the 5 most recent portfolio photos you uploaded via CMS. No hardcoded images.
                </p>


                {/* 5 Instagram Photos Inputs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  {[1, 2, 3, 4, 5].map((num) => {
                    const key = `igPhoto${num}` as keyof SiteSettings;
                    const val = (settingsForm[key] as string) || '';
                    const isDrive = val ? parseGoogleDriveLink(val).isDriveLink : false;
                    const previewUrl = val ? parseGoogleDriveLink(val).directUrl : '';

                    return (
                      <div
                        key={num}
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-medium)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              Foto IG #{num}
                            </span>
                            {isDrive && (
                              <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#16A34A' }}>Drive OK</span>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Link Drive..."
                            value={val}
                            onChange={(e) => setSettingsForm({ ...settingsForm, [key]: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-medium)',
                              fontSize: '0.75rem',
                            }}
                          />
                        </div>

                        {val ? (
                          <div style={{ marginTop: '8px' }}>
                            <img
                              src={previewUrl}
                              alt={`IG Slot ${num}`}
                              referrerPolicy="no-referrer"
                              style={{
                                width: '100%',
                                height: '70px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid var(--border-medium)',
                              }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              marginTop: '8px',
                              height: '70px',
                              borderRadius: '4px',
                              border: '1px dashed var(--border-medium)',
                              backgroundColor: 'rgba(0,0,0,0.02)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-tertiary)',
                              fontSize: '0.6875rem',
                            }}
                          >
                            Auto CMS
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              style={{
                backgroundColor: 'var(--text-primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Save size={16} /> {isSavingSettings ? 'Saving...' : 'Save Site Settings'}
            </button>
          </form>
        )}
      </div>

      {/* Photo Form Modal */}
      <PhotoFormModal
        isOpen={photoModalOpen}
        photoToEdit={selectedPhotoToEdit}
        onClose={() => setPhotoModalOpen(false)}
        onSave={handleSavePhoto}
      />

      {/* Story Form Modal */}
      <StoryFormModal
        isOpen={storyModalOpen}
        storyToEdit={selectedStoryToEdit}
        onClose={() => setStoryModalOpen(false)}
        onSave={handleSaveStory}
      />

      {/* Studio Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toast.type === 'error' ? '#1E0A0A' : '#18181B',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: '8px',
            boxShadow: toast.type === 'error'
              ? '0 10px 30px rgba(220, 38, 38, 0.3)'
              : '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            zIndex: 9999,
            border: toast.type === 'error'
              ? '1px solid rgba(220, 38, 38, 0.4)'
              : '1px solid rgba(255,255,255,0.06)',
            maxWidth: '380px',
          }}
        >
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '1px' }} />
            : <CheckCircle size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '1px' }} />
          }
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: toast.type === 'error' ? '#FCA5A5' : '#FFFFFF' }}>
              {toast.title.replace('❌ ', '')}
            </div>
            <div style={{ fontSize: '0.75rem', color: toast.type === 'error' ? '#F87171' : '#A1A1AA', marginTop: '2px', lineHeight: 1.4 }}>
              {toast.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
