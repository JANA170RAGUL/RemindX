import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  Flag, 
  Tag, 
  Bell, 
  AlertTriangle, 
  Paperclip, 
  Mic, 
  Check, 
  Plus, 
  Send, 
  HelpCircle,
  Save,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function CreateReminderPanel() {
  const { activeModal, closeModal, addReminder } = useStore();
  const isOpen = activeModal === 'createReminder' || activeModal === 'aiQuickAdd';

  const getDefaultTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d.toTimeString().slice(0, 5);
  };

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(getDefaultTime());
  const [repeat, setRepeat] = useState('one-time'); // 'one-time' | 'daily' | 'weekly' | 'monthly' | 'custom'
  const [priority, setPriority] = useState('medium'); // 'low' | 'medium' | 'high' | 'urgent'
  const [category, setCategory] = useState('Work'); // 'Work' | 'Personal' | 'Health' | 'Finance'
  const [tags, setTags] = useState(['AI', 'Schedule']);
  const [tagInput, setTagInput] = useState('');
  const [notificationMethods, setNotificationMethods] = useState({ push: true, email: true, sms: false, telegram: true });
  const [alertOffset, setAlertOffset] = useState('15m before');
  const [aiInput, setAiInput] = useState('');
  const [isAiParsing, setIsAiParsing] = useState(false);

  // Pre-fill or focus based on activeModal type
  useEffect(() => {
    if (isOpen) {
      if (activeModal === 'aiQuickAdd') {
        setAiInput('Remind me to drink water every 2 hours');
      } else {
        setAiInput('');
        setTitle('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime(getDefaultTime());
        setPriority('medium');
        setCategory('Work');
        setNotificationMethods({ push: true, email: true, sms: false, telegram: true });
      }
    }
  }, [isOpen, activeModal]);

  // AI Natural Language Parsing Simulation
  const handleAiParse = () => {
    if (!aiInput.trim()) return;
    setIsAiParsing(true);
    
    setTimeout(() => {
      const lower = aiInput.toLowerCase();
      if (lower.includes('drink water')) {
        setTitle('Hydration Break: Drink 500ml Water');
        setCategory('Health');
        setPriority('medium');
        setRepeat('custom');
        setDescription('Autonomous AI hydration reminder configured for optimal metabolic performance.');
        setTags(['Health', 'Habits', 'AI']);
      } else if (lower.includes('urgent') || lower.includes('ceo')) {
        setTitle('Executive Alignment: Meeting with CEO');
        setCategory('Work');
        setPriority('urgent');
        setDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Tomorrow
        setTime('10:00');
        setDescription('Critical strategy review. Ensure Q3 financial slides are fully prepared.');
        setTags(['Executive', 'Urgent', 'Strategy']);
      } else {
        setTitle(aiInput);
        setDescription('Smart reminder generated via Cyberpunk AI OS natural language engine.');
        setPriority('high');
        setTags(['SmartAdd', 'AI']);
      }
      setIsAiParsing(false);
      toast.success('AI Smart Parse Complete', { description: 'Schedule, priority, and tags autonomous allocation successful.' });
    }, 800);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = async (addAnother = false) => {
    if (!title.trim()) {
      toast.error('Validation Error', { description: 'Please enter a reminder title before saving.' });
      return;
    }

    const success = await addReminder({
      title,
      description: description || 'No description provided.',
      date,
      time,
      priority: priority === 'urgent' ? 'high' : priority, // map urgent to high for store compatibility
      category,
      tags,
      notifyType: notificationMethods.email ? 'email' : (notificationMethods.push ? 'push' : 'email')
    });

    if (success) {
      if (addAnother) {
        setTitle('');
        setDescription('');
        setAiInput('');
        toast.info('Workspace Reset', { description: 'Ready for next reminder configuration.' });
      } else {
        closeModal();
      }
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'low') return 'bg-blue-500/10 text-[#00e5ff] border-blue-500/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]';
    if (p === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    if (p === 'high') return 'bg-orange-500/10 text-orange-500 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]';
    return 'bg-rose-500/20 text-[#ff4fd8] border-[#ff4fd8]/50 shadow-[0_0_20px_rgba(255,79,216,0.4)] animate-pulse';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden select-none">
          {/* Backdrop Blur Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
          />

          {/* Cyberpunk Slide-over Panel */}
          <motion.div 
            initial={{ x: '100%', boxShadow: '-20px 0 50px rgba(0,0,0,0.8)' }}
            animate={{ x: 0, boxShadow: '-10px 0 40px rgba(236,72,153,0.2)' }}
            exit={{ x: '100%', boxShadow: '-20px 0 50px rgba(0,0,0,0.8)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg h-full bg-[#0b0f19]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col z-10 shadow-2xl overflow-hidden font-mono"
          >
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00e5ff] via-[#ff4fd8] to-purple-600" />

            {/* Panel Header (Sticky) */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4 sticky top-0 z-20 bg-[#0b0f19]/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff4fd8]/20 to-purple-600/20 border border-[#ff4fd8]/30 flex items-center justify-center text-[#ff4fd8] shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold bg-gradient-to-r from-white via-slate-200 to-[#ff4fd8] bg-clip-text text-transparent">
                    Create Reminder
                  </h2>
                  <p className="text-[11px] text-[#00e5ff]">Autonomous AI Dispatch Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => toast.info('Draft Saved', { description: 'Reminder state cached in local secure storage.' })}
                  className="px-4 py-2 rounded-xl bg-[#161b26] hover:bg-[#1f2637] border border-white/15 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Save size={14} className="text-[#00e5ff]" />
                  <span className="hidden sm:inline">Save Draft</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="w-9 h-9 rounded-xl bg-[#161b26] hover:bg-rose-500/20 border border-white/15 hover:border-rose-500/40 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all cursor-pointer shadow-md"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Panel Body (Scrollable Form) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* AI Smart Reminder Section */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-black/50 border border-[#ff4fd8]/30 shadow-[0_0_25px_rgba(236,72,153,0.15)] space-y-4 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff4fd8]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ff4fd8]">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>AI Smart Assistant Input</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-[#ff4fd8]/10 border border-[#ff4fd8]/20 text-[10px] text-[#ff4fd8]">
                    NLP v4.2
                  </span>
                </div>

                <div className="relative flex items-center">
                  <input 
                    type="text"
                    placeholder="e.g., Remind me to drink water every 2 hours..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiParse()}
                    className="w-full h-12 pl-4 pr-24 rounded-2xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff4fd8] focus:ring-1 focus:ring-[#ff4fd8]/30 transition-all shadow-inner font-mono"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button 
                      onClick={() => toast.info('Mic Activated', { description: 'Web Speech API listening for voice commands...' })}
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-[#00e5ff] transition-all cursor-pointer"
                      title="Voice Input"
                    >
                      <Mic size={14} />
                    </button>
                    <button 
                      onClick={handleAiParse}
                      disabled={isAiParsing}
                      className="px-3 h-8 rounded-xl bg-gradient-to-r from-[#ff4fd8] to-purple-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-[#ff4fd8]/20 hover:shadow-[#ff4fd8]/40 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isAiParsing ? <Sparkles size={14} className="animate-spin" /> : <Zap size={14} />}
                      <span>Parse</span>
                    </button>
                  </div>
                </div>

                {/* AI Preview Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 py-1">Try:</span>
                  {[
                    'Drink water every 2h',
                    'Urgent CEO meeting tomorrow 10am',
                    'Dentist checkup Friday 3pm'
                  ].map((chip, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setAiInput(chip); setTimeout(() => handleAiParse(), 200); }}
                      className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 hover:text-[#00e5ff] transition-all text-left truncate max-w-[180px] cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields Container */}
              <div className="space-y-6">
                
                {/* 1. Title & 2. Description */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Reminder Title *</span>
                      <span className="text-[10px] text-slate-500">Required</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="Enter reminder title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#101423]/90 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all font-mono shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Description</span>
                      <span className="text-[10px] text-slate-500">Optional</span>
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Add context, URLs, or specific instructions..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-[#101423]/90 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 transition-all font-mono resize-none shadow-inner"
                    />
                  </div>
                </div>

                {/* 3. Date & 4. Time Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Calendar size={14} className="text-[#00e5ff]" />
                      <span>Date</span>
                    </label>
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#101423]/90 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00e5ff] transition-all font-mono shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Clock size={14} className="text-[#ff4fd8]" />
                      <span>Time</span>
                    </label>
                    <input 
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#101423]/90 border border-white/15 text-xs text-white focus:outline-none focus:border-[#ff4fd8] transition-all font-mono shadow-inner"
                    />
                  </div>
                </div>

                {/* 5. Repeat Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Repeat Schedule</span>
                    <span className="text-[10px] text-[#00e5ff]">{repeat.toUpperCase()}</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { id: 'one-time', label: 'One Time' },
                      { id: 'daily', label: 'Daily' },
                      { id: 'weekly', label: 'Weekly' },
                      { id: 'monthly', label: 'Monthly' },
                      { id: 'custom', label: 'Custom' }
                    ].map((rep) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => setRepeat(rep.id)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border text-center cursor-pointer ${repeat === rep.id ? 'bg-gradient-to-r from-[#00e5ff] to-blue-600 text-white border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                      >
                        {rep.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Priority Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Priority Level</span>
                    <span className="text-[10px] text-rose-400">🔥 Autonomous Weighting</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'low', label: 'Low', color: 'blue' },
                      { id: 'medium', label: 'Medium', color: 'yellow' },
                      { id: 'high', label: 'High', color: 'orange' },
                      { id: 'urgent', label: 'Urgent 🔥', color: 'pink' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className={`py-2.5 px-2 rounded-2xl text-xs font-extrabold tracking-wider transition-all border flex items-center justify-center gap-1 cursor-pointer ${priority === p.id ? getPriorityColor(p.id) : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                      >
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Category Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Work', 'Personal', 'Health', 'Finance'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${category === cat ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. Tags Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Tags</span>
                    <span className="text-[10px] text-slate-500">Press Enter to add</span>
                  </label>
                  <div className="p-3 rounded-2xl bg-[#101423]/90 space-y-3 border border-white/15 shadow-inner">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-xl bg-white/10 text-white text-xs flex items-center gap-1 border border-white/10 shadow-sm">
                          <Tag size={10} className="text-[#00e5ff]" />
                          <span>{t}</span>
                          <button type="button" onClick={() => removeTag(t)} className="text-slate-400 hover:text-rose-500 transition-colors ml-1 cursor-pointer">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text"
                      placeholder="Add tag and press Enter..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="w-full h-9 px-3 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff4fd8] transition-all font-mono"
                    />
                  </div>
                </div>

                {/* 9. Notification Methods & 10. Reminder Alerts */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1">
                      <Bell size={14} className="text-amber-400" />
                      <span>Dispatch Channels</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'push', label: 'Push' },
                        { id: 'email', label: 'Email' },
                        { id: 'sms', label: 'SMS' },
                        { id: 'telegram', label: 'Telegram' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setNotificationMethods({ ...notificationMethods, [method.id]: !notificationMethods[method.id] })}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${notificationMethods[method.id] ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}`}
                        >
                          <div className={`w-3 h-3 rounded-md border flex items-center justify-center ${notificationMethods[method.id] ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600'}`}>
                            {notificationMethods[method.id] && <Check size={10} strokeWidth={3} />}
                          </div>
                          <span>{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                      <span>Pre-Alert Timing</span>
                      <span className="text-[10px] text-slate-400">Escalation offset</span>
                    </label>
                    <select 
                      value={alertOffset}
                      onChange={(e) => setAlertOffset(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#101423]/90 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00e5ff] transition-all font-mono shadow-inner"
                    >
                      <option value="At time of event" className="bg-[#0b0f19] text-white">At time of event</option>
                      <option value="5m before" className="bg-[#0b0f19] text-white">5 minutes before</option>
                      <option value="15m before" className="bg-[#0b0f19] text-white">15 minutes before</option>
                      <option value="30m before" className="bg-[#0b0f19] text-white">30 minutes before</option>
                      <option value="1h before">1 hour before</option>
                      <option value="1d before">1 day before</option>
                    </select>
                  </div>
                </div>

                {/* 11. Attachments Placeholder */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1">
                    <Paperclip size={14} className="text-purple-400" />
                    <span>Attachments & Telemetry</span>
                  </label>
                  <div 
                    onClick={() => toast.info('File Upload Simulated', { description: 'Cyberpunk storage vault ready for telemetry logs.' })}
                    className="border-2 border-dashed border-[#ff4fd8]/40 hover:border-[#00e5ff] bg-[#101423]/90 rounded-2xl p-6 text-center transition-all cursor-pointer group shadow-[0_0_25px_rgba(236,72,153,0.15)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-[#00e5ff]/10 pointer-events-none" />
                    <div className="w-12 h-12 rounded-2xl bg-[#ff4fd8]/20 border border-[#ff4fd8]/40 group-hover:bg-[#00e5ff]/20 group-hover:border-[#00e5ff]/50 flex items-center justify-center mx-auto mb-3 text-[#ff4fd8] group-hover:text-[#00e5ff] transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                      <Paperclip size={20} />
                    </div>
                    <p className="text-xs font-extrabold text-white mb-1">Drop telemetry logs or assets here</p>
                    <p className="text-[10px] text-slate-400">Supports JSON, PDF, PNG, or Markdown up to 50MB</p>
                  </div>
                </div>

              </div>

              {/* LIVE PREVIEW CARD */}
              <div className="p-6 rounded-3xl bg-[#0e1322]/95 backdrop-blur-2xl border border-[#00e5ff]/40 shadow-[0_0_35px_rgba(0,229,255,0.25)] space-y-4 relative overflow-hidden font-mono">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ff4fd8]/15 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#00e5ff] to-purple-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">Live Preview Card</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#00e5ff] px-3 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
                    Active Radar
                  </span>
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 text-[#ff4fd8] font-bold"><Clock size={12} /> {date} • {time}</span>
                    <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 font-extrabold shadow-[0_0_10px_rgba(168,85,247,0.2)]">{category}</span>
                  </div>

                  <h4 className="font-extrabold text-lg text-white break-words tracking-wide leading-snug">
                    {title || 'Untitled Autonomous Reminder'}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {description || 'No description provided. Autonomous trigger will fire at scheduled time.'}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-300 font-bold">
                      <span>Countdown:</span>
                      <span className="text-[#00e5ff] font-extrabold animate-pulse bg-[#070a14] px-3 py-1 rounded-xl border border-[#00e5ff]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">02h : 11m : 09s</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 font-extrabold tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      <Flag size={12} />
                      <span>{priority.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#101423] to-pink-950/60 border border-[#ff4fd8]/40 shadow-[0_0_25px_rgba(236,72,153,0.2)] flex items-start gap-3 text-xs text-slate-200 leading-relaxed relative overflow-hidden z-10">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#00e5ff] to-[#ff4fd8]" />
                  <div className="w-8 h-8 rounded-xl bg-[#ff4fd8]/20 border border-[#ff4fd8]/40 flex items-center justify-center text-[#ff4fd8] shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.3)] mt-0.5">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#ff4fd8] mr-1">💡 AI Tip:</span>
                    <span>High priority task scheduled during your peak focus window (10 AM - 12 PM). Optimal completion probability: 94%.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between gap-4 sticky bottom-0 z-20 bg-[#0b0f19]/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.98 }}
                onClick={closeModal}
                className="px-6 py-3.5 rounded-2xl bg-[#161b26] border border-white/10 text-xs font-extrabold text-white transition-all cursor-pointer shadow-md"
              >
                Cancel
              </motion.button>

              <div className="flex items-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(168,85,247,0.5)' }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleSave(true)}
                  className="px-5 py-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/60 text-xs font-extrabold text-purple-200 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                >
                  <Plus size={16} className="text-purple-400" />
                  <span className="hidden sm:inline">Save & Add Another</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(0,229,255,0.8)' }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave(false)}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#ff4fd8] to-purple-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00e5ff]/40 hover:shadow-[#00e5ff]/60 transition-all cursor-pointer"
                >
                  <Send size={16} />
                  <span>Save Reminder</span>
                </motion.button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
