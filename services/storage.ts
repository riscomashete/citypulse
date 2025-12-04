import { Article, Business, Event, Comment, Advertisement, User } from '../types';

const STORAGE_KEYS = {
  ARTICLES: 'citypulse_articles',
  BUSINESSES: 'citypulse_businesses',
  EVENTS: 'citypulse_events',
  COMMENTS: 'citypulse_comments',
  ADS: 'citypulse_ads',
  USERS: 'citypulse_users',
};

// Seed data
const seedArticles: Article[] = [
  {
    id: '1',
    title: 'City Council Approves New Green Park Initiative',
    excerpt: 'The downtown area will see a major transformation with the new eco-friendly park.',
    content: '## A Green Future\n\nThe city council has unanimously voted to approve the new Green Park Initiative. This ambitious project aims to transform the old industrial district into a lush, eco-friendly recreational area for residents.\n\n"This is a historic moment for our city," said Mayor Sarah Jenkins. "We are investing in the health and well-being of our future generations."\n\nThe park will feature:\n* 5 miles of walking trails\n* A solar-powered community center\n* Native plant gardens\n\nConstruction is set to begin next month.',
    category: 'Politics',
    image: 'https://picsum.photos/800/400?random=1',
    author: 'Jane Doe',
    publishedAt: new Date().toISOString(),
    views: 1245,
    isPublished: true,
  },
  {
    id: '2',
    title: 'Local High School Wins State Championship',
    excerpt: 'The Tigers took home the trophy in a thrilling overtime victory.',
    content: 'In a stunning display of grit and determination, the Central High Tigers defeated the Northville Eagles 24-21 in overtime to secure the state championship title.\n\nQuarterback Mike Ross threw the winning touchdown pass to receiver Chris Evans, sending the crowd into a frenzy.',
    category: 'Sports',
    image: 'https://picsum.photos/800/400?random=2',
    author: 'Tom Smith',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    views: 890,
    isPublished: true,
  },
  {
    id: '3',
    title: 'Tech Giant Opens New Office Downtown',
    excerpt: 'Over 500 new jobs expected to be created in the next two years.',
    content: 'Silicon Valley based tech firm, CyberDyne, has announced plans to open a regional hub in the city center. This move is expected to revitalize the local economy.',
    category: 'Business',
    image: 'https://picsum.photos/800/400?random=3',
    author: 'Alice Johnson',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    views: 2300,
    isPublished: true,
  },
  {
    id: '4',
    title: 'Summer Jazz Festival Lineup Announced',
    excerpt: 'World-renowned artists set to perform this July.',
    content: 'Get ready for a weekend of smooth tunes and good vibes. The annual Summer Jazz Festival has released its lineup, featuring legends like Herbie Hancock and new sensations like Snarky Puppy.',
    category: 'Entertainment',
    image: 'https://picsum.photos/800/400?random=4',
    author: 'Bob Dylan',
    publishedAt: new Date(Date.now() - 200000).toISOString(),
    views: 567,
    isPublished: true,
  }
];

const seedBusinesses: Business[] = [
  {
    id: '1',
    name: 'The Daily Grind',
    category: 'Food & Drink',
    description: 'Best artisan coffee in town.',
    address: '123 Main St',
    phone: '555-0101',
    email: 'contact@dailygrind.com',
    image: 'https://picsum.photos/200/200?random=10'
  },
  {
    id: '2',
    name: 'TechFix Solutions',
    category: 'Services',
    description: 'Computer and phone repair experts.',
    address: '456 Tech Blvd',
    phone: '555-0102',
    email: 'support@techfix.com',
    image: 'https://picsum.photos/200/200?random=11'
  }
];

