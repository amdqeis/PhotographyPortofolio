export interface Photo {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  driveFileId?: string | null;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  location?: string;
  year?: string;
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
  };
  sortOrder?: number;
  createdAt?: string;
}

export interface Story {
  id: string;
  title: string;
  tag: string;
  date: string;
  readTime: string;
  coverImage: string;
  driveFileId?: string | null;
  excerpt: string;
  content: string[];
  quote?: string;
  location?: string;
  sortOrder?: number;
  createdAt?: string;
}

export interface PhotographerStat {
  id: string;
  label: string;
  value: string;
  icon: 'camera' | 'globe' | 'award';
  description: string;
}

export interface SiteSettings {
  brandName: string;
  heroImageUrl?: string;
  aboutPhoto1?: string;
  aboutPhoto2?: string;
  aboutPhoto3?: string;
  igPhoto1?: string;
  igPhoto2?: string;
  igPhoto3?: string;
  igPhoto4?: string;
  igPhoto5?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user?: {
    role: string;
    name: string;
  };
}
