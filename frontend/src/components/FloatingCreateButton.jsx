import { useStore } from '../store/useStore';
import { Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingCreateButton() {
  const { openModal } = useStore();

  return (
    <div className="fixed bottom-8 right-8 z-40 flex items-center gap-3 select-none">
      {/* AI Quick Add FAB */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openModal('aiQuickAdd')}
        title="AI Smart Add"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-2xl shadow-accent/40 border border-white/20 glow-primary cursor-pointer"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </motion.button>

      {/* Main Create FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openModal('createReminder')}
        title="Create Reminder"
        className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-2xl shadow-primary/40 border border-white/20 glow-primary cursor-pointer"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
