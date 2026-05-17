import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Globe, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Edit3
} from 'lucide-react';

export default function Profile() {
  const { user, reminders } = useStore();

  const completedReminders = reminders.filter(r => r.completed).length;
  const pendingReminders = reminders.filter(r => !r.completed).length;

  return (
    <div className="p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Executive Profile</h1>
          <p className="text-sm text-muted-foreground">Corporate identity, autonomous AI standing, and workspace statistics</p>
        </div>

        <Link to="/settings">
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="h-12 px-5 rounded-2xl glass-card border border-white/10 text-muted-foreground hover:text-foreground font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Edit3 size={18} />
            <span>Edit Profile Settings</span>
          </motion.button>
        </Link>
      </div>

      {/* Main Profile Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-8 flex flex-col items-center text-center gap-6 relative overflow-hidden group">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />

          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-primary/40 shadow-2xl relative">
              <img 
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'} 
                alt={user?.full_name} 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'; }}
              />
            </div>
            <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg shadow-primary/30 flex items-center gap-1">
              <Sparkles size={12} /> AI Pro
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{user?.full_name || 'Executive'}</h2>
            <p className="text-sm text-primary font-semibold">{user?.role || 'CTO / VP of Engineering'}</p>
            <p className="text-xs text-muted-foreground pt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Enterprise Single Sign-On Verified</span>
            </p>
          </div>

          <div className="w-full pt-6 border-t border-border/40 space-y-4 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Mail size={14} /> Work Email</span>
              <span className="font-semibold text-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Globe size={14} /> Timezone</span>
              <span className="font-semibold text-foreground truncate max-w-[150px]">{user?.timezone || 'Pacific Time (PT)'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Award size={14} /> AI Subscription</span>
              <span className="font-semibold text-primary">{user?.plan || 'Enterprise AI Pro'}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Stats & Connected Stack */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Productivity Score', value: `${user?.productivityScore || 94}%`, icon: Award, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
              { title: 'Completed Tasks', value: completedReminders, icon: CheckCircle2, color: 'text-primary bg-primary/10 border-primary/20' },
              { title: 'Pending Reminders', value: pendingReminders, icon: CalendarIcon, color: 'text-accent bg-accent/10 border-accent/20' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl glass-card border border-white/20 shadow-xl flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* AI Autonomous Stack Summary */}
          <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Connected Productivity Stack</h3>
                <p className="text-xs text-muted-foreground">Active enterprise integrations synced with your AI engine</p>
              </div>
              <Link to="/settings" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                <span>Manage Stack</span> <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(user?.connectedApps || ['Google Calendar', 'Slack', 'Linear', 'Github']).map((app, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shadow-inner">
                      {app === 'Google Calendar' ? '📅' : app === 'Slack' ? '💬' : app === 'Linear' ? '🔺' : app === 'Notion' ? '📝' : '🐙'}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground block">{app}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Zap size={10} /> Active Auto-Sync
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Synced</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Standing Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border border-primary/40 shadow-2xl p-8 space-y-4 relative overflow-hidden glow-primary">
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/30 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-white font-bold text-lg relative z-10">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <span>Autonomous AI Standing: Elite Executive</span>
            </div>

            <p className="text-sm text-slate-300 relative z-10 leading-relaxed">
              Your task completion consistency ranks in the top 5% of Silicon Valley engineering executives. The predictive AI engine has fully calibrated to your biological energy peaks and is operating at maximum scheduling efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
