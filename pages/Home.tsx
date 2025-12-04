import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Article } from '../types';
import { StorageService } from '../services/storage';
import { Card, Badge } from '../components/Common';
import { Calendar, Eye, Clock } from 'lucide-react';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const articles = StorageService.getArticles();
  
  const filteredArticles = useMemo(() => {
    let result = articles.filter(a => a.isPublished);
    if (categoryFilter) {
      result = result.filter(a => a.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.content.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q)
      );
    }
    return result;
  }, [articles, categoryFilter, searchQuery]);

  // Featured is the first article (or random for variety in a real app)
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const listArticles = filteredArticles.length > 0 ? filteredArticles.slice(1) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
        if(searchTerm) prev.set('q', searchTerm);
        else prev.delete('q');
        return prev;
    });
  };

  const categories = ['News', 'Sports', 'Politics', 'Business', 'Entertainment', 'Tech'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex overflow-x-auto pb-2 space-x-2 w-full md:w-auto hide-scrollbar">
           <button 
             onClick={() => setSearchParams({})}
             className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${!categoryFilter ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
           >
             All
           </button>
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setSearchParams(prev => { prev.set('category', cat); return prev; })}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${categoryFilter === cat ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
             >
               {cat}
             </button>
           ))}
        </div>
        <form onSubmit={handleSearch} className="w-full md:w-64">
           <input
             type="text"
             placeholder="Search articles..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
           />
        </form>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No articles found matching your criteria.</div>
      ) : (
        <>
          {/* Featured Article - only show on first page/no query to look nice */}
          {!searchQuery && !categoryFilter && featuredArticle && (
            <div className="mb-12">
              <Link to={`/article/${featuredArticle.id}`} className="group relative block rounded-2xl overflow-hidden shadow-xl aspect-w-16 aspect-h-9 md:aspect-h-6 lg:aspect-h-5">
                <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                   <Badge color="red">{featuredArticle.category}</Badge>
                   <h1 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-2 group-hover:underline decoration-brand-500 underline-offset-4">{featuredArticle.title}</h1>
                   <p className="text-gray-200 text-sm md:text-lg line-clamp-2 mb-4 max-w-2xl">{featuredArticle.excerpt}</p>
                   <div className="flex items-center text-gray-300 text-sm space-x-4">
                     <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
                     <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> 5 min read</span>
                   </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(searchQuery || categoryFilter ? filteredArticles : listArticles).map(article => (
              <Link key={article.id} to={`/article/${article.id}`} className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-gray-200">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                       <Badge color="blue">{article.category}</Badge>
                       <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                         <Eye className="w-3 h-3 mr-1" /> {article.views}
                       </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 line-clamp-2">{article.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">{article.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span>{article.author}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};