import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

base_dir = r"d:\automated notification\frontend"

use_store_content = """
import { create } from 'zustand';
import apiClient from '../api/axios';
import { toast } from 'sonner';

export const useStore = create((set, get) => ({
  // App settings
  theme: 'dark',
  sidebarCollapsed: false,
  
  // Auth state
  user: null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  authLoading: false,

  // Data state
  reminders: [],
  remindersLoading: false,
  remindersTotal: 0,
  
  notifications: [],
  
  // UI state
  activeModal: null, // null | 'createReminder' | 'aiQuickAdd'
  searchQuery: '',
  filterPriority: 'all',
  filterCategory: 'all',
  filterStatus: 'all',
  currentPage: 1,

  // --- Theme & UI Actions ---
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),

  setTheme: (theme) => set(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme };
  }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchReminders();
  },
  setFilterPriority: (priority) => {
    set({ filterPriority: priority, currentPage: 1 });
    get().fetchReminders();
  },
  setFilterCategory: (category) => {
    set({ filterCategory: category, currentPage: 1 });
    get().fetchReminders();
  },
  setFilterStatus: (status) => {
    set({ filterStatus: status, currentPage: 1 });
    get().fetchReminders();
  },
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchReminders();
  },

  // --- Auth Actions ---
  login: async (email, password) => {
    set({ authLoading: true });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token, user } = response.data.data;
      localStorage.setItem('auth_token', access_token);
      set({ isAuthenticated: true, user, authLoading: false });
      toast.success('Logged in successfully!');
      get().fetchReminders();
      return true;
    } catch (error) {
      set({ authLoading: false });
      return false;
    }
  },

  register: async (full_name, email, password) => {
    set({ authLoading: true });
    try {
      await apiClient.post('/auth/register', { full_name, email, password });
      toast.success('Registration successful. Please login.');
      set({ authLoading: false });
      return true;
    } catch (error) {
      set({ authLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ isAuthenticated: false, user: null, reminders: [] });
    toast.success('Logged out securely');
  },

  fetchMe: async () => {
    if (!localStorage.getItem('auth_token')) return;
    try {
      const response = await apiClient.get('/auth/me');
      set({ user: response.data.data, isAuthenticated: true });
      get().fetchReminders();
    } catch (error) {
      get().logout();
    }
  },

  // --- Reminder Actions ---
  fetchReminders: async () => {
    if (!get().isAuthenticated) return;
    set({ remindersLoading: true });
    try {
      const state = get();
      const params = {
        page: state.currentPage,
        limit: 10,
      };
      if (state.searchQuery) params.search = state.searchQuery;
      if (state.filterPriority !== 'all') params.filter_type = state.filterPriority === 'high' ? 'high_priority' : state.filterPriority;
      if (state.filterStatus !== 'all') params.filter_type = state.filterStatus;
      
      const response = await apiClient.get('/reminders', { params });
      
      // Transform backend data for frontend UI mapping
      const mappedReminders = response.data.data.data.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        date: r.reminder_date,
        time: String(r.reminder_time).slice(0, 5), // 'HH:MM:SS' -> 'HH:MM'
        priority: r.priority,
        category: r.category_id ? 'Categorized' : 'General', // Fallback until categories API is bound
        tags: r.tags || [],
        completed: r.status === 'completed',
        notifyType: 'push'
      }));

      set({ 
        reminders: mappedReminders, 
        remindersTotal: response.data.data.total,
        remindersLoading: false 
      });
    } catch (error) {
      set({ remindersLoading: false });
    }
  },

  addReminder: async (reminderData) => {
    try {
      const payload = {
        title: reminderData.title,
        description: reminderData.description,
        reminder_date: reminderData.date,
        reminder_time: reminderData.time + ':00',
        priority: reminderData.priority,
        repeat_type: 'one_time',
        tags: reminderData.tags || []
      };
      await apiClient.post('/reminders', payload);
      toast.success('Reminder created successfully');
      get().fetchReminders();
      return true;
    } catch (error) {
      return false;
    }
  },

  updateReminder: async (id, updatedData) => {
    try {
      const payload = {};
      if (updatedData.title) payload.title = updatedData.title;
      if (updatedData.description) payload.description = updatedData.description;
      if (updatedData.date) payload.reminder_date = updatedData.date;
      if (updatedData.time) payload.reminder_time = updatedData.time + ':00';
      if (updatedData.priority) payload.priority = updatedData.priority;
      
      await apiClient.put(`/reminders/${id}`, payload);
      toast.success('Reminder updated');
      get().fetchReminders();
    } catch (error) {}
  },

  deleteReminder: async (id) => {
    try {
      await apiClient.delete(`/reminders/${id}`);
      toast.success('Reminder deleted');
      get().fetchReminders();
    } catch (error) {}
  },

  toggleComplete: async (id) => {
    try {
      const reminder = get().reminders.find(r => r.id === id);
      if (!reminder) return;
      
      // Optimistic update
      set((state) => ({
        reminders: state.reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
      }));

      if (!reminder.completed) {
        await apiClient.patch(`/reminders/${id}/complete`);
        toast.success('Marked as completed!');
      } else {
        // Un-completing logic if the backend supports it. For now just refetch.
        get().fetchReminders(); 
      }
    } catch (error) {
      // Revert on error
      get().fetchReminders();
    }
  },

  // --- Notifications (Placeholder since it wasn't requested strictly yet) ---
  addNotification: (notification) => set((state) => ({
    notifications: [{ id: Date.now().toString(), time: 'Just now', read: false, ...notification }, ...state.notifications]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  }))
}));

// Setup global listener for 401 interceptor logout
window.addEventListener('auth:unauthorized', () => {
  useStore.getState().logout();
  toast.error('Session expired. Please login again.');
});
"""

create_file(os.path.join(base_dir, 'src/store/useStore.js'), use_store_content)
print("Store updated successfully!")
