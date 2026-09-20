import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkGallery } from './components/WorkGallery';
import { AboutStory } from './components/AboutStory';
import { LatestStories } from './components/LatestStories';
import { InstagramStrip } from './components/InstagramStrip';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { StoryReaderModal } from './components/StoryReaderModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';
import { AdminPage } from './pages/AdminPage';
import { api } from './api/client';

import type { Photo, Story, ToastMessage, SiteSettings } from './types';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);
  const [activeSection, setActiveSection] = useState('home');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [_settings, setSettings] = useState<SiteSettings | null>(null);

  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
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
      const sections = ['home', 'portfolio', 'about', 'blog', 'contact'];
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

  // Fetch dynamic content from CMS SQLite backend on mount
  const fetchData = useCallback(async () => {
    try {
      const [fetchedPhotos, fetchedStories, fetchedSettings] = await Promise.all([
        api.getPhotos(),
        api.getStories(),
        api.getSettings(),
      ]);
      if (fetchedPhotos) {
        setPhotos(fetchedPhotos);
      }
      if (fetchedStories) {
        setStories(fetchedStories);
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
    } catch (err) {
      console.warn('Backend offline or API error, using static fallback content:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      subtitle: '@amdqeis__',
      imageUrl,
      aspectRatio: 'square',
      location: 'Global Field Assignment',
      year: '2024',
      exif: {
        camera: 'Sony Alpha 1',
        lens: 'FE 24-70mm f/2.8 GM II',
        aperture: 'f/2.8',
        shutterSpeed: '1/1000s',
        iso: '160',
        focalLength: '35mm',
      },
    };
    handleOpenPhoto(foundPhoto, 0);
  };

  const handleShareStory = (title: string) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link Copied', `"${title}" link copied to clipboard.`);
  };

  return (
    <div className="portfolio-app">
      {/* Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSection={activeSection}
        settings={_settings}
      />

      <main>
        {/* 1. Hero Section */}
        <Hero
          heroImageUrl={_settings?.heroImageUrl}
          settings={_settings}
          onViewPortfolio={() => {
            const el = document.getElementById('portfolio');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onReadStories={() => {
            const el = document.getElementById('blog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Explore My Work Gallery - Adaptive (supports photo-only or photo + caption) */}
        <WorkGallery
          photos={photos}
          onSelectPhoto={handleOpenPhoto}
        />

        {/* 3. About Me Storyteller Collage */}
        <AboutStory
          photo1={_settings?.aboutPhoto1}
          photo2={_settings?.aboutPhoto2}
          photo3={_settings?.aboutPhoto3}
          settings={_settings}
        />

        {/* 4. Latest Stories / Journal Grid */}
        <LatestStories
          stories={stories}
          onSelectStory={(story) => setSelectedStory(story)}
        />

        {/* 5. Instagram Showcase Band */}
        <InstagramStrip
          photos={photos}
          settings={_settings}
          onPhotoClick={handleInstagramPhotoClick}
        />

        {/* 6. Newsletter Subscription */}
        <Newsletter
          onSubscribeSuccess={(email) => {
            showToast('Subscribed!', `Welcome aboard. Updates will be sent to ${email}`);
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

      {/* Article Story Reading Drawer */}
      <StoryReaderModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onShare={handleShareStory}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        photos={photos}
        stories={stories}
        onSelectPhoto={handleOpenPhoto}
        onSelectStory={(story) => setSelectedStory(story)}
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
