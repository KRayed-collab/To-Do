import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Calendar, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon"></div>
        <h2>To-Do</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={20} />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          <span>Calendar</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? (
            <><Moon size={20} /><span>Dark Mode</span></>
          ) : (
            <><Sun size={20} /><span>Light Mode</span></>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
