import React from 'react';
import { useTasks } from '../context/TaskContext';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { tasks, stats } = useTasks();

  // Mock data for the productivity chart
  const data = [
    { name: 'Mon', tasks: 3 },
    { name: 'Tue', tasks: 5 },
    { name: 'Wed', tasks: 2 },
    { name: 'Thu', tasks: 8 },
    { name: 'Fri', tasks: 6 },
    { name: 'Sat', tasks: 1 },
    { name: 'Sun', tasks: 4 },
  ];

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Welcome Back</h1>
        <p className="text-muted">Here's a summary of your workspace today.</p>
      </header>

      <div className="widgets-grid">
        {/* Stat Widgets */}
        <div className="glass-panel stat-widget">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(35, 131, 226, 0.1)', color: 'var(--accent-color)' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>

        <div className="glass-panel stat-widget">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(43, 165, 140, 0.1)', color: 'var(--success-color)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3>Completed</h3>
            <p className="stat-number">{stats.completed}</p>
          </div>
        </div>

        <div className="glass-panel stat-widget">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(235, 87, 87, 0.1)', color: 'var(--danger-color)' }}>
            <Clock size={24} />
          </div>
          <div>
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
        </div>

        {/* Chart Widget */}
        <div className="glass-panel chart-widget">
          <h3>Productivity (Current Week)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: '8px'}}/>
                <Area type="monotone" dataKey="tasks" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks Widget */}
        <div className="glass-panel recent-widget">
          <h3>Recent Pending Tasks</h3>
          <ul className="recent-tasks-list">
            {tasks.filter(t => t.status !== 'Completed').slice(0, 4).map(task => (
              <li key={task.id} className="recent-task-item">
                <span className="task-bullet" style={{
                  backgroundColor: task.priority === 'High' ? 'var(--danger-color)' : task.priority === 'Medium' ? 'var(--warning-color)' : 'var(--accent-color)'
                }}></span>
                <div className="recent-task-info">
                  <h4>{task.title}</h4>
                  <span className="text-xs text-muted">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
            {tasks.filter(t => t.status !== 'Completed').length === 0 && (
              <p className="text-muted text-sm">You have no pending tasks! Great job.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
