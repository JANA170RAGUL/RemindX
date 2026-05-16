import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  Clock, 
  Flag, 
  Tag, 
  Trash2, 
  Edit3, 
  Search, 
  Grid, 
  List, 
  Filter, 
  SlidersHorizontal,
  Plus,
  Sparkles
} from 'lucide-react';

export default function Reminders() {
  const { reminders, toggleComplete, deleteReminder, openModal, searchQuery, setSearchQuery } = useStore();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'today' | 'tomorrow' | 'week' | 'completed' | 'pending' | 'high'
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'priority' | 'title'

  // Filter logic
  const filteredReminders = reminders.filter((r) => {
    // Search query matching
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    // Tab filtering
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (activeTab === 'today') return r.date === todayStr;
    if (activeTab === 'tomorrow') return r.date === tomorrow;
    if (activeTab === 'week') return r.date >= todayStr && r.date <= new Date(Date.now() + 7*86400000).toISOString().split('T')[0];
    if (activeTab === 'completed') return r.completed;
    if (activeTab === 'pending') return !r.completed;
    if (activeTab === 'high') return r.priority === 'high';

    return true;
  }).sort((a, b) => {
    if (sortBy === 'date') return a.date.localeCompare(b.date);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return 0;
  });

  const handleDelete = (id, title) => {
    deleteReminder(id);
    toast.success('Reminder deleted', { description: `Removed "${title}" from schedule.` });
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
    if (priority === 'medium') return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
  };

  const getCategoryColor = (category) => {
    if (category === 'Work') return 'bg-blue-500';
    if (category === 'Personal') return 'bg-purple-500';
    if (category === 'Health') return 'bg-emerald-500';
    return 'bg-amber-500';
  };

  return (
    <div className="p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Reminders Management</h1>
          <p className="text-sm text-muted-foreground">Autonomous tracking, smart filters, and real-time countdowns</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-2xl glass-card border border-white/10 flex items-center gap-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={18} />
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => openModal('createReminder')}
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-primary via-accent to-pink-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            <Plus size={18} />
            <span>New Reminder</span>
          </motion.button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl glass-card border border-white/20 shadow-xl">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Reminders' },
            { id: 'today', label: 'Today' },
            { id: 'tomorrow', label: 'Tomorrow' },
            { id: 'week', label: 'This Week' },
            { id: 'pending', label: 'Pending' },
            { id: 'completed', label: 'Completed' },
            { id: 'high', label: 'High Priority' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id ? 'instagram-btn scale-105 shadow-xl' : 'text-muted-foreground hover:text-foreground glass-input hover:bg-white/10'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <SlidersHorizontal size={14} />
            <span>Sort By:</span>
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 rounded-xl glass-input text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-transparent"
          >
            <option value="date" className="bg-background text-foreground">Date Scheduled</option>
            <option value="priority" className="bg-background text-foreground">Priority Level</option>
            <option value="title" className="bg-background text-foreground">Title Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Reminders Content */}
      {filteredReminders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="p-16 rounded-3xl glass-card border border-white/20 text-center space-y-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto ring-4 ring-primary/5">
            <Search size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No reminders match your criteria</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query, changing your filter tabs, or create a new smart reminder.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => openModal('createReminder')}
            className="px-6 py-3 rounded-2xl bg-primary text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            <span>Create Reminder</span>
          </motion.button>
        </motion.div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredReminders.map((rem) => (
              <motion.div 
                key={rem.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-3xl glass-card border transition-all flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden group ${rem.completed ? 'opacity-60 bg-white/5 border-white/5' : 'border-white/20 hover:border-white/40 bg-white/10'}`}
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-transparent group-hover:bg-primary transition-colors" />
                
                {/* Card Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(rem.category)} ring-2 ring-background`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{rem.category}</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${getPriorityColor(rem.priority)} flex items-center gap-1`}>
                      <Flag size={10} />
                      <span>{rem.priority}</span>
                    </div>
                  </div>

                  <h3 className={`font-bold text-lg leading-snug ${rem.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {rem.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {rem.description}
                  </p>
                </div>

                {/* Tags & Meta */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {rem.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-medium text-muted-foreground flex items-center gap-1 border border-white/5">
                        <Tag size={10} /> {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={14} className="text-primary" />
                      <span>{rem.date} • {rem.time}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toast.info('Edit Modal Simulated', { description: `Editing ${rem.title}` })}
                        className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(rem.id, rem.title)}
                        className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Complete Button Overlay */}
                <button 
                  onClick={() => toggleComplete(rem.id)}
                  className={`absolute bottom-4 right-4 p-2.5 rounded-2xl border transition-all flex items-center justify-center shadow-lg ${rem.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-background/80 backdrop-blur-md border-white/20 text-muted-foreground hover:text-primary hover:border-primary'}`}
                >
                  <CheckCircle2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-3xl glass-card border border-white/20 shadow-xl overflow-hidden divide-y divide-border/40">
          <AnimatePresence>
            {filteredReminders.map((rem) => (
              <motion.div 
                key={rem.id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className={`p-6 transition-all flex items-center justify-between gap-4 group ${rem.completed ? 'bg-white/5 opacity-60' : 'hover:bg-white/5 bg-white/10'}`}
              >
                <div className="flex items-center gap-4 overflow-hidden flex-1">
                  <button 
                    onClick={() => toggleComplete(rem.id)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all shrink-0 shadow-sm ${rem.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/50 hover:border-primary'}`}
                  >
                    {rem.completed && <CheckCircle2 size={18} />}
                  </button>

                  <div className="flex flex-col overflow-hidden gap-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`font-bold text-base ${rem.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {rem.title}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${getPriorityColor(rem.priority)} flex items-center gap-1`}>
                        <Flag size={10} /> {rem.priority}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-xl bg-white/5 text-[10px] font-semibold text-muted-foreground border border-white/5">
                        {rem.category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1">{rem.description}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Clock size={14} className="text-primary" />
                    <span>{rem.date} • {rem.time}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => toast.info('Edit Modal Simulated', { description: `Editing ${rem.title}` })}
                      className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(rem.id, rem.title)}
                      className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
