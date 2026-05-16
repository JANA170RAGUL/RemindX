import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Settings as SettingsIcon, 
  Search, 
  CheckCheck, 
  Trash2 
} from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'sent' | 'failed' | 'upcoming' | 'system'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTab === 'sent') return n.status === 'sent';
    if (filterTab === 'failed') return n.status === 'failed';
    if (filterTab === 'upcoming') return n.status === 'upcoming';
    if (filterTab === 'system') return n.status === 'system';

    return true;
  });

  const getStatusBadge = (status) => {
    if (status === 'sent') return { label: 'Sent', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', icon: CheckCircle2 };
    if (status === 'failed') return { label: 'Failed', color: 'bg-rose-500/10 text-rose-500 border-rose-500/30', icon: AlertTriangle };
    if (status === 'upcoming') return { label: 'Upcoming', color: 'bg-primary/10 text-primary border-primary/30', icon: Clock };
    return { label: 'System', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30', icon: SettingsIcon };
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success('All notifications marked as read');
  };

  return (
    <div className="p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Autonomous alert logs, delivery status, and system events</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllRead}
            className="h-12 px-5 rounded-2xl glass-card border border-white/10 text-muted-foreground hover:text-foreground font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <CheckCheck size={18} />
            <span>Mark All as Read</span>
          </motion.button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl glass-card border border-white/20 shadow-xl">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'sent', label: 'Sent Reminders' },
            { id: 'failed', label: 'Failed Alerts' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'system', label: 'System Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${filterTab === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Filter notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-11 pr-4 rounded-xl glass-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-transparent"
          />
        </div>
      </div>

      {/* Notifications Timeline */}
      <div className="rounded-3xl glass-card border border-white/20 shadow-2xl p-6 lg:p-8">
        {filteredNotifications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto ring-4 ring-primary/5">
              <Bell size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground">No notifications found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You're all caught up! No alerts match your current filter criteria.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
            <AnimatePresence>
              {filteredNotifications.map((notif) => {
                const badge = getStatusBadge(notif.status);
                const BadgeIcon = badge.icon;

                return (
                  <motion.div 
                    key={notif.id} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-6 rounded-2xl border transition-all flex items-start gap-6 relative group cursor-pointer ${notif.read ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/10 border-white/20 shadow-lg hover:border-primary/50'}`}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-background border-4 border-primary ring-4 ring-background shadow-md z-10" />

                    <div className="pl-6 flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-base text-foreground">{notif.title}</span>
                          <span className={`px-2.5 py-0.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${badge.color} flex items-center gap-1`}>
                            <BadgeIcon size={10} /> {badge.label}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                        {notif.message}
                      </p>

                      {!notif.read && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <span>Click to mark as read</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