const seedEvents: Event[] = [
  {
    id: '1',
    title: 'Farmers Market',
    date: new Date(Date.now() + 604800000).toISOString(),
    location: 'Town Square',
    description: 'Fresh produce from local farmers.',
    organizer: 'City Council',
    image: 'https://picsum.photos/400/300?random=20'
  },
  {
    id: '2',
    title: 'Charity Run',
    date: new Date(Date.now() + 1209600000).toISOString(),
    location: 'City Park',
    description: '5k run to support local shelters.',
    organizer: 'Red Cross',
    image: 'https://picsum.photos/400/300?random=21'
  }
];

const seedAds: Advertisement[] = [
  {
    id: '1',
    type: 'banner',
    content: 'Summer Sale! 50% Off at FashionHub',
    linkUrl: '#',
    isActive: true,
    imageUrl: 'https://picsum.photos/1200/120?random=50'
  }
];

// Helper to get from local storage
const getFromStorage = <T>(key: string, seed: T[]): T[] => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const StorageService = {
  // Articles
  getArticles: (): Article[] => getFromStorage(STORAGE_KEYS.ARTICLES, seedArticles),
  saveArticle: (article: Article) => {
    const articles = StorageService.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index >= 0) {
      articles[index] = article;
    } else {
      articles.unshift(article);
    }
    saveToStorage(STORAGE_KEYS.ARTICLES, articles);
  },
  deleteArticle: (id: string) => {
    const articles = StorageService.getArticles().filter(a => a.id !== id);
    saveToStorage(STORAGE_KEYS.ARTICLES, articles);
  },
  incrementView: (id: string) => {
    const articles = StorageService.getArticles();
    const article = articles.find(a => a.id === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    }
  },

  // Businesses
  getBusinesses: (): Business[] => getFromStorage(STORAGE_KEYS.BUSINESSES, seedBusinesses),
  saveBusiness: (business: Business) => {
    const items = StorageService.getBusinesses();
    const index = items.findIndex(b => b.id === business.id);
    if (index >= 0) items[index] = business;
    else items.push(business);
    saveToStorage(STORAGE_KEYS.BUSINESSES, items);
  },
  deleteBusiness: (id: string) => {
    saveToStorage(STORAGE_KEYS.BUSINESSES, StorageService.getBusinesses().filter(b => b.id !== id));
  },

  // Events
  getEvents: (): Event[] => getFromStorage(STORAGE_KEYS.EVENTS, seedEvents),
  saveEvent: (event: Event) => {
    const items = StorageService.getEvents();
    const index = items.findIndex(e => e.id === event.id);
    if (index >= 0) items[index] = event;
    else items.push(event);
    saveToStorage(STORAGE_KEYS.EVENTS, items);
  },
  deleteEvent: (id: string) => {
    saveToStorage(STORAGE_KEYS.EVENTS, StorageService.getEvents().filter(e => e.id !== id));
  },

  // Comments
  getComments: (articleId: string): Comment[] => {
    const all = getFromStorage<Comment>(STORAGE_KEYS.COMMENTS, []);
    return all.filter(c => c.articleId === articleId);
  },
  addComment: (comment: Comment) => {
    const all = getFromStorage<Comment>(STORAGE_KEYS.COMMENTS, []);
    all.push(comment);
    saveToStorage(STORAGE_KEYS.COMMENTS, all);
  },
  deleteComment: (id: string) => {
    const all = getFromStorage<Comment>(STORAGE_KEYS.COMMENTS, []);
    saveToStorage(STORAGE_KEYS.COMMENTS, all.filter(c => c.id !== id));
  },

  // Ads
  getAds: (): Advertisement[] => getFromStorage(STORAGE_KEYS.ADS, seedAds),
  saveAd: (ad: Advertisement) => {
    const items = StorageService.getAds();
    const index = items.findIndex(a => a.id === ad.id);
    if (index >= 0) items[index] = ad;
    else items.push(ad);
    saveToStorage(STORAGE_KEYS.ADS, items);
  },
  deleteAd: (id: string) => {
    saveToStorage(STORAGE_KEYS.ADS, StorageService.getAds().filter(a => a.id !== id));
  }
};