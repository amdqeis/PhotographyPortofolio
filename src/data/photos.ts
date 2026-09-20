import type { Photo } from '../types';

export const HERO_PHOTO = {
  imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
  photographerSeatUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=2000&q=85',
};

export const PORTFOLIO_PHOTOS: Photo[] = [
  {
    id: 'photo-1',
    title: 'PORTRAITS',
    subtitle: 'View Gallery →',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    aspectRatio: 'portrait',
    location: 'Cape Town, South Africa',
    year: '2024',
    exif: {
      camera: 'Sony Alpha 1',
      lens: 'FE 85mm f/1.4 GM',
      aperture: 'f/1.4',
      shutterSpeed: '1/1250s',
      iso: '100',
      focalLength: '85mm'
    }
  },
  {
    id: 'photo-2',
    title: 'FASHION',
    subtitle: 'View Gallery →',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    aspectRatio: 'portrait',
    location: 'Namib Desert, Namibia',
    year: '2024',
    exif: {
      camera: 'Hasselblad X2D 100C',
      lens: 'XCD 55mm f/2.5 V',
      aperture: 'f/2.8',
      shutterSpeed: '1/2000s',
      iso: '64',
      focalLength: '55mm'
    }
  },
  {
    id: 'photo-3',
    title: 'LANDSCAPE',
    subtitle: 'View Gallery →',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=85',
    aspectRatio: 'portrait',
    location: 'Dolomites, Italy',
    year: '2023',
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 16-35mm f/2.8 GM II',
      aperture: 'f/8.0',
      shutterSpeed: '1/250s',
      iso: '100',
      focalLength: '24mm'
    }
  },
  {
    id: 'photo-4',
    title: 'WILDLIFE',
    subtitle: 'View Gallery →',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=85',
    aspectRatio: 'portrait',
    location: 'Serengeti, Tanzania',
    year: '2024',
    exif: {
      camera: 'Canon EOS R3',
      lens: 'RF 400mm f/2.8 L IS USM',
      aperture: 'f/3.2',
      shutterSpeed: '1/1600s',
      iso: '400',
      focalLength: '400mm'
    }
  },
  {
    id: 'photo-5',
    title: 'WEDDINGS',
    subtitle: 'View Gallery →',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    aspectRatio: 'portrait',
    location: 'Provence, France',
    year: '2024',
    exif: {
      camera: 'Leica SL2-S',
      lens: 'Summilux-SL 50mm f/1.4 ASPH',
      aperture: 'f/1.4',
      shutterSpeed: '1/3200s',
      iso: '100',
      focalLength: '50mm'
    }
  },
  {
    id: 'photo-6',
    title: 'COMMERCIAL',
    subtitle: 'View Gallery →',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    aspectRatio: 'portrait',
    location: 'Studio Cape Town, SA',
    year: '2024',
    exif: {
      camera: 'Phase One IQ4 150MP',
      lens: 'Schneider Kreuznach 120mm Macro',
      aperture: 'f/11',
      shutterSpeed: '1/160s',
      iso: '50',
      focalLength: '120mm'
    }
  }
];

export const ABOUT_PHOTOS = {
  mainExplorer: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
  cliffVista: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
  bwPortrait: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85',
};

export const INSTAGRAM_PHOTOS = [
  {
    id: 'ig-1',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    likes: '2.4k',
    caption: 'Misty dawns over the alpine crest.'
  },
  {
    id: 'ig-2',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80',
    likes: '3.8k',
    caption: 'Gentle giants roaming the ancient dust.'
  },
  {
    id: 'ig-3',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    likes: '1.9k',
    caption: 'Golden hour nuances.'
  },
  {
    id: 'ig-4',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    likes: '4.1k',
    caption: 'Where ocean breezes meet volcanic cliffs.'
  },
  {
    id: 'ig-5',
    imageUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=600&q=80',
    likes: '5.2k',
    caption: 'Behind the glass: waiting for the perfect light.'
  }
];
