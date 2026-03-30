import React from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasks } from '../context/TaskContext';
import './CalendarView.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const { tasks } = useTasks();

  const events = tasks.map((task) => {
    // Ensuring date object is robust
    const date = new Date(task.dueDate);
    date.setHours(12, 0, 0, 0); // Put exactly at midday to avoid zone shift
    return {
      title: task.title,
      start: date,
      end: date,
      allDay: true,
      resource: task
    };
  });

  const eventStyleGetter = (event) => {
    let backgroundColor = 'var(--accent-color)';
    if (event.resource.status === 'Completed') backgroundColor = 'var(--success-color)';
    if (event.resource.priority === 'High' && event.resource.status !== 'Completed') backgroundColor = 'var(--danger-color)';

    var style = {
      backgroundColor: backgroundColor,
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style: style };
  };

  return (
    <div className="calendar-container">
      <header className="page-header">
        <h1>Calendar Schedule</h1>
        <p className="text-muted">View your tasks across the month.</p>
      </header>
      
      <div className="glass-panel calendar-wrapper">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: '600px' }}
          views={['month', 'week', 'day']}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default CalendarView;
