import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  Link2, 
  Check, 
  User, 
  Smartphone, 
  Mail, 
  ShieldCheck,
  Camera 
} from 'lucide-react';

export default function Settings() {
  const { user, updateUserProfile, uploadAvatar, theme, setTheme } = useStore();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'notifications' | 'security' | 'integrations'
  
  // Local state for forms
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'America/Los_Angeles (PST)');
  
  // Notification preferences state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [aiDigest, setAiDigest] = useState(true);

  // Connected apps state
  const [connectedApps, setConnectedApps] = useState(user?.connectedApps || ['Google Calendar', 'Slack', 'Linear', 'Github']);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({ name: profileName, email: profileEmail, timezone });
    toast.success('Profile Settings Saved', { description: 'Your enterprise preferences have been updated.' });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    toast.success('Password Updated Successfully', { description: 'Your encryption keys have been regenerated.' });
    e.target.reset();
  };

  const toggleAppConnection = (appName) => {
    if (connectedApps.includes(appName)) {
      setConnectedApps(connectedApps.filter(a => a !== appName));
      toast.warning(`Disconnected ${appName}`);
    } else {
      setConnectedApps([...connectedApps, appName]);
      toast.success(`Connected ${appName} successfully`);
    }
  };

  return (
    <div className="p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Platform Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your autonomous workspace, integrations, and security controls</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl glass-card border border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-500 shadow-md">
            <ShieldCheck size={16} />
            <span>SOC2 Type II Compliant</span>
          </div>
        </div>
      </div>

      {/* Settings Navigation & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <div className="rounded-3xl glass-card border border-white/20 p-4 space-y-2 shadow-xl sticky top-28">
          {[
            { id: 'general', label: 'General & Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Keys', icon: Lock },
            { id: 'integrations', label: 'Connected Apps', icon: Link2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              {/* Profile Settings Card */}
              <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Profile Information</h3>
                  <p className="text-xs text-muted-foreground">Update your identity and corporate contact details</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="flex items-center gap-6 pb-6 border-b border-border/40">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-primary/40 shadow-xl relative group shrink-0 bg-white/5 flex items-center justify-center text-muted-foreground">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user?.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} />
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-white">
                        <Camera size={18} />
                        <span className="text-[10px] font-bold">Change</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange} 
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Profile Picture</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Upload a high-res image (PNG, JPG up to 5MB). Click avatar to browse.</p>
                      <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-foreground cursor-pointer transition-all shadow-md">
                        <Camera size={14} className="text-primary" />
                        <span>Upload New Picture</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Work Email</label>
                      <input 
                        type="email" 
                        value={profileEmail} 
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Timezone Selector */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <Globe size={14} /> Timezone Preference
                    </label>
                    <select 
                      value={timezone} 
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-transparent"
                    >
                      <option value="America/Los_Angeles (PST)" className="bg-background text-foreground">Pacific Time (US & Canada) - PST</option>
                      <option value="America/New_York (EST)" className="bg-background text-foreground">Eastern Time (US & Canada) - EST</option>
                      <option value="Europe/London (GMT)" className="bg-background text-foreground">London (GMT)</option>
                      <option value="Asia/Tokyo (JST)" className="bg-background text-foreground">Tokyo (JST)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
                      <Check size={16} />
                      <span>Save Changes</span>
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Theme Settings Card */}
              <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Appearance & Theming</h3>
                  <p className="text-xs text-muted-foreground">Customize the visual aesthetics of your dashboard</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'dark', label: 'Dark Mode (Linear/Notion style)', icon: Moon, desc: 'Deep sleek obsidian appearance' },
                    { id: 'light', label: 'Light Mode (Clean SaaS style)', icon: Sun, desc: 'Bright vibrant daylight view' },
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 ${theme === t.id ? 'bg-primary/20 border-primary ring-2 ring-primary/30' : 'border-white/10 hover:bg-white/5'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-foreground">
                            <Icon size={20} />
                          </div>
                          {theme === t.id && <span className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse" />}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-foreground block">{t.label}</span>
                          <span className="text-xs text-muted-foreground mt-0.5 block">{t.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Notification Channels</h3>
                  <p className="text-xs text-muted-foreground">Configure how autonomous alerts reach your devices</p>
                </div>

                <div className="space-y-6 divide-y divide-border/40">
                  {[
                    { title: 'Email Notifications', desc: 'Receive daily schedules and missed reminder alerts via email', state: emailAlerts, setState: setEmailAlerts, icon: Mail },
                    { title: 'Mobile Push Alerts', desc: 'Instant high-priority popups on iOS and Android devices', state: pushAlerts, setState: setPushAlerts, icon: Smartphone },
                    { title: 'SMS Text Messaging', desc: 'Fallback text alerts for urgent reminders when offline', state: smsAlerts, setState: setSmsAlerts, icon: Bell },
                    { title: 'AI Smart Daily Digest', desc: 'Autonomous morning summary of predictive recommendations', state: aiDigest, setState: setAiDigest, icon: SettingsIcon },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="pt-6 first:pt-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 pr-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground shrink-0">
                            <Icon size={20} />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-foreground block">{item.title}</span>
                            <span className="text-xs text-muted-foreground mt-0.5 block">{item.desc}</span>
                          </div>
                        </div>

                        {/* Custom Toggle Switch */}
                        <div 
                          onClick={() => {
                            item.setState(!item.state);
                            toast.info(`${item.title} ${!item.state ? 'Enabled' : 'Disabled'}`);
                          }}
                          className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer shrink-0 ${item.state ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-white/10 border border-white/10'}`}
                        >
                          <motion.div 
                            layout
                            animate={{ x: item.state ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-6 h-6 rounded-full bg-white shadow-md"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Password & Encryption</h3>
                  <p className="text-xs text-muted-foreground">Update your corporate login credentials and API secret keys</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Current Password</label>
                    <input type="password" required placeholder="••••••••••••" className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">New Password</label>
                    <input type="password" required placeholder="••••••••••••" className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Confirm New Password</label>
                    <input type="password" required placeholder="••••••••••••" className="w-full h-12 px-4 rounded-2xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
                      <Lock size={16} />
                      <span>Update Password</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="rounded-3xl glass-card border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Connected Applications</h3>
                  <p className="text-xs text-muted-foreground">Sync reminders autonomously across your entire productivity stack</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Google Calendar', desc: 'Two-way real-time calendar sync', icon: '📅' },
                    { name: 'Linear', desc: 'Sync engineering issues and sprint tasks', icon: '🔺' },
                    { name: 'Notion', desc: 'Embed smart reminder widgets in workspace pages', icon: '📝' },
                    { name: 'Slack', desc: 'Autonomous direct message alerts and digests', icon: '💬' },
                    { name: 'GitHub', desc: 'PR review reminders and deployment countdowns', icon: '🐙' },
                    { name: 'Todoist', desc: 'Import existing project lists seamlessly', icon: '✅' },
                  ].map((app) => {
                    const isConnected = connectedApps.includes(app.name);
                    return (
                      <div key={app.name} className={`p-6 rounded-3xl border transition-all flex flex-col justify-between gap-6 ${isConnected ? 'bg-white/10 border-white/20 shadow-xl' : 'bg-white/5 border-white/5 opacity-70'}`}>
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-md">
                            {app.icon}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${isConnected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-white/5 text-muted-foreground border-white/10'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-foreground">{app.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{app.desc}</p>
                        </div>
                        <button
                          onClick={() => toggleAppConnection(app.name)}
                          className={`w-full h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${isConnected ? 'bg-white/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40'}`}
                        >
                          {isConnected ? 'Disconnect Integration' : 'Connect Application'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
