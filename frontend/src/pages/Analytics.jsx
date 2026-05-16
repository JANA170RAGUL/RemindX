import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  Activity, 
  Sparkles, 
  Calendar as CalendarIcon, 
  ArrowUpRight,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Analytics() {
  const { user, reminders } = useStore();

  const weeklyActivity = [
    { name: 'Mon', completed: 4, missed: 0, pending: 2 },
    { name: 'Tue', completed: 7, missed: 1, pending: 0 },
    { name: 'Wed', completed: 5, missed: 0, pending: 0 },
    { name: 'Thu', completed: 8, missed: 2, pending: 0 },
    { name: 'Fri', completed: 6, missed: 0, pending: 1 },
    { name: 'Sat', completed: 9, missed: 0, pending: 0 },
    { name: 'Sun', completed: 3, missed: 0, pending: 1 },
  ];

  const categoryData = [
    { name: 'Work', value: 45, color: '#3b82f6' },
    { name: 'Personal', value: 25, color: '#a855f7' },
    { name: 'Health', value: 20, color: '#10b981' },
    { name: 'Finance', value: 10, color: '#f59e0b' },
  ];

  const heatmapData = Array.from({ length: 28 }, (_, i) => ({
    day: `Day ${i+1}`,
    score: Math.floor(Math.random() * 40) + 60
  }));

  return (
    <div className="p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Autonomous performance metrics, productivity heatmaps, and AI efficiency trends</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl glass-card border border-white/10 flex items-center gap-2 text-xs font-semibold text-primary shadow-md">
            <Sparkles size={14} className="animate-spin" />
            <span>AI Predictive Modeling Active</span>
          </div>
        </div>
      </div>

      {/* Top Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Productivity Score', value: `${user.productivityScore}%`, icon: Award, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', trend: '+5.4% from last week' },
          { title: 'Total Reminders Completed', value: '142', icon: BarChart3, color: 'text-primary bg-primary/10 border-primary/20', trend: '94.2% completion rate' },
          { title: 'AI Automation Efficiency', value: '88%', icon: Sparkles, color: 'text-accent bg-accent/10 border-accent/20', trend: '12 hours saved this month' },
          { title: 'Peak Energy Window', value: '10:00 AM', icon: Activity, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', trend: 'Optimal focus duration' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
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
                <div className="text-4xl font-extrabold text-foreground tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowUpRight size={12} className="text-emerald-500" />
                  <span>{stat.trend}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Weekly Activity & Heatmap */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Activity Graph */}
          <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">Weekly Activity Breakdown</h3>
                <p className="text-xs text-muted-foreground">Completed vs missed vs pending reminders</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Completed</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Missed</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Pending</div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <XAxis dataKey="name" stroke="rgba(150,150,150,0.5)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(150,150,150,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(18,20,32,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', color: '#fff' }} />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="missed" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Heatmap */}
          <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Monthly Productivity Heatmap</h3>
                <p className="text-xs text-muted-foreground">Daily completion density over the last 28 days</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-500/20" />
                  <span className="w-3 h-3 rounded bg-emerald-500/40" />
                  <span className="w-3 h-3 rounded bg-emerald-500/70" />
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                </div>
                <span>More</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 pt-2">
              {heatmapData.map((item, idx) => {
                let bg = 'bg-emerald-500/20';
                if (item.score > 85) bg = 'bg-emerald-500 shadow-lg shadow-emerald-500/30';
                else if (item.score > 75) bg = 'bg-emerald-500/70';
                else if (item.score > 65) bg = 'bg-emerald-500/40';

                return (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    title={`${item.day}: ${item.score}% productivity`}
                    className={`h-12 rounded-2xl ${bg} border border-white/10 flex items-center justify-center cursor-pointer transition-all`}
                  >
                    <span className="text-[10px] font-bold text-white/90">{item.day.replace('Day ', '')}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Category Analytics & AI Performance Insights */}
        <div className="space-y-8">
          {/* Category Analytics Pie Chart */}
          <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
            <div>
              <h3 className="font-bold text-lg text-foreground">Category Distribution</h3>
              <p className="text-xs text-muted-foreground">Share of reminders by workspace category</p>
            </div>

            <div className="h-64 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(18,20,32,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-foreground">100%</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Allocated</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-foreground truncate">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground">{cat.value}% share</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Performance Insights */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border border-primary/40 shadow-2xl p-6 space-y-6 relative overflow-hidden glow-primary">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/30 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-white font-bold text-lg relative z-10">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <span>AI Performance Insights</span>
            </div>

            <div className="space-y-4 relative z-10 text-slate-200 text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Task Completion Velocity</span>
                  <span className="text-emerald-400">+18.4%</span>
                </div>
                <p className="text-xs text-slate-300">Your average time to complete high-priority tasks has decreased from 4.2 hours to 3.4 hours following AI smart scheduling.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Burnout Protection</span>
                  <span className="text-amber-400">Active</span>
                </div>
                <p className="text-xs text-slate-300">We detected a 25% increase in meeting load this week. AI has automatically injected two 30-minute buffer blocks on Friday.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
