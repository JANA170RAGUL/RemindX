import { useStore } from '../store/useStore';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Sparkles, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  const { reminders, openModal, updateReminder } = useStore();

  // Map reminders to FullCalendar event objects
  const events = reminders.map((r) => {
    let backgroundColor = 'hsl(var(--primary))';
    let borderColor = 'hsl(var(--primary))';

    if (r.category === 'Personal') {
      backgroundColor = '#a855f7'; // purple
      borderColor = '#a855f7';
    } else if (r.category === 'Health') {
      backgroundColor = '#10b981'; // emerald
      borderColor = '#10b981';
    } else if (r.category === 'Finance') {
      backgroundColor = '#f59e0b'; // amber
      borderColor = '#f59e0b';
    }

    if (r.completed) {
      backgroundColor = 'rgba(150, 150, 150, 0.2)';
      borderColor = 'rgba(150, 150, 150, 0.3)';
    }

    return {
      id: r.id,
      title: `${r.priority === 'high' ? '🔥 ' : ''}${r.title}`,
      start: `${r.date}T${r.time}:00`,
      allDay: false,
      backgroundColor,
      borderColor,
      textColor: '#ffffff',
      extendedProps: {
        description: r.description,
        priority: r.priority,
        category: r.category,
        completed: r.completed
      }
    };
  });

  const handleEventClick = (clickInfo) => {
    const { title, extendedProps } = clickInfo.event;
    toast.info(title, {
      description: `${extendedProps.category} • ${extendedProps.description || 'No description provided'}`
    });
  };

  const handleDateSelect = (selectInfo) => {
    openModal('createReminder');
    toast.info('Scheduling for selected time block', {
      description: selectInfo.startStr.split('T')[0]
    });
  };

  const handleEventDrop = (dropInfo) => {
    const updatedDate = dropInfo.event.startStr.split('T')[0];
    const updatedTime = dropInfo.event.startStr.split('T')[1]?.substring(0, 5) || '12:00';
    
    updateReminder(dropInfo.event.id, { date: updatedDate, time: updatedTime });
    toast.success('Schedule Updated', {
      description: `Moved "${dropInfo.event.title}" to ${updatedDate} at ${updatedTime}`
    });
  };

  return (
    <div className="p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Calendar Workspace</h1>
          <p className="text-sm text-muted-foreground">Inspired by Cron & Motion • Autonomous drag-and-drop time blocks</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => openModal('aiQuickAdd')}
            className="h-12 px-5 rounded-2xl bg-accent/10 border border-accent/30 text-accent font-semibold text-sm flex items-center gap-2 shadow-lg glow-primary transition-all"
          >
            <Sparkles size={18} className="animate-pulse" />
            <span>AI Time Block</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => openModal('createReminder')}
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-primary via-accent to-pink-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            <Plus size={18} />
            <span>Create Event</span>
          </motion.button>
        </div>
      </div>

      {/* Main Calendar View */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="p-6 rounded-3xl glass-card border border-white/20 shadow-2xl overflow-hidden bg-white/5 dark:bg-white/2"
      >
        <div className="min-h-[700px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            eventClick={handleEventClick}
            select={handleDateSelect}
            eventDrop={handleEventDrop}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="23:00:00"
            eventClassNames="rounded-xl p-1 shadow-md font-medium text-xs border-none cursor-pointer hover:opacity-90 transition-opacity"
          />
        </div>
      </motion.div>
    </div>
  );
}
