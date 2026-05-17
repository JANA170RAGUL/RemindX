import { useStore } from '../store/useStore';
import { Search, Bell, Sun, Moon, Plus, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
  const { theme, toggleTheme, user, notifications, searchQuery, setSearchQuery, openModal } = useStore();
  const navigate = useNavigate();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <header className="sticky top-4 h-16 md:h-20 px-5 md:px-8 rounded-2xl glass-card shadow-[0_8px_32px_rgba(236,72,153,0.15)] z-30 flex items-center justify-between gap-4 select-none transition-all">
      {/* Search Bar */}
      <div className="relative max-w-md w-full flex items-center">
        <Search className="absolute left-5 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input 
          type="text"
          placeholder="Search reminders, tags, AI insights..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 pl-14 pr-16 rounded-2xl glass-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#ff4fd8] focus:ring-2 focus:ring-[#ff4fd8]/30 transition-all shadow-inner font-mono"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 text-xs text-muted-foreground hover:text-foreground glass-input px-3 py-1.5 rounded-xl transition-all font-mono shadow-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Quick Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(236,72,153,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal('createReminder')}
          className="h-12 px-5 rounded-2xl bg-gradient-to-r from-primary via-accent to-pink-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all cursor-pointer font-mono"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create Reminder</span>
        </motion.button>

        {/* AI Quick Add Button */}
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal('aiQuickAdd')}
          title="AI Natural Language Add"
          className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center hover:bg-accent/20 transition-all shadow-md cursor-pointer"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-12 h-12 rounded-2xl glass-input flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-md cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#00e5ff]" />}
        </motion.button>

        {/* Notification Bell */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="w-12 h-12 rounded-2xl glass-input flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-md cursor-pointer relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ff4fd8] rounded-full ring-2 ring-background animate-pulse shadow-[0_0_8px_#ff4fd8]" />
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotificationsDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-84 rounded-3xl glass-card p-4 shadow-2xl z-50 border border-[#ff4fd8]/30 shadow-[0_0_30px_rgba(236,72,153,0.2)]"
              >
                <div className="flex items-center justify-between mb-3 px-2 border-b border-border/40 pb-2">
                  <span className="font-extrabold text-sm font-mono text-foreground">Notifications</span>
                  <Link 
                    to="/notifications" 
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-xs text-[#00e5ff] hover:underline font-mono"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {unreadNotifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-muted-foreground font-mono">
                      No unread notifications
                    </div>
                  ) : (
                    unreadNotifications.slice(0, 4).map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          setShowNotificationsDropdown(false);
                          navigate('/notifications');
                        }}
                        className="p-3 rounded-2xl glass-input hover:bg-white/20 cursor-pointer transition-all flex flex-col gap-1 shadow-sm"
                      >
                        <span className="text-xs font-bold text-foreground font-mono">{n.title}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1 font-mono">{n.message}</span>
                        <span className="text-[9px] text-[#ff4fd8] font-mono">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <Link to="/profile" className="block">
          <motion.div 
            whileHover={{ scale: 1.05, ringColor: '#00e5ff' }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#ff4fd8]/50 hover:ring-[#00e5ff] transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] cursor-pointer"
          >
            <img 
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'} 
              alt={user?.full_name} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'; }}
            />
          </motion.div>
        </Link>
      </div>
    </header>
  );
}
