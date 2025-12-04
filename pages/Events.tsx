import React from 'react';
import { StorageService } from '../services/storage';
import { Card, Button } from '../components/Common';
import { Calendar as CalendarIcon, MapPin, User } from 'lucide-react';

export const Events = () => {
  const events = StorageService.getEvents().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upcoming Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Join the community at these local gatherings.</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => alert("Please contact support to submit an event.")}>Submit Event</Button>
       </div>

       <div className="space-y-6">
          {events.map(event => {
              const date = new Date(event.date);
              return (
                <Card key={event.id} className="flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">
                    <div className="md:w-64 h-48 md:h-auto relative bg-gray-200">
                        <img src={event.image || `https://picsum.photos/400/300?random=${event.id}`} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg p-2 text-center shadow-sm min-w-[60px]">
                            <span className="block text-xs font-bold uppercase text-red-500">{date.toLocaleString('default', { month: 'short' })}</span>
                            <span className="block text-2xl font-bold text-gray-900 dark:text-white">{date.getDate()}</span>
                        </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                             <div className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2"/> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                             <div className="flex items-center"><MapPin className="w-4 h-4 mr-2"/> {event.location}</div>
                             <div className="flex items-center"><User className="w-4 h-4 mr-2"/> By {event.organizer}</div>
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 border-l border-gray-100 dark:border-gray-700 md:w-48">
                        <Button variant="secondary" className="w-full">Details</Button>
                    </div>
                </Card>
              );
          })}
       </div>
    </div>
  );
};