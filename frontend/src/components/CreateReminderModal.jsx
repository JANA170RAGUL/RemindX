import { useStore } from '../store/useStore';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  Tag, 
  Flag, 
  BellRing, 
  Folder, 
  Repeat, 
  Mic, 
  ArrowRight, 
  ArrowLeft,
  Check
} from 'lucide-react';

export default function CreateReminderModal() {
  const { activeModal, closeModal, addReminder } = useStore();
  const [step, setStep] = useState(1);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [tags, setTags] = useState(['AI', 'Task']);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      priority: 'medium',
      category: 'Work',
      notifyType: 'push',
      repeat: 'none'
    }
  });

  const watchPriority = watch('priority');
  const watchCategory = watch('category');
  const watchNotify = watch('notifyType');
  const watchRepeat = watch('repeat');

  if (!activeModal) return null;

  const isAiMode = activeModal === 'aiQuickAdd';

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

  const onSubmit = (data) => {
    addReminder({ ...data, tags });
    toast.success('Reminder created successfully!', {
      description: `${data.title} scheduled for ${data.date} at ${data.time}`
    });
    reset();
    setTags(['AI', 'Task']);
    setStep(1);
    closeModal();
  };

  const handleAiQuickSubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    // Simulate AI parsing natural language
    setTimeout(() => {
      setIsAiLoading(false);
      const generatedTitle = aiPrompt.replace(/(tomorrow|next week|at \d+:\d+|on \w+)/gi, '').trim() || 'AI Smart Task';
      addReminder({
        title: generatedTitle,
        description: `Generated from prompt: "${aiPrompt}"`,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '10:00',
        priority: 'high',
        category: 'Work',
        tags: ['AI-Generated', 'Smart'],
        notifyType: 'push',
        repeat: 'none'
      });
      toast.success('AI Reminder Scheduled!', {
        description: `Smart parsed: "${generatedTitle}" for Tomorrow at 10:00 AM`
      });
      setAiPrompt('');
      closeModal();
    }, 1200);
  };

  const quickTemplates = [
    { title: 'Weekly Team Sync', category: 'Work', priority: 'medium', time: '10:00' },
    { title: 'Gym & Cardio Session', category: 'Health', priority: 'high', time: '07:30' },
    { title: 'Review Monthly Budget', category: 'Finance', priority: 'medium', time: '15:00' },
    { title: 'Call Family / Parents', category: 'Personal', priority: 'low', time: '19:00' },
  ];

  const applyTemplate = (tmpl) => {
    setValue('title', tmpl.title);
    setValue('category', tmpl.category);
    setValue('priority', tmpl.priority);
    setValue('time', tmpl.time);
    toast.info(`Applied template: ${tmpl.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl rounded-3xl glass-card overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 text-white">
              {isAiMode ? <Sparkles className="w-5 h-5 animate-pulse" /> : <BellRing className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-xl text-foreground">
                {isAiMode ? 'AI Natural Language Quick Add' : 'Create New Reminder'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAiMode ? 'Type naturally and let AI configure your reminder schedule.' : `Multi-step smart configuration • Step ${step} of 2`}
              </p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-2 rounded-2xl hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {isAiMode ? (
            /* AI QUICK ADD MODE */
            <form onSubmit={handleAiQuickSubmit} className="space-y-6">
              <div className="relative">
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Remind me to review the Q3 AI Strategy document tomorrow at 2 PM with high priority..."
                  className="w-full p-6 rounded-3xl glass-input text-foreground placeholder:text-muted-foreground text-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => toast.info('Voice listening activated... (Simulated)')}
                  title="Voice Input Placeholder"
                  className="absolute right-4 bottom-4 p-3 rounded-2xl bg-accent/10 text-accent hover:bg-accent/20 transition-all glow-primary"
                >
                  <Mic size={20} />
                </button>
              </div>

              {/* Quick AI Suggestions */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                  Try AI Prompt Examples
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Schedule DevOps sync next Monday at 10 AM',
                    'Remind me to drink water every day at 3 PM',
                    'Pay quarterly cloud hosting bills on Friday'
                  ].map((example, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(example)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-muted-foreground hover:text-foreground transition-all"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-semibold flex items-center gap-2 shadow-xl shadow-accent/20 disabled:opacity-50 transition-all"
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Parsing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Schedule Smart Reminder</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          ) : (
            /* MULTI-STEP FORM MODE */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Quick Templates */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                        Quick Templates
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        {quickTemplates.map((tmpl, idx) => (
                          <div 
                            key={idx}
                            onClick={() => applyTemplate(tmpl)}
                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all flex items-center justify-between group"
                          >
                            <div className="flex flex-col overflow-hidden pr-2">
                              <span className="text-xs font-semibold text-foreground truncate">{tmpl.title}</span>
                              <span className="text-[10px] text-muted-foreground">{tmpl.category} • {tmpl.time}</span>
                            </div>
                            <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <Plus size={14} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Title Input */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Reminder Title *
                      </label>
                      <input 
                        type="text" 
                        {...register('title', { required: 'Title is required' })}
                        placeholder="e.g., Finalize Q3 AI Product Strategy"
                        className="w-full h-12 px-4 rounded-2xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      {errors.title && <span className="text-xs text-rose-500 mt-1 block">{errors.title.message}</span>}
                    </div>

                    {/* Description Input */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Description / Notes
                      </label>
                      <textarea 
                        rows={3}
                        {...register('description')}
                        placeholder="Add additional context, meeting links, or specific tasks..."
                        className="w-full p-4 rounded-2xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                      />
                    </div>

                    {/* Date & Time Pickers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                          <Calendar size={14} /> Date
                        </label>
                        <input 
                          type="date" 
                          {...register('date')}
                          className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                          <Clock size={14} /> Time
                        </label>
                        <input 
                          type="time" 
                          {...register('time')}
                          className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          if (watch('title').trim()) {
                            setStep(2);
                          } else {
                            toast.error('Please enter a reminder title first');
                          }
                        }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
                      >
                        <span>Next Step</span>
                        <ArrowRight size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Priority Selector */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                        <Flag size={14} /> Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'low', label: 'Low Priority', color: 'border-emerald-500/30 text-emerald-500' },
                          { id: 'medium', label: 'Medium Priority', color: 'border-amber-500/30 text-amber-500' },
                          { id: 'high', label: 'High Priority', color: 'border-rose-500/30 text-rose-500' }
                        ].map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setValue('priority', p.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${watchPriority === p.id ? `bg-white/10 ${p.color} ring-2 ring-current` : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}
                          >
                            <span className="text-xs font-semibold">{p.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                        <Folder size={14} /> Category
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {['Work', 'Personal', 'Health', 'Finance'].map((cat) => (
                          <div
                            key={cat}
                            onClick={() => setValue('category', cat)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all text-center ${watchCategory === cat ? 'bg-primary/20 border-primary text-primary font-semibold ring-2 ring-primary/30' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}
                          >
                            <span className="text-xs">{cat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification Type & Repeat */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                          <BellRing size={14} /> Alert Type
                        </label>
                        <select 
                          {...register('notifyType')} 
                          className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-transparent"
                        >
                          <option value="push" className="bg-background text-foreground">Push Notification</option>
                          <option value="email" className="bg-background text-foreground">Email Alert</option>
                          <option value="sms" className="bg-background text-foreground">SMS Message</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                          <Repeat size={14} /> Repeat
                        </label>
                        <select 
                          {...register('repeat')} 
                          className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-transparent"
                        >
                          <option value="none" className="bg-background text-foreground">No Repeat</option>
                          <option value="daily" className="bg-background text-foreground">Daily</option>
                          <option value="weekly" className="bg-background text-foreground">Weekly</option>
                          <option value="monthly" className="bg-background text-foreground">Monthly</option>
                        </select>
                      </div>
                    </div>

                    {/* Tags Input */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                        <Tag size={14} /> Tags (Press Enter)
                      </label>
                      <div className="p-3 rounded-2xl glass-input flex flex-wrap items-center gap-2">
                        {tags.map((t, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-xl bg-primary/20 text-primary text-xs font-medium flex items-center gap-1.5 border border-primary/30">
                            {t}
                            <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeTag(t)} />
                          </span>
                        ))}
                        <input 
                          type="text" 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder={tags.length === 0 ? "Add tag..." : ""}
                          className="bg-transparent text-foreground placeholder:text-muted-foreground text-xs focus:outline-none flex-1 min-w-[100px]"
                        />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground font-semibold flex items-center gap-2 transition-all"
                      >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
                      >
                        <Check size={18} />
                        <span>Create Reminder</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
