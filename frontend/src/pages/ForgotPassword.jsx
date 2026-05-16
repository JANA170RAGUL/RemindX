import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Recovery link sent!', {
        description: `Password reset instructions dispatched to ${data.email}`
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex select-none bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-bl from-slate-950 via-indigo-950 to-purple-950 p-16 flex-col justify-between border-r border-white/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-6">
          <img 
            src="/logo.jpg" 
            alt="RemindX Logo" 
            className="w-36 h-36 rounded-3xl object-cover shadow-2xl shadow-primary/50 border-2 border-primary/50" 
          />
          <span className="font-extrabold text-6xl tracking-wider text-white drop-shadow-md">RemindX</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary">
            <KeyRound size={28} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Secure password recovery.
          </h1>
          <p className="text-slate-300 text-lg">
            Our autonomous security system ensures your enterprise workspace remains fully protected while assisting you with swift account recovery.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>© 2026 RemindX Inc.</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
          className="w-full max-w-md p-8 lg:p-10 rounded-3xl glass-card border border-white/20 shadow-2xl relative z-10 flex flex-col gap-8"
        >
          {isSubmitted ? (
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center ring-4 ring-primary/10 mb-4">
                <Mail size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                We've sent password reset instructions to your registered corporate email address.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline pt-4">
                <ArrowLeft size={16} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Form Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password?</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your registered work email and we'll send you instructions to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <Mail size={14} /> Registered Email
                  </label>
                  <input 
                    type="email" 
                    {...register('email', { required: 'Email is required' })}
                    placeholder="alexander@remindx.ai"
                    className="w-full h-12 px-4 rounded-2xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  {errors.email && <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={isLoading}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary via-accent to-pink-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 transition-all"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Send Reset Link</span><ArrowRight size={18} /></>}
                </motion.button>
              </form>

              {/* Footer Link */}
              <div className="text-center text-xs text-muted-foreground">
                <span>Remember your password? </span>
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
