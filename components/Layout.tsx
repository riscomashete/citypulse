import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Moon, Sun, User as UserIcon, LogOut } from 'lucide-react';
import { User, Advertisement } from '../types';
import { StorageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  toggleTheme: () => void;
  isDark: boolean;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, toggleTheme, isDark, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const ads = StorageService.getAds().filter(a => a.isActive && a.type === 'banner');
  const bannerAd = ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-500 text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Top Banner Ad */}
      {bannerAd && (
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-2 text-center">
            <a href={bannerAd.linkUrl} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
               {bannerAd.imageUrl ? (
                   <img src={bannerAd.imageUrl} alt="Advertisement" className="h-16 w-full object-cover mx-auto max-w-4xl" />
               ) : (
                   <span>{bannerAd.content}</span>
               )}
               <span className="text-[10px] uppercase text-gray-400 block mt-1">Advertisement</span>
            </a>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                  CityPulse
                </span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-4 items-center">
                <NavLink to="/" label="Home" />
                <NavLink to="/directory" label="Directory" />
                <NavLink to="/events" label="Events" />
                <NavLink to="/contact" label="Contact" />
                {user && <NavLink to="/admin" label="Dashboard" />}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="hidden md:block">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                    <button
                      onClick={onLogout}
                      className="p-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/" label="Home" />
              <NavLink to="/directory" label="Directory" />
              <NavLink to="/events" label="Events" />
              <NavLink to="/contact" label="Contact" />
              {user && <NavLink to="/admin" label="Dashboard" />}
              {!user && <NavLink to="/login" label="Login" />}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CityPulse</h3>
            <p className="text-gray-400 text-sm">
              Your source for local news, events, and business information. Connecting the community one story at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Sections</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/?category=News" className="hover:text-white">News</Link></li>
              <li><Link to="/?category=Sports" className="hover:text-white">Sports</Link></li>
              <li><Link to="/?category=Entertainment" className="hover:text-white">Entertainment</Link></li>
              <li><Link to="/directory" className="hover:text-white">Business Directory</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-2">Subscribe to our weekly update.</p>
            <form className="flex" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 rounded-l-md w-full bg-gray-700 text-white border-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <button className="bg-brand-600 px-4 py-2 rounded-r-md hover:bg-brand-700 transition-colors">
                Join
              </button>
            </form>
          </div>
           <div>
            <h4 className="font-semibold mb-4">Connect</h4>
             <div className="flex space-x-4">
                {/* Social icons placeholders */}
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer">F</div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer">T</div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer">I</div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CityPulse Magazine. All rights reserved.
        </div>
      </footer>
    </div>
  );
};