// src/components/TasksByTagTab.js

import React, { useState } from 'react';

// Приймаємо нові props
function TasksByTagTab({ tasks, onToggleComplete, onDeleteTask }) {

  const [selectedTag, setSelectedTag] = useState('All'); 
  
  // --- Tag Filtering Logic ---
  const getAllUniqueTags = () => {
    const tags = new Set(['All']);
    tasks.forEach(task => { 
      // Переконайтеся, що task.tags існує, перш ніж ітерувати
      if (task.tags) {
        task.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  };
  
  const filteredTasks = tasks.filter(task => {
    if (selectedTag === 'All') {
      return true;
    }
    // Переконайтеся, що task.tags існує
    return task.tags && task.tags.includes(selectedTag);
  });
  
  const handleTagClick = (tag) => {
      setSelectedTag(tag);
  };
  
  // --- Render Functions ---
  
  const renderTags = () => (
    <div id="tagFilterList" className="mb-2 d-flex flex-wrap gap-2">
      {getAllUniqueTags().map(tag => (
        <button
          key={tag}
          className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );

  const renderTaskList = () => {
    if (tasks.length === 0) return <div className="alert alert-info mt-3">No tasks have been created yet.</div>;
    
    if (filteredTasks.length === 0 && selectedTag !== 'All') return <div className="alert alert-warning mt-3">No tasks found for tag: "{selectedTag}".</div>;

    const tasksToDisplay = selectedTag === 'All' ? tasks : filteredTasks;

    return (
      <ul className="list-group mt-3">
        {tasksToDisplay.map(task => (
          <li 
            key={task._id} 
            className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`}
          >
            <div className="form-check flex-grow-1 me-3">
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={task.completed}
                    // *** ВИПРАВЛЕННЯ: Додаємо onChange ***
                    onChange={() => onToggleComplete(task._id, !task.completed)}
                    id={`task-tag-${task._id}`}
                />
                <label 
                    className="form-check-label" 
                    htmlFor={`task-tag-${task._id}`}
                    style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                >
                    {task.text}
                </label>
                <small className="ms-3 text-muted">({task.date})</small>
            </div>

            <div className="d-flex align-items-center">
                {/* Show tags */}
                {task.tags && task.tags.map(tag => (
                    <span key={tag} className="badge bg-secondary me-2">{tag}</span>
                ))}
                
                {/* *** НОВА КНОПКА: Видалення *** */}
                <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => onDeleteTask(task._id)}
                >
                    &times;
                </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h3 className='mb-3'>Tasks by Tag</h3>
      {renderTags()}
      {renderTaskList()}
    </div>
  );
}
export default TasksByTagTab;