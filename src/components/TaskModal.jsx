import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X } from 'lucide-react';

const TaskModal = ({ onClose, taskToEdit }) => {
  const { addTask, updateTask } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
         title: taskToEdit.title,
         description: taskToEdit.description,
         priority: taskToEdit.priority,
         dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      });
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
    } else {
      addTask(formData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel modal-content" style={{ width: '400px', backgroundColor: 'var(--card-bg)', padding: '2rem' }}>
        <div className="flex justify-between items-center mb-4">
          <h2>{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-muted hover:text-danger"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Title</label>
            <input 
              required
              className="input-field"
              type="text"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="E.g., Design Landing Page"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea 
              className="input-field"
              rows={3}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Add more details..."
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="input-group" style={{flex: 1}}>
              <label className="input-label">Priority</label>
              <select 
                className="input-field" 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="input-group" style={{flex: 1}}>
              <label className="input-label">Due Date</label>
              <input 
                required
                className="input-field"
                type="date"
                value={formData.dueDate} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{taskToEdit ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
