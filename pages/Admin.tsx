import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/geminiService';
import { Article, Business, Event, Advertisement } from '../types';
import { Button, Card, Modal, Badge } from '../components/Common';
import { Plus, Trash, Edit, Wand2, RefreshCw } from 'lucide-react';

type Tab = 'articles' | 'businesses' | 'events' | 'ads';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('articles');
  
  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [refresh, setRefresh] = useState(0); // Trigger re-fetch

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // Quick 'any' for the form wrapper

  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState({ topic: '', category: 'News' });

  useEffect(() => {
    setArticles(StorageService.getArticles());
    setBusinesses(StorageService.getBusinesses());
    setEvents(StorageService.getEvents());
    setAds(StorageService.getAds());
  }, [refresh, activeTab]);

  const handleSave = (data: any) => {
    if (activeTab === 'articles') StorageService.saveArticle(data);
    if (activeTab === 'businesses') StorageService.saveBusiness(data);
    if (activeTab === 'events') StorageService.saveEvent(data);
    if (activeTab === 'ads') StorageService.saveAd(data);
    
    setIsModalOpen(false);
    setEditingItem(null);
    setRefresh(prev => prev + 1);
  };

  const handleDelete = (id: string) => {
    if(!confirm("Are you sure?")) return;
    if (activeTab === 'articles') StorageService.deleteArticle(id);
    if (activeTab === 'businesses') StorageService.deleteBusiness(id);
    if (activeTab === 'events') StorageService.deleteEvent(id);
    if (activeTab === 'ads') StorageService.deleteAd(id);
    setRefresh(prev => prev + 1);
  };

  const openNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAIGenerate = async (updateContent: (val: string) => void) => {
    if (!aiPrompt.topic) return;
    setIsGenerating(true);
    const content = await GeminiService.generateArticleContent(aiPrompt.topic, aiPrompt.category);
    updateContent(content);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2 inline" /> Add New</Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full md:w-auto inline-flex">
        {(['articles', 'businesses', 'events', 'ads'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === tab 
              ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title/Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status/Info</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {activeTab === 'articles' && articles.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     <Badge color={item.isPublished ? 'green' : 'yellow'}>{item.isPublished ? 'Published' : 'Draft'}</Badge> 
                     <span className="ml-2">{item.views} views</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(item)} className="text-brand-600 hover:text-brand-900 mr-4"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
              {activeTab === 'businesses' && businesses.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(item)} className="text-brand-600 hover:text-brand-900 mr-4"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
              {activeTab === 'events' && events.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(item)} className="text-brand-600 hover:text-brand-900 mr-4"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
              {activeTab === 'ads' && ads.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">{item.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Badge color={item.isActive ? 'green' : 'gray'}>{item.type}</Badge></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(item)} className="text-brand-600 hover:text-brand-900 mr-4"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Universal Edit/Create Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`${editingItem ? 'Edit' : 'Create'} ${activeTab.slice(0, -1)}`}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data: any = { id: editingItem?.id || Date.now().toString() };
          
          formData.forEach((value, key) => {
            // Checkbox handling
            if (key === 'isPublished' || key === 'isActive') data[key] = true;
            else data[key] = value;
          });

          // Handle unchecked checkboxes manually if needed, but for now defaults in types help or logic below
          if (activeTab === 'articles' && !formData.has('isPublished')) data.isPublished = false;
          if (activeTab === 'ads' && !formData.has('isActive')) data.isActive = false;
          
          // Defaults for missing fields in edit
          if (activeTab === 'articles') {
             data.views = editingItem?.views || 0;
             data.publishedAt = editingItem?.publishedAt || new Date().toISOString();
          }

          handleSave(data);
        }} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          
          {activeTab === 'articles' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input name="title" defaultValue={editingItem?.title} required className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select name="category" defaultValue={editingItem?.category || 'News'} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    {['News', 'Sports', 'Politics', 'Business', 'Entertainment', 'Tech'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input name="image" defaultValue={editingItem?.image} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                <input name="author" defaultValue={editingItem?.author} required className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt</label>
                  <textarea name="excerpt" defaultValue={editingItem?.excerpt} rows={2} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
              
              {/* AI Writer Section */}
              <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-md border border-brand-100 dark:border-brand-800">
                  <h4 className="text-sm font-bold text-brand-800 dark:text-brand-300 mb-2 flex items-center"><Wand2 className="w-3 h-3 mr-1"/> AI Assistant</h4>
                  <div className="flex gap-2 mb-2">
                      <input 
                        placeholder="Topic (e.g. Local election results)" 
                        value={aiPrompt.topic} 
                        onChange={e => setAiPrompt({...aiPrompt, topic: e.target.value})}
                        className="flex-grow text-xs px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-700"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleAIGenerate((txt) => {
                             const el = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
                             if(el) { el.value = txt; el.focus(); }
                        })}
                        disabled={isGenerating}
                        className="bg-brand-600 text-white px-2 py-1 rounded text-xs flex items-center"
                      >
                          {isGenerating ? <RefreshCw className="animate-spin w-3 h-3"/> : 'Generate'}
                      </button>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                <textarea name="content" defaultValue={editingItem?.content} required rows={10} className="w-full mt-1 px-3 py-2 border rounded-md font-mono text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="flex items-center">
                 <input type="checkbox" name="isPublished" defaultChecked={editingItem?.isPublished} className="mr-2" />
                 <label className="text-sm text-gray-700 dark:text-gray-300">Publish immediately</label>
              </div>
            </>
          )}

          {/* Simple forms for other types for brevity */}
          {activeTab === 'businesses' && (
             <>
                <input name="name" defaultValue={editingItem?.name} placeholder="Business Name" required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="category" defaultValue={editingItem?.category} placeholder="Category" required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <textarea name="description" defaultValue={editingItem?.description} placeholder="Description" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="address" defaultValue={editingItem?.address} placeholder="Address" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="phone" defaultValue={editingItem?.phone} placeholder="Phone" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="email" defaultValue={editingItem?.email} placeholder="Email" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="website" defaultValue={editingItem?.website} placeholder="Website URL" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
             </>
          )}

           {activeTab === 'events' && (
             <>
                <input name="title" defaultValue={editingItem?.title} placeholder="Event Title" required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="date" type="datetime-local" defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().slice(0,16) : ''} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="location" defaultValue={editingItem?.location} placeholder="Location" required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <textarea name="description" defaultValue={editingItem?.description} placeholder="Description" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="organizer" defaultValue={editingItem?.organizer} placeholder="Organizer" required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
             </>
          )}
           
           {activeTab === 'ads' && (
             <>
                <select name="type" defaultValue={editingItem?.type || 'banner'} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="banner">Banner</option>
                    <option value="sidebar">Sidebar</option>
                </select>
                <input name="content" defaultValue={editingItem?.content} placeholder="Ad Text / Alt Text" required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="linkUrl" defaultValue={editingItem?.linkUrl} placeholder="Target URL" required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <input name="imageUrl" defaultValue={editingItem?.imageUrl} placeholder="Image URL (optional)" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                <div className="flex items-center">
                    <input type="checkbox" name="isActive" defaultChecked={editingItem?.isActive} className="mr-2" />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Active</label>
                </div>
             </>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};