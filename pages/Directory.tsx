import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { Card, Badge } from '../components/Common';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export const Directory = () => {
  const businesses = StorageService.getBusinesses();
  const [filter, setFilter] = useState('');

  const filtered = businesses.filter(b => 
    b.name.toLowerCase().includes(filter.toLowerCase()) || 
    b.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Local Business Directory</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover the best local services, shops, and dining options in our community.</p>
      </div>

      <div className="max-w-md mx-auto mb-10">
        <input
            type="text"
            placeholder="Search businesses..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(biz => (
            <Card key={biz.id} className="flex flex-col h-full hover:shadow-lg transition-all">
                <div className="h-40 bg-gray-200 relative">
                     {biz.image ? (
                         <img src={biz.image} alt={biz.name} className="w-full h-full object-cover" />
                     ) : (
                         <div className="w-full h-full flex items-center justify-center bg-brand-100 text-brand-500">
                             <span className="text-4xl font-bold">{biz.name[0]}</span>
                         </div>
                     )}
                     <div className="absolute top-4 right-4">
                         <Badge color="green">{biz.category}</Badge>
                     </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{biz.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{biz.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400"/> {biz.address}</div>
                        <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400"/> {biz.phone}</div>
                        <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-400"/> {biz.email}</div>
                        {biz.website && (
                             <div className="flex items-center">
                                 <Globe className="w-4 h-4 mr-2 text-gray-400"/> 
                                 <a href={biz.website} className="text-brand-600 hover:underline">Visit Website</a>
                             </div>
                        )}
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
};