import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Flag,
  MoreVertical,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

export default function Dashboard() {
  const { reminders, toggleComplete, openModal, user, analyticsSummary } = useStore();

  const todaysReminders = reminders.filter(r => r.date === new Date().toISOString().split('T')[0]);
  const upcomingReminders = reminders.filter(r => r.date > new Date().toISOString().split('T')[0]);
  const missedReminders = reminders.filter(r => !r.completed && r.date < new Date().toISOString().split('T')[0]);
  const completedTasks = reminders.filter(r => r.completed);

  const fallbackAnalytics = [
    { name: 'Mon', completed: 4, scheduled: 6 },
    { name: 'Tue', completed: 7, scheduled: 8 },
    { name: 'Wed', completed: 5, scheduled: 5 },
    { name: 'Thu', completed: 8, scheduled: 10 },
    { name: 'Fri', completed: 6, scheduled: 7 },
    { name: 'Sat', completed: 9, scheduled: 9 },
    { name: 'Sun', completed: 3, scheduled: 4 },
  ];

  const chartData = analyticsSummary?.analytics_data || fallbackAnalytics;
  const productivityScore = analyticsSummary?.productivity_score ?? (user?.productivityScore || 94);
  const completedTotal = analyticsSummary?.completed_total ?? completedTasks.length;

  return (
    <div className="p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Welcome Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles size={14} className="animate-spin" />
            <span>Autonomous AI Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Executive'}
          </h1>
          <p className="text-sm text-muted-foreground">
            You have <span className="font-semibold text-foreground">{todaysReminders.length} reminders</span> scheduled for today. AI productivity score is <span className="font-semibold text-emerald-500">{productivityScore}%</span>.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="px-4 py-3 rounded-2xl glass-card border border-white/10 flex items-center gap-3 shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Productivity Pulse</div>
              <div className="text-lg font-bold text-foreground">Excellent (+14%)</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Today's Reminders", count: todaysReminders.length, icon: Clock, color: 'text-primary bg-primary/10 border-primary/20', trend: 'Active Schedule' },
          { title: 'Upcoming Alerts', count: upcomingReminders.length, icon: CalendarIcon, color: 'text-accent bg-accent/10 border-accent/20', trend: 'Next 7 Days' },
          { title: 'Missed Reminders', count: missedReminders.length, icon: AlertCircle, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', trend: 'Needs Attention' },
          { title: 'Completed Tasks', count: completedTotal, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', trend: `${productivityScore}% Success Rate` },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl glass-card border border-white/20 shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-white/40 transition-all"
            >
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-foreground tracking-tight">{stat.count}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.trend}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Today's Schedule & Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule */}
          <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <span>Today's Schedule</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">Live</span>
                </h3>
                <p className="text-xs text-muted-foreground">Autonomous tracking and priority countdowns</p>
              </div>
              <Link to="/reminders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                <span>View All</span> <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {reminders.slice(0, 4).map((rem) => (
                <motion.div 
                  key={rem.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${rem.completed ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/10 border-white/15 shadow-md'}`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <button 
                      onClick={() => toggleComplete(rem.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${rem.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/50 hover:border-primary'}`}
                    >
                      {rem.completed && <CheckCircle2 size={16} />}
                    </button>
                    <div className="flex flex-col overflow-hidden">
                      <span className={`text-sm font-semibold truncate ${rem.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {rem.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Clock size={12} /> {rem.time}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium">{rem.category}</span>
                        {rem.priority === 'high' && <span className="text-rose-500 flex items-center gap-0.5 font-semibold"><Flag size={12} /> High</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {!rem.completed && (
                      <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold animate-pulse">
                        <Zap size={12} />
                        <span>Active</span>
                      </div>
                    )}
                    <button className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Analytics Chart Section */}
          <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Weekly Completion Overview</h3>
                <p className="text-xs text-muted-foreground">Tasks scheduled vs completed over the last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" /> Completed</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent" /> Scheduled</div>
              </div>
            </div>

            <div className="h-72 w-full min-h-[18rem]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgba(150,150,150,0.5)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(150,150,150,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(18,20,32,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', color: '#fff' }} />
                  <Area type="monotone" dataKey="scheduled" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorScheduled)" />
                  <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: AI Suggestion Widget & Activity Timeline */}
        <div className="space-y-8">
          {/* AI Suggestion Widget */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border border-primary/40 shadow-2xl p-6 space-y-6 relative overflow-hidden glow-primary">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/30 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                <span>AI Smart Insights</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-white">
                Engine v4.1
              </span>
            </div>

            <div className="space-y-4 relative z-10 text-slate-200 text-sm leading-relaxed">
              <p className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner">
                💡 <strong className="text-white font-semibold">Recommendation:</strong> You have 3 high-priority tasks clustered tomorrow morning. Consider rescheduling your 11 AM 1-on-1 to Thursday afternoon to maintain optimal focus.
              </p>
              <p className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner">
                ⚡ <strong className="text-white font-semibold">Energy Peak:</strong> Your historical task completion rate peaks at 10:15 AM. We've auto-prioritized your Product Strategy Review for this window.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal('aiQuickAdd')}
                className="w-full h-12 rounded-2xl bg-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-slate-100 transition-all"
              >
                <Sparkles size={16} className="text-primary" />
                <span>Schedule with AI Assistant</span>
              </motion.button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">Activity Timeline</h3>
              <Link to="/notifications" className="text-xs text-primary hover:underline font-semibold">View History</Link>
            </div>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
              {[
                { title: 'Reminder Dispatched', desc: 'Q3 Product Strategy Review sent to iPhone 16 Pro', time: '10 mins ago', color: 'bg-primary' },
                { title: 'Smart Schedule Updated', desc: 'AI re-allocated dental checkup to 08:00 AM', time: '2 hours ago', color: 'bg-accent' },
                { title: 'Task Completed', desc: 'Silicon Valley Founders Dinner marked as done', time: '5 hours ago', color: 'bg-emerald-500' },
                { title: 'New Login Detected', desc: 'Chrome on macOS authenticated successfully', time: '1 day ago', color: 'bg-blue-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 relative pl-8">
                  <span className={`absolute left-2 top-1.5 w-3 h-3 rounded-full ${item.color} ring-4 ring-background shadow-md`} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground">{item.title}</span>
                    <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                    <span className="text-[9px] text-muted-foreground/60">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
