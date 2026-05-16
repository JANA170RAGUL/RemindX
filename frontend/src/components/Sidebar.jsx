import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Bell, 
  BarChart3, 
  Settings as SettingsIcon, 
  User, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, user, logout } = useStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Create Workspace', path: '/create', icon: Sparkles },
    { name: 'Reminders', path: '/reminders', icon: CheckSquare },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const authItems = [
    { name: 'Login', path: '/login', icon: LogIn },
    { name: 'Sign Up', path: '/signup', icon: UserPlus },
    { name: 'Forgot Password', path: '/forgot-password', icon: KeyRound },
  ];

  return (
    <motion.aside 
      animate={{ width: sidebarCollapsed ? 120 : 360 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-screen fixed left-0 top-0 flex flex-col justify-between bg-[#0f172a]/95 dark:bg-[#111827]/95 backdrop-blur-2xl border-r border-[#ff4fd8]/30 shadow-[0_0_35px_rgba(0,229,255,0.15)] z-40 select-none overflow-hidden"
    >
      {/* Subtle Cyberpunk Background Gradients & Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#ff4fd8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Logo & Floating Toggle Button */}
      <div className="p-4 flex items-center justify-between border-b border-[#00e5ff]/20 relative z-10 bg-slate-900/40 backdrop-blur-md gap-2">
        <div className="flex items-center gap-4 overflow-hidden">
          <img 
            src="/logo.jpg" 
            alt="RemindX Logo" 
            className={`rounded-3xl object-cover shadow-[0_0_30px_rgba(0,229,255,0.6)] shrink-0 border-2 border-[#00e5ff]/50 transition-all duration-300 ${sidebarCollapsed ? 'w-20 h-20' : 'w-24 h-24'}`}
          />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col whitespace-nowrap overflow-hidden py-2"
              >
                <span className="font-extrabold text-4xl tracking-wider bg-gradient-to-r from-[#00e5ff] via-[#ff4fd8] to-[#7c3aed] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  RemindX
                </span>
                <span className="text-xs text-[#00e5ff] uppercase tracking-widest font-extrabold shadow-sm mt-1">
                  CYBER AI // 2026
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Cyberpunk Toggle Button */}
        <motion.button 
          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0,229,255,0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="w-10 h-10 rounded-xl bg-[#1e293b] border border-[#00e5ff]/50 flex items-center justify-center text-[#00e5ff] hover:bg-[#00e5ff]/20 hover:text-white transition-all shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.2)] cursor-pointer z-20"
        >
          {sidebarCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </motion.button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 relative z-10 scrollbar-none">
        {/* Main Menu */}
        <div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="px-3 mb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#ff4fd8] drop-shadow-[0_0_8px_rgba(255,79,216,0.3)] whitespace-nowrap overflow-hidden"
              >
                System Core
              </motion.div>
            )}
          </AnimatePresence>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative group cursor-pointer
                    ${isActive 
                      ? 'text-white bg-gradient-to-r from-[#7c3aed]/50 via-[#ff4fd8]/50 to-[#00e5ff]/50 border border-[#00e5ff] shadow-[0_0_25px_rgba(0,229,255,0.4)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#ff4fd8]/40 hover:shadow-[0_0_15px_rgba(255,79,216,0.2)]'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon Container */}
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#00e5ff]">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : ''}`} />
                      </div>

                      {/* Animated Label */}
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 whitespace-nowrap overflow-hidden font-mono tracking-wide"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active Glowing Neon Bar */}
                      {isActive && !sidebarCollapsed && (
                        <motion.div 
                          layoutId="activeNeonIndicator"
                          className="absolute right-2 w-1.5 h-6 bg-[#00e5ff] rounded-full shadow-[0_0_10px_#00e5ff]"
                        />
                      )}

                      {/* Collapsed Hover Tooltip */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-900 border border-[#00e5ff]/50 text-[#00e5ff] text-xs font-mono font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-[0_0_15px_rgba(0,229,255,0.3)] z-50 whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4fd8] animate-pulse" />
                          <span>{item.name}</span>
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Auth Previews */}
        <div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="px-3 mb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] whitespace-nowrap overflow-hidden"
              >
                Access Terminals
              </motion.div>
            )}
          </AnimatePresence>
          <nav className="space-y-2">
            {authItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative group cursor-pointer
                    ${isActive 
                      ? 'text-white bg-gradient-to-r from-[#7c3aed]/50 via-[#ff4fd8]/50 to-[#00e5ff]/50 border border-[#00e5ff] shadow-[0_0_25px_rgba(0,229,255,0.4)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#ff4fd8]/40 hover:shadow-[0_0_15px_rgba(255,79,216,0.2)]'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#ff4fd8]">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : ''}`} />
                      </div>

                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 whitespace-nowrap overflow-hidden font-mono tracking-wide"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-900 border border-[#ff4fd8]/50 text-[#ff4fd8] text-xs font-mono font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-[0_0_15px_rgba(255,79,216,0.3)] z-50 whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                          <span>{item.name}</span>
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Card / Fixed Bottom Section */}
      <div className="p-4 border-t border-[#00e5ff]/20 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3 p-2.5 rounded-2xl bg-[#1e293b]/60 border border-[#ff4fd8]/30 shadow-[0_0_15px_rgba(255,79,216,0.15)] group hover:border-[#00e5ff]/50 transition-all`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <img 
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'} 
                alt={user?.full_name} 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00e5ff] rounded-full ring-2 ring-slate-900 animate-pulse shadow-[0_0_8px_#00e5ff]" />
            </div>

            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col overflow-hidden whitespace-nowrap"
                >
                  <span className="text-xs font-extrabold text-white truncate font-mono tracking-wide">{user?.full_name || 'Executive'}</span>
                  <span className="text-[10px] text-[#ff4fd8] font-bold truncate tracking-wider">{user?.plan || 'Enterprise Pro'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                onClick={logout}
                title="Disconnect Terminal (Logout)"
                className="p-2 rounded-xl text-slate-400 hover:text-[#ff4fd8] hover:bg-[#ff4fd8]/10 border border-transparent hover:border-[#ff4fd8]/30 transition-all shrink-0 shadow-sm cursor-pointer"
              >
                <LogOut size={18} className="drop-shadow-[0_0_5px_rgba(255,79,216,0.5)]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
