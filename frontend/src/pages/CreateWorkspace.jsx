import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  BellRing, 
  Tag, 
  Flag, 
  Folder, 
  Repeat, 
  Mic, 
  Users, 
  Link2, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Plus, 
  Sun, 
  Moon, 
  Bell, 
  Zap, 
  Activity, 
  ChevronRight,
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function CreateWorkspace() {
  const { addReminder, theme, toggleTheme, user, notifications } = useStore();
  
  // Navigation / Mode state
  const [activeTab, setActiveTab] = useState('reminder'); // 'reminder' | 'event' | 'ai'
  
  // AI Smart Input State
  const [aiPrompt, setAiPrompt] = useState('Remind me to drink water every 2 hours');
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiParsedResult, setAiParsedResult] = useState(null);

  // Form State - Reminder
  const [remTitle, setRemTitle] = useState('');
  const [remDesc, setRemDesc] = useState('');
  const [remDate, setRemDate] = useState(new Date().toISOString().split('T')[0]);
  const [remTime, setRemTime] = useState('14:30');
  const [remRepeat, setRemRepeat] = useState('daily'); // 'none' | 'daily' | 'weekly' | 'monthly' | 'custom'
  const [remPriority, setRemPriority] = useState('high'); // 'low' | 'medium' | 'high' | 'urgent'
  const [remCategory, setRemCategory] = useState('Health');
  const [remTags, setRemTags] = useState(['Hydration', 'Wellness']);
  const [tagInput, setTagInput] = useState('');
  const [remNotify, setRemNotify] = useState('push'); // 'email' | 'push' | 'telegram' | 'whatsapp'

  // Form State - Event
  const [eventTitle, setEventTitle] = useState('Q3 AI Strategy Alignment');
  const [eventDesc, setEventDesc] = useState('Discussing LLM latency, autonomous agent workflows, and Q4 budget allocation.');
  const [eventStartDate, setEventStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventStartTime, setEventStartTime] = useState('15:00');
  const [eventEndTime, setEventEndTime] = useState('16:00');
  const [eventDuration, setEventDuration] = useState('60'); // minutes
  const [eventAttendees, setEventAttendees] = useState(['sarah@antigravity.ai', 'david@antigravity.ai', 'alex@antigravity.ai']);
  const [attendeeInput, setAttendeeInput] = useState('');
  const [eventLink, setEventLink] = useState('https://meet.google.com/cyber-ai-sync');
  const [eventColor, setEventColor] = useState('#00e5ff');
  const [eventAlert, setEventAlert] = useState('10'); // mins before
  const [hasConflict, setHasConflict] = useState(true);

  // Live Countdown Simulation
  const [countdown, setCountdown] = useState({ h: 2, m: 14, s: 11 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 2, m: 14, s: 11 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!remTags.includes(tagInput.trim())) {
        setRemTags([...remTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleAddAttendee = (e) => {
    if (e.key === 'Enter' && attendeeInput.trim()) {
      e.preventDefault();
      if (!eventAttendees.includes(attendeeInput.trim())) {
        setEventAttendees([...eventAttendees, attendeeInput.trim()]);
      }
      setAttendeeInput('');
    }
  };

  const handleAiParse = () => {
    if (!aiPrompt.trim()) return;
    setIsAiParsing(true);
    setTimeout(() => {
      setIsAiParsing(false);
      setAiParsedResult({
        title: 'Drink Water (Hydration)',
        category: 'Health',
        priority: 'high',
        repeat: 'Every 2 Hours',
        notify: 'WhatsApp / Push',
        nextTrigger: 'Today at 4:00 PM'
      });
      setRemTitle('Drink Water (Hydration)');
      setRemCategory('Health');
      setRemPriority('high');
      setRemRepeat('custom');
      setRemTags(['Hydration', 'AI-Smart']);
      toast.success('AI Smart Schedule Generated!', {
        description: 'Successfully parsed natural language into recurring rule.'
      });
    }, 1200);
  };

  const handleCreateReminderSubmit = (e) => {
    e.preventDefault();
    if (!remTitle.trim()) {
      toast.error('Please enter a reminder title');
      return;
    }
    addReminder({
      title: remTitle,
      description: remDesc,
      date: remDate,
      time: remTime,
      priority: remPriority === 'urgent' ? 'high' : remPriority,
      category: remCategory,
      tags: remTags,
      notifyType: remNotify === 'whatsapp' || remNotify === 'telegram' ? 'push' : remNotify,
      repeat: remRepeat
    });
    toast.success('Cyber Reminder Dispatched!', {
      description: `"${remTitle}" scheduled for ${remDate} at ${remTime}`
    });
    // Reset form
    setRemTitle('');
    setRemDesc('');
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      toast.error('Please enter an event title');
      return;
    }
    addReminder({
      title: `📅 ${eventTitle}`,
      description: `${eventDesc} • Attendees: ${eventAttendees.join(', ')} • Link: ${eventLink}`,
      date: eventStartDate,
      time: eventStartTime,
      priority: 'high',
      category: 'Work',
      tags: ['Meeting', 'Calendar-Event'],
      notifyType: 'email',
      repeat: 'none'
    });
    toast.success('Calendar Event Created!', {
      description: `Synced with Google Calendar & attendees notified.`
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mini Chart data for Productivity Meter
  const focusChartData = [
    { name: '08:00', focus: 65 }, { name: '10:00', focus: 88 }, 
    { name: '12:00', focus: 75 }, { name: '14:00', focus: 95 }, 
    { name: '16:00', focus: 82 }, { name: '18:00', focus: 60 }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 select-none max-w-[1600px] mx-auto bg-[#0b0f19] min-h-full text-slate-100 rounded-3xl border border-white/10 shadow-2xl">
      {/* TOP ACTION SECTION */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-[#111827]/80 backdrop-blur-2xl border border-[#ff4fd8]/30 shadow-[0_0_35px_rgba(0,229,255,0.15)] flex-wrap relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#ff4fd8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Navigation Buttons */}
        <div className="flex items-center gap-3 flex-wrap relative z-10">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(255,79,216,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('reminder')}
            className={`px-6 py-3 rounded-full font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
              activeTab === 'reminder' 
                ? 'bg-gradient-to-r from-[#ff4fd8] to-[#7c3aed] text-white border-transparent shadow-[0_0_20px_rgba(255,79,216,0.5)] font-black' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#ff4fd8]/40 hover:text-white'
            }`}
          >
            <BellRing size={16} />
            <span>Create Reminder</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(0,229,255,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('event')}
            className={`px-6 py-3 rounded-full font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
              activeTab === 'event' 
                ? 'bg-gradient-to-r from-[#00e5ff] to-[#3b82f6] text-white border-transparent shadow-[0_0_20px_rgba(0,229,255,0.5)] font-black' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#00e5ff]/40 hover:text-white'
            }`}
          >
            <CalendarIcon size={16} />
            <span>Create Event</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-full font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
              activeTab === 'ai' 
                ? 'bg-gradient-to-r from-[#7c3aed] via-[#ff4fd8] to-[#00e5ff] text-white border-transparent shadow-[0_0_20px_rgba(124,58,237,0.5)] font-black animate-pulse' 
                : 'bg-[#7c3aed]/20 text-[#ff4fd8] border-[#7c3aed]/40 hover:border-[#ff4fd8] hover:text-white'
            }`}
          >
            <Sparkles size={16} className="animate-spin" />
            <span>AI Time Block</span>
          </motion.button>
        </div>

        {/* Right Header Utilities */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-[#00e5ff]">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
            <span>CYBER_ENGINE // v4.2</span>
          </div>

          {/* Theme Toggle */}
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#00e5ff]/50 transition-all shadow-md cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-[#00e5ff]" />}
          </motion.button>

          {/* Notification Icon */}
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.info('Notification Center Simulated')}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#ff4fd8]/50 transition-all shadow-md cursor-pointer relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ff4fd8] rounded-full ring-2 ring-slate-900 animate-pulse shadow-[0_0_8px_#ff4fd8]" />
              )}
            </motion.button>
          </div>

          {/* User Avatar */}
          <motion.div 
            whileHover={{ scale: 1.05, ringColor: '#00e5ff' }}
            className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#ff4fd8]/50 shadow-[0_0_15px_rgba(255,79,216,0.3)] cursor-pointer"
          >
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>

      {/* MAIN SPLIT DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDE: CREATION FORMS & AI SMART INPUT (7 Cols on Desktop) */}
        <div className="lg:col-span-7 space-y-8">

          {/* AI SMART INPUT BOX */}
          <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-[#1e1b4b]/90 via-[#31103f]/90 to-[#0f172a]/90 backdrop-blur-2xl border border-[#ff4fd8]/40 shadow-[0_0_35px_rgba(255,79,216,0.2)] relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff4fd8]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2 text-[#ff4fd8] font-black text-lg tracking-wide uppercase font-mono">
                <Sparkles className="w-6 h-6 animate-spin text-[#00e5ff]" />
                <span>AI Smart Scheduling Engine</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff]/40 text-[#00e5ff] text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                Autonomous NLP
              </span>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="relative">
                <textarea
                  rows={2}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Remind me to drink water every 2 hours starting today at 4 PM..."
                  className="w-full p-5 pr-16 rounded-2xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-base font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all resize-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => toast.info('Voice Input Activated... (Simulated)')}
                  title="Voice Input Placeholder"
                  className="absolute right-4 top-4 p-3 rounded-xl bg-[#7c3aed]/30 border border-[#7c3aed]/50 text-[#00e5ff] hover:bg-[#7c3aed]/50 hover:text-white transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer"
                >
                  <Mic size={20} className="animate-pulse" />
                </button>
              </div>

              {/* Smart Suggestion Chips */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 block font-mono">
                  ⚡ Interactive AI Prompt Templates:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Remind me to drink water every 2 hours',
                    'Schedule Q3 DevOps alignment next Monday at 10 AM',
                    'Pay quarterly cloud hosting bills on Friday at 5 PM',
                    'Review SOC2 compliance logs every morning at 9 AM'
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(chip)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#ff4fd8]/20 border border-white/10 hover:border-[#ff4fd8]/40 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer"
                    >
                      "{chip}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Action & Parse Preview */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#00e5ff] animate-ping shadow-[0_0_10px_#00e5ff]" />
                  <span className="text-xs text-slate-400 font-mono">
                    {aiParsedResult ? `Parsed: ${aiParsedResult.title} • ${aiParsedResult.repeat}` : 'Ready for natural language input...'}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,229,255,0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAiParse}
                  disabled={isAiParsing}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#7c3aed] to-[#ff4fd8] text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 transition-all cursor-pointer border border-[#00e5ff]"
                >
                  {isAiParsing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Parsing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate Smart Schedule</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* DYNAMIC FORM SWITCHER */}
          <AnimatePresence mode="wait">
            {activeTab === 'reminder' || activeTab === 'ai' ? (
              /* CREATE REMINDER FORM */
              <motion.div
                key="reminderForm"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                className="p-6 lg:p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-2xl border border-[#00e5ff]/30 shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#ff4fd8] via-[#7c3aed] to-[#00e5ff]" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-wide font-mono flex items-center gap-3">
                      <BellRing className="text-[#ff4fd8]" />
                      <span>Advanced Reminder Configuration</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">Precision triggers, custom recurrence, and multi-channel dispatch</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#ff4fd8]/20 border border-[#ff4fd8]/40 text-[#ff4fd8] text-xs font-mono font-bold">
                    Mode: Reminder
                  </span>
                </div>

                <form onSubmit={handleCreateReminderSubmit} className="space-y-6">
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">Reminder Title *</label>
                      <input 
                        type="text" 
                        required
                        value={remTitle} 
                        onChange={(e) => setRemTitle(e.target.value)}
                        placeholder="e.g., Finalize Q3 AI Product Strategy"
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-[#ff4fd8] focus:ring-2 focus:ring-[#ff4fd8]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Folder size={14} className="text-[#00e5ff]" /> Category
                      </label>
                      <select 
                        value={remCategory} 
                        onChange={(e) => setRemCategory(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all shadow-inner"
                      >
                        <option value="Work" className="bg-slate-900 text-white">Work // Corporate</option>
                        <option value="Personal" className="bg-slate-900 text-white">Personal // Lifestyle</option>
                        <option value="Health" className="bg-slate-900 text-white">Health // Wellness</option>
                        <option value="Finance" className="bg-slate-900 text-white">Finance // Capital</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">Description / Notes</label>
                    <textarea 
                      rows={3}
                      value={remDesc}
                      onChange={(e) => setRemDesc(e.target.value)}
                      placeholder="Add context, meeting URLs, or specific checklist items..."
                      className="w-full p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-[#ff4fd8] focus:ring-2 focus:ring-[#ff4fd8]/20 transition-all resize-none shadow-inner"
                    />
                  </div>

                  {/* Date, Time & Repeat */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <CalendarIcon size={14} className="text-[#ff4fd8]" /> Date
                      </label>
                      <input 
                        type="date" 
                        value={remDate}
                        onChange={(e) => setRemDate(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#ff4fd8] focus:ring-2 focus:ring-[#ff4fd8]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Clock size={14} className="text-[#00e5ff]" /> Time
                      </label>
                      <input 
                        type="time" 
                        value={remTime}
                        onChange={(e) => setRemTime(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Repeat size={14} className="text-[#7c3aed]" /> Repeat Schedule
                      </label>
                      <select 
                        value={remRepeat} 
                        onChange={(e) => setRemRepeat(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all shadow-inner"
                      >
                        <option value="none" className="bg-slate-900 text-white">One Time Only</option>
                        <option value="daily" className="bg-slate-900 text-white">Daily Recurrence</option>
                        <option value="weekly" className="bg-slate-900 text-white">Weekly Recurrence</option>
                        <option value="monthly" className="bg-slate-900 text-white">Monthly Recurrence</option>
                        <option value="custom" className="bg-slate-900 text-white">Custom Recurring Rule</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority Badges */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 font-mono flex items-center gap-1.5">
                      <Flag size={14} className="text-rose-500" /> Priority Level
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { id: 'low', label: 'Low', color: 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500' },
                        { id: 'medium', label: 'Medium', color: 'border-blue-500/30 text-blue-400 hover:border-blue-500' },
                        { id: 'high', label: 'High', color: 'border-amber-500/30 text-amber-400 hover:border-amber-500' },
                        { id: 'urgent', label: 'Urgent 🔥', color: 'border-rose-500/50 text-rose-400 hover:border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' }
                      ].map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setRemPriority(p.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 font-mono ${
                            remPriority === p.id 
                              ? `bg-white/10 ${p.color} ring-2 ring-current font-bold` 
                              : `bg-slate-950/40 border-white/10 text-slate-400 hover:bg-white/5`
                          }`}
                        >
                          <span className="text-xs uppercase tracking-wider">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags Input & Notification Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Tag size={14} className="text-[#ff4fd8]" /> Tags (Press Enter)
                      </label>
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center gap-2 shadow-inner min-h-[48px]">
                        {remTags.map((t, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-xl bg-[#ff4fd8]/20 text-[#ff4fd8] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#ff4fd8]/30 shadow-sm">
                            {t}
                            <button type="button" onClick={() => setRemTags(remTags.filter(item => item !== t))} className="hover:text-white">×</button>
                          </span>
                        ))}
                        <input 
                          type="text" 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder={remTags.length === 0 ? "Add tag..." : ""}
                          className="bg-transparent text-white placeholder:text-slate-500 text-xs font-mono focus:outline-none flex-1 min-w-[100px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Send size={14} className="text-[#00e5ff]" /> Notification Channel
                      </label>
                      <select 
                        value={remNotify} 
                        onChange={(e) => setRemNotify(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all shadow-inner"
                      >
                        <option value="push" className="bg-slate-900 text-white">Mobile Push Alert (iOS / Android)</option>
                        <option value="email" className="bg-slate-900 text-white">Corporate Email Dispatch</option>
                        <option value="telegram" className="bg-slate-900 text-white">Telegram Bot Gateway</option>
                        <option value="whatsapp" className="bg-slate-900 text-white">WhatsApp Business API (Simulated)</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,79,216,0.6)' }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#ff4fd8] via-[#7c3aed] to-[#00e5ff] text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-3 shadow-[0_0_20px_rgba(255,79,216,0.4)] cursor-pointer border border-[#ff4fd8]/50 font-mono"
                    >
                      <BellRing size={18} />
                      <span>Dispatch Cyber Reminder</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* CREATE EVENT FORM */
              <motion.div
                key="eventForm"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                className="p-6 lg:p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-2xl border border-[#00e5ff]/30 shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00e5ff] via-[#3b82f6] to-[#7c3aed]" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-wide font-mono flex items-center gap-3">
                      <CalendarIcon className="text-[#00e5ff]" />
                      <span>Premium Calendar Event Module</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">Two-way Google Calendar sync, AI conflict resolution, and attendee invites</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff]/40 text-[#00e5ff] text-xs font-mono font-bold">
                    Mode: Calendar Event
                  </span>
                </div>

                {/* Conflict Detection Banner */}
                {hasConflict && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white font-mono">⚠️ Scheduling Conflict Detected</span>
                        <span className="text-[11px] text-rose-300 font-mono">Overlaps with "1-on-1 with Chief Architect" at 11:00 AM.</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        setEventStartTime('14:00');
                        setEventEndTime('15:00');
                        setHasConflict(false);
                        toast.success('Conflict Resolved', { description: 'AI automatically shifted event to 14:00.' });
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500 text-white font-extrabold text-[11px] font-mono tracking-wider uppercase hover:bg-rose-600 transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      AI Auto-Shift (+3h)
                    </button>
                  </motion.div>
                )}

                <form onSubmit={handleCreateEventSubmit} className="space-y-6">
                  {/* Title & Color */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">Event Title *</label>
                      <input 
                        type="text" 
                        required
                        value={eventTitle} 
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">Event Color</label>
                      <div className="h-12 p-1.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-2 shadow-inner">
                        <input 
                          type="color" 
                          value={eventColor} 
                          onChange={(e) => setEventColor(e.target.value)}
                          className="w-full h-full rounded-xl bg-transparent border-none cursor-pointer"
                        />
                        <span className="text-xs font-mono text-slate-300 pr-2 uppercase">{eventColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">Agenda / Description</label>
                    <textarea 
                      rows={3}
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all resize-none shadow-inner"
                    />
                  </div>

                  {/* Date, Time & Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <CalendarIcon size={14} className="text-[#00e5ff]" /> Start Date
                      </label>
                      <input 
                        type="date" 
                        value={eventStartDate}
                        onChange={(e) => setEventStartDate(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Clock size={14} className="text-[#00e5ff]" /> Start Time
                      </label>
                      <input 
                        type="time" 
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Clock size={14} className="text-[#ff4fd8]" /> End Time
                      </label>
                      <input 
                        type="time" 
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#ff4fd8] focus:ring-2 focus:ring-[#ff4fd8]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Sliders size={14} className="text-[#7c3aed]" /> Smart Duration
                      </label>
                      <select 
                        value={eventDuration} 
                        onChange={(e) => {
                          setEventDuration(e.target.value);
                          toast.info(`Duration adjusted to ${e.target.value} minutes`);
                        }}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all shadow-inner"
                      >
                        <option value="15" className="bg-slate-900 text-white">15 Minutes // Standup</option>
                        <option value="30" className="bg-slate-900 text-white">30 Minutes // Sync</option>
                        <option value="45" className="bg-slate-900 text-white">45 Minutes // Review</option>
                        <option value="60" className="bg-slate-900 text-white">60 Minutes // Strategy</option>
                      </select>
                    </div>
                  </div>

                  {/* Attendees Input */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                      <Users size={14} className="text-[#00e5ff]" /> Attendees (Press Enter)
                    </label>
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center gap-2 shadow-inner min-h-[48px]">
                      {eventAttendees.map((att, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-[#00e5ff]/20 text-[#00e5ff] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#00e5ff]/30 shadow-sm">
                          {att}
                          <button type="button" onClick={() => setEventAttendees(eventAttendees.filter(item => item !== att))} className="hover:text-white">×</button>
                        </span>
                      ))}
                      <input 
                        type="email" 
                        value={attendeeInput}
                        onChange={(e) => setAttendeeInput(e.target.value)}
                        onKeyDown={handleAddAttendee}
                        placeholder={eventAttendees.length === 0 ? "Add attendee email..." : ""}
                        className="bg-transparent text-white placeholder:text-slate-500 text-xs font-mono focus:outline-none flex-1 min-w-[150px]"
                      />
                    </div>
                  </div>

                  {/* Meeting Link & Alerts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <Link2 size={14} className="text-[#ff4fd8]" /> Video Conference URL
                      </label>
                      <input 
                        type="url" 
                        value={eventLink} 
                        onChange={(e) => setEventLink(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#ff4fd8] focus:ring-2 focus:ring-[#ff4fd8]/20 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                        <BellRing size={14} className="text-[#00e5ff]" /> Reminder Alert
                      </label>
                      <select 
                        value={eventAlert} 
                        onChange={(e) => setEventAlert(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all shadow-inner"
                      >
                        <option value="5" className="bg-slate-900 text-white">5 Minutes Before</option>
                        <option value="10" className="bg-slate-900 text-white">10 Minutes Before</option>
                        <option value="30" className="bg-slate-900 text-white">30 Minutes Before</option>
                        <option value="60" className="bg-slate-900 text-white">1 Hour Before</option>
                      </select>
                    </div>
                  </div>

                  {/* Drag and Drop Time Selection Placeholder */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#7c3aed]">
                        <Sliders size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white font-mono block">Interactive Time Block Grid</span>
                        <span className="text-[11px] text-slate-400 font-mono">Drag across the timeline to adjust start & end times autonomously.</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-[#7c3aed]/20 text-[#ff4fd8] text-xs font-mono font-bold border border-[#7c3aed]/40 animate-pulse">
                      Auto-Synced
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,255,0.6)' }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#3b82f6] to-[#7c3aed] text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer border border-[#00e5ff]/50 font-mono"
                    >
                      <CalendarIcon size={18} />
                      <span>Schedule Calendar Event</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT SIDE: LIVE PREVIEW PANEL & PRODUCTIVITY WIDGETS (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-8">

          {/* LIVE PREVIEW CARD */}
          <div className="p-6 lg:p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-2xl border border-[#ff4fd8]/30 shadow-[0_0_35px_rgba(255,79,216,0.15)] space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4fd8]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-extrabold text-lg text-white font-mono flex items-center gap-2">
                <Eye className="text-[#00e5ff]" />
                <span>Live Event Preview</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest animate-pulse">
                Real-Time Sync
              </span>
            </div>

            {/* Simulated Event Card */}
            <motion.div 
              layout
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-white/15 shadow-xl space-y-4 relative overflow-hidden"
              style={{ borderLeftColor: activeTab === 'event' ? eventColor : '#ff4fd8', borderLeftWidth: '6px' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {activeTab === 'event' ? 'Calendar Event' : 'Cyber Reminder'}
                </span>
                <span className="px-2.5 py-0.5 rounded-xl bg-white/10 text-white text-[10px] font-mono font-bold border border-white/10">
                  {activeTab === 'event' ? `${eventDuration} Mins` : remPriority}
                </span>
              </div>

              <h4 className="text-xl font-black text-white font-mono tracking-wide leading-snug">
                {activeTab === 'event' ? eventTitle : remTitle || 'Untitled Workspace Task'}
              </h4>

              <p className="text-xs text-slate-300 font-mono line-clamp-2 leading-relaxed">
                {activeTab === 'event' ? eventDesc : remDesc || 'No description provided.'}
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1.5 font-bold text-[#00e5ff]">
                  <Clock size={14} />
                  <span>{activeTab === 'event' ? `${eventStartDate} • ${eventStartTime}` : `${remDate} • ${remTime}`}</span>
                </div>
                <div className="flex items-center gap-1 text-[#ff4fd8] font-bold">
                  <Tag size={12} />
                  <span>{activeTab === 'event' ? 'Meeting' : remTags[0] || 'Tag'}</span>
                </div>
              </div>
            </motion.div>

            {/* Animated Neon Countdown Timer */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-[#00e5ff]/40 shadow-[0_0_25px_rgba(0,229,255,0.2)] text-center space-y-3 relative overflow-hidden">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#00e5ff] font-mono block">
                ⚡ Next Scheduled Trigger In:
              </span>
              <div className="flex items-center justify-center gap-4 text-3xl lg:text-4xl font-black font-mono tracking-tight text-white">
                <div className="flex flex-col items-center">
                  <span className="bg-slate-900 px-3 py-2 rounded-xl border border-white/10 shadow-inner">{String(countdown.h).padStart(2, '0')}</span>
                  <span className="text-[10px] text-slate-500 uppercase mt-1">Hours</span>
                </div>
                <span className="text-[#ff4fd8] animate-pulse">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-900 px-3 py-2 rounded-xl border border-white/10 shadow-inner">{String(countdown.m).padStart(2, '0')}</span>
                  <span className="text-[10px] text-slate-500 uppercase mt-1">Mins</span>
                </div>
                <span className="text-[#00e5ff] animate-pulse">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-slate-900 px-3 py-2 rounded-xl border border-white/10 shadow-inner">{String(countdown.s).padStart(2, '0')}</span>
                  <span className="text-[10px] text-slate-500 uppercase mt-1">Secs</span>
                </div>
              </div>
            </div>

            {/* AI Optimization Suggestions */}
            <div className="p-4 rounded-2xl bg-[#7c3aed]/15 border border-[#7c3aed]/40 space-y-2 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff4fd8] font-mono">
                <Zap size={14} className="text-[#00e5ff]" />
                <span>AI Optimization Suggestion</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                ⚡ <strong className="text-white">Fatigue Protection:</strong> Shifting this event 30 minutes later creates a biological recovery buffer between your afternoon alignment syncs.
              </p>
            </div>
          </div>

          {/* PRODUCTIVITY WIDGETS */}
          <div className="p-6 lg:p-8 rounded-3xl bg-[#111827]/90 backdrop-blur-2xl border border-[#00e5ff]/30 shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-8 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00e5ff]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-extrabold text-lg text-white font-mono flex items-center gap-2">
                <Activity className="text-[#ff4fd8]" />
                <span>Productivity Insights</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#ff4fd8] border border-[#7c3aed]/40 text-[10px] font-black uppercase tracking-widest">
                AI Pro Score
              </span>
            </div>

            {/* Daily Focus Score Circular Meter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 88 }, { value: 12 }]}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75}
                      startAngle={90} endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#00e5ff" stroke="transparent" />
                      <Cell fill="rgba(255,255,255,0.05)" stroke="transparent" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-white font-mono tracking-tight">88%</span>
                  <span className="text-[10px] text-[#00e5ff] uppercase font-black font-mono tracking-widest">Focus Peak</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white font-mono">Daily Focus Score</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  Your biological workflow efficiency is currently operating at <strong className="text-[#00e5ff]">Elite Tier</strong>. You have 4 hours of deep work remaining.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-400">Optimal Brainwave Window</span>
                </div>
              </div>
            </div>

            {/* Mini Area Chart / Productivity Meter */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">Real-Time Cognitive Load</span>
                <span className="text-xs font-mono text-[#ff4fd8] font-bold">+14.2% Efficiency</span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={focusChartData}>
                    <defs>
                      <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff4fd8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="focus" stroke="#ff4fd8" strokeWidth={2} fillOpacity={1} fill="url(#cyberGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendations List */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono block">
                ⚡ Autonomous AI Recommendations:
              </span>
              <div className="space-y-2.5">
                {[
                  { title: 'Pre-warm serverless functions for 15:00 sync', type: 'DevOps' },
                  { title: 'Block 30m fasting window before health checkup', type: 'Wellness' },
                ].map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 group hover:border-[#00e5ff]/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <CheckCircle2 size={16} className="text-[#00e5ff] shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-slate-300 font-mono truncate group-hover:text-white">{rec.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-mono text-slate-400 border border-white/5 shrink-0">
                      {rec.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
