import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { Download, Upload } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { tasks, reorderTasks } = useTasks();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "todo-data-backup.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedTasks = JSON.parse(event.target.result);
          if (Array.isArray(importedTasks)) {
            reorderTasks(importedTasks);
            alert('Tasks imported successfully!');
          }
        } catch (error) {
           alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
      e.target.value = null; // reset
    }
  };

  return (
    <div>
      <header className="page-header mb-4">
        <h1>Settings</h1>
        <p className="text-muted">Customize your workspace and manage your data.</p>
      </header>

      <div className="flex-col gap-4" style={{maxWidth: '600px'}}>
        <div className="glass-panel" style={{padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h3>Appearance</h3>
            <p className="text-sm text-muted">Switch between dark and light mode.</p>
          </div>
          <button className="btn btn-secondary" onClick={toggleTheme}>
             {theme === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
          </button>
        </div>

        <div className="glass-panel" style={{padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
             <h3>Export Data</h3>
             <p className="text-sm text-muted">Download your tasks as a JSON file.</p>
          </div>
          <button className="btn btn-primary" onClick={handleExport}>
             <Download size={18}/> Export JSON
          </button>
        </div>

        <div className="glass-panel" style={{padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h3>Import Data</h3>
            <p className="text-sm text-muted">Restore tasks from a JSON backup.</p>
          </div>
          <label className="btn btn-secondary" style={{cursor: 'pointer'}}>
             <Upload size={18}/> Import JSON
             <input type="file" accept=".json" onChange={handleImport} style={{display: 'none'}} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
