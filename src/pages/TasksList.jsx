import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Trash2, Edit2, Calendar } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import './TasksList.css';

const TasksList = () => {
  const { tasks, reorderTasks, deleteTask, updateTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      // Moving between status columns
      const sourceList = tasks.filter(t => t.status === source.droppableId);
      const destList = tasks.filter(t => t.status === destination.droppableId);
      const otherTasks = tasks.filter(t => t.status !== source.droppableId && t.status !== destination.droppableId);

      const [moved] = sourceList.splice(source.index, 1);
      moved.status = destination.droppableId;
      destList.splice(destination.index, 0, moved);

      reorderTasks([...sourceList, ...destList, ...otherTasks]);
    } else {
      // Reording within same column
      const columnTasks = tasks.filter(t => t.status === source.droppableId);
      const otherTasks = tasks.filter(t => t.status !== source.droppableId);

      const [moved] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, moved);

      reorderTasks([...columnTasks, ...otherTasks]);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'Pending' && t.title.toLowerCase().includes(filterQuery.toLowerCase()));
  const completedTasks = tasks.filter(t => t.status === 'Completed' && t.title.toLowerCase().includes(filterQuery.toLowerCase()));

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    if(priority === 'High') return 'var(--danger-color)';
    if(priority === 'Medium') return 'var(--warning-color)';
    return 'var(--accent-color)';
  };

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`glass-panel task-card ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div className="task-drag-handle" {...provided.dragHandleProps}>
            <GripVertical size={16} className="text-muted" />
          </div>
          <div className="task-card-content">
            <div className="flex justify-between items-center mb-4">
              <span className="task-priority badge text-xs" style={{backgroundColor: `${getPriorityColor(task.priority)}20`, color: getPriorityColor(task.priority)}}>
                {task.priority}
              </span>
              <div className="task-actions flex items-center gap-2">
                 <button onClick={() => handleEdit(task)} className="text-muted hover:text-accent"><Edit2 size={16}/></button>
                 <button onClick={() => deleteTask(task.id)} className="text-muted hover:text-danger"><Trash2 size={16}/></button>
              </div>
            </div>
            <h4 className="mb-2">{task.title}</h4>
            <p className="task-desc text-sm text-muted mb-4">{task.description}</p>
            <div className="task-footer flex justify-between items-center">
               <span className="task-date text-xs text-muted flex items-center gap-2">
                 <Calendar size={14}/> {new Date(task.dueDate).toLocaleDateString()}
               </span>
               <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.status === 'Completed'}
                  onChange={(e) => updateTask(task.id, { status: e.target.checked ? 'Completed' : 'Pending' })}
               />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="tasks-container">
      <header className="page-header flex justify-between items-center">
        <div>
          <h1>Your Tasks</h1>
          <p className="text-muted">Manage, drag, and drop your tasks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
          <Plus size={18} /> New Task
        </button>
      </header>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="input-field" 
          style={{width: '300px'}}
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {/* Pending Column */}
          <Droppable droppableId="Pending">
            {(provided) => (
              <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                <h3 className="kanban-header">Pending ({pendingTasks.length})</h3>
                <div className="kanban-list">
                  {pendingTasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} />)}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* Completed Column */}
          <Droppable droppableId="Completed">
            {(provided) => (
              <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                 <h3 className="kanban-header">Completed ({completedTasks.length})</h3>
                 <div className="kanban-list">
                  {completedTasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} />)}
                  {provided.placeholder}
                 </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal 
          onClose={() => setIsModalOpen(false)} 
          taskToEdit={editingTask} 
        />
      )}
    </div>
  );
};

export default TasksList;
