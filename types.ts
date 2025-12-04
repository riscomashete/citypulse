export type UserRole = 'admin' | 'staff' | 'user' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  parentId: string | null; // For nested replies
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  publishedAt: string;
  views: number;
  isPublished: boolean;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  organizer: string;
  image?: string;
}

export interface Advertisement {
  id: string;
  type: 'banner' | 'sidebar';
  content: string; // HTML or text
  imageUrl?: string;
  linkUrl: string;
  isActive: boolean;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  theme: Theme;
  user: User | null;
}