import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkGallery } from './components/WorkGallery';
import { AboutStory } from './components/AboutStory';
import { InstagramStrip } from './components/InstagramStrip';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';
import { AdminPage } from './pages/AdminPage';
import { api } from './api/client';

import type { Photo, ToastMessage, SiteSettings } from './types';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [_settings, setSettings] = useState<SiteSettings | null>(null);

  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Path change listener for client-side navigation
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPathname(to);
    window.scrollTo(0, 0);
  };

  // ScrollSpy to sync active link in navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'portfolio', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic content from CMS PostgreSQL backend on mount
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedPhotos, fetchedSettings] = await Promise.all([
        api.getPhotos(),
        api.getSettings(),
      ]);
      if (fetchedPhotos) {
        setPhotos(fetchedPhotos);
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
    } catch (err) {
      console.warn('Backend API connection notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dynamically update document title from CMS Settings
  useEffect(() => {
    if (_settings?.fullName) {
      document.title = `${_settings.fullName.toUpperCase()} — Street Photography`;
    } else if (_settings?.brandName) {
      document.title = `${_settings.brandName.toUpperCase()} — Street Photography`;
    }
  }, [_settings]);

  const showToast = (title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // If user visits /admin, render the dedicated CMS Studio page
  if (pathname === '/admin' || pathname.startsWith('/admin')) {
    return <AdminPage onNavigate={navigate} />;
  }

  const handleOpenPhoto = (photo: Photo, index: number) => {
    setLightboxPhoto(photo);
    setLightboxIndex(index);
  };

  const handleNavigatePhoto = (newIndex: number) => {
    setLightboxIndex(newIndex);
    setLightboxPhoto(photos[newIndex]);
  };

  const handleInstagramPhotoClick = (imageUrl: string) => {
    const foundPhoto = photos.find((p) => p.imageUrl === imageUrl) || {
      id: 'ig-preview',
      title: 'INSTAGRAM DISPATCH',
      subtitle: _settings?.instagram || (_settings?.brandName ? `@${_settings.brandName}` : '@amdkey'),
      imageUrl,
      aspectRatio: 'square',
      location: 'Bandung, Indonesia',
      year: new Date().getFullYear().toString(),
      exif: {
        camera: 'Sony A6400',
        lens: 'Sony E 35mm f/1.8 OSS',
        aperture: 'f/2.8',
        shutterSpeed: '1/500s',
        iso: '400',
        focalLength: '35mm',
      },
    };
    handleOpenPhoto(foundPhoto, 0);
  };

  return (
    <div className="portfolio-app">
      {/* Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSection={activeSection}
        settings={_settings}
        isLoading={isLoading}
      />

      <main>
        {/* 1. Hero Section */}
        <Hero
          heroImageUrl={_settings?.heroImageUrl}
          settings={_settings}
          isLoading={isLoading}
          onViewPortfolio={() => {
            const el = document.getElementById('portfolio');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onReadStories={() => {
            const el = document.getElementById('about');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Explore My Work Gallery - Adaptive (supports photo-only or photo + caption) */}
        <WorkGallery
          photos={photos}
          isLoading={isLoading}
          onSelectPhoto={handleOpenPhoto}
        />

        {/* 3. About Me Storyteller Collage */}
        <AboutStory
          photo1={_settings?.aboutPhoto1}
          photo2={_settings?.aboutPhoto2}
          photo3={_settings?.aboutPhoto3}
          settings={_settings}
          isLoading={isLoading}
        />

        {/* 4. Instagram Showcase Band */}
        <InstagramStrip
          photos={photos}
          settings={_settings}
          isLoading={isLoading}
          onPhotoClick={handleInstagramPhotoClick}
        />

        {/* 5. Contact / Collaboration Section */}
        <Newsletter
          onSubscribeSuccess={(email) => {
            showToast('Sent!', `Message from ${email} received. Thank you!`);
          }}
        />
      </main>

      {/* 7. Comprehensive Footer (Clean, no admin buttons) */}
      <Footer settings={_settings} />

      {/* Lightbox Modal with EXIF Data */}
      <LightboxModal
        photo={lightboxPhoto}
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={handleNavigatePhoto}
      />


      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        photos={photos}
        stories={[]}
        onSelectPhoto={handleOpenPhoto}
        onSelectStory={() => {}}
      />

      {/* Tactile Feedback Toasts */}
      <Toast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
};

export default App;
