// src/components/TasksByTagTab.js

import React, { useState, useEffect } from 'react';
// import { fetchTasks } from '../services/api'; // Use this after API is connected

function TasksByTagTab({ tasks }) {
  //const [tasks, setTasks] = useState([]);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All'); 
// --- Tag Filtering Logic ---
  const getAllUniqueTags = () => {
    const tags = new Set(['All']);
    // Uses the 'tasks' prop
    tasks.forEach(task => { 
      task.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };
  
  const filteredTasks = tasks.filter(task => {
    if (selectedTag === 'All') {
      return true;
    }
    // Filter tasks that include the selected tag
    return task.tags.includes(selectedTag);
  });
  
  const handleTagClick = (tag) => {
      setSelectedTag(tag);
  };
  
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
    // No need for loading or error checks, as HomePage handles it!
    if (tasks.length === 0) return <div className="alert alert-info mt-3">No tasks have been created yet.</div>;
    
    if (filteredTasks.length === 0) return <div className="alert alert-warning mt-3">No tasks found for tag: **{selectedTag}**.</div>;

    return (
      <ul className="list-group mt-3">
        {filteredTasks.map(task => (
          <li 
            key={task._id} 
            className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`}
          >
            <div>
              <input type="checkbox" checked={task.completed} className="me-2" readOnly />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
              <small className="ms-3 text-muted">({task.date})</small>
            </div>
            <div className="small">
                {task.tags.map(tag => (
                    <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                ))}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Tasks by Tag</h2>
      <p className="small text-muted">Click a tag to filter tasks, or select "All".</p>
      
      {renderTags()}
      
      {renderTaskList()}
      
    </div>
  );
}
export default TasksByTagTab;