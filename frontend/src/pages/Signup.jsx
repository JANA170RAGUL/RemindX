import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const success = await registerUser(data.name, data.email, data.password);
    setIsLoading(false);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex select-none bg-background">
      {/* Left Panel / Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 p-16 flex-col justify-between border-r border-white/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-6">
          <img 
            src="/logo.jpg" 
            alt="RemindX Logo" 
            className="w-36 h-36 rounded-3xl object-cover shadow-2xl shadow-primary/50 border-2 border-primary/50" 
          />
          <span className="font-extrabold text-6xl tracking-wider text-white drop-shadow-md">RemindX</span>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white"
          >
            <Sparkles size={14} className="text-accent animate-spin" />
            <span>Join 10,000+ Silicon Valley Executives</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
          >
            Supercharge your workflow with autonomous reminders.
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
            {[
              'Predictive AI scheduling based on your energy levels',
              'Unified sync with Google Calendar, Linear, and Notion',
              'Advanced natural language parsing and voice commands',
              'Enterprise-grade SOC2 Type II security & encryption'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>© 2026 RemindX Inc.</span>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Right Panel / Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
          className="w-full max-w-md p-8 lg:p-10 rounded-3xl glass-card border border-white/20 shadow-2xl relative z-10 flex flex-col gap-8"
        >
          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h2>
            <p className="text-sm text-muted-foreground">
              Start your 14-day Enterprise AI Pro trial. No credit card required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input 
                type="text" 
                {...register('name', { required: 'Name is required' })}
                placeholder="Alexander Wright"
                className="w-full h-12 px-4 rounded-2xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <Mail size={14} /> Work Email
              </label>
              <input 
                type="email" 
                {...register('email', { required: 'Email is required' })}
                placeholder="alexander@antigravity.ai"
                className="w-full h-12 px-4 rounded-2xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {errors.email && <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-4 pr-12 rounded-2xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-rose-500 mt-1 block">{errors.password.message}</span>}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required defaultChecked className="mt-1 w-4 h-4 rounded bg-white/10 border-white/20 text-primary focus:ring-primary/50" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the Antigravity <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>.
              </span>
            </label>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary via-accent to-pink-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 transition-all"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Start 14-Day Free Trial</span><ArrowRight size={18} /></>}
            </motion.button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-muted-foreground">
            <span>Already have an account? </span>
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
