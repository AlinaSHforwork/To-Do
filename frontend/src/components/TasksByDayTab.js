// src/components/TasksByDayTab.js

import React, { useState, useEffect } from 'react';
import { fetchTasks, addTask } from '../services/api';

function TasksByDayTab() {
  // State for the data
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskDate, setTaskDate] = useState(''); 
  const [taskTags, setTaskTags] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect Hook to run once when the component mounts to FETCH the initial tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []); 

  // Function to handle adding a new task
  const handleAddTask = async () => {
    if (!taskText.trim() || !taskDate) {
      setError('Task title and date are required.');
      return;
    }
    setError(null);

    const newTaskData = {
      title: taskText,
      dueDate: taskDate,
      // Convert comma-separated string to array
      tags: taskTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      const addedTask = await addTask(newTaskData);
      
      // Add the new task returned by the API to the local state
      setTasks(prevTasks => [...prevTasks, addedTask]); 
      
      // Clear the form fields
      setTaskText('');
      setTaskDate('');
      setTaskTags('');

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading Tasks...</div>;
  
  return (
    <div id="tab3">
      <h1>Tasks by Day</h1>
      
      {/* Input Container - Now using state handlers */}
      <div className="input-container d-flex align-items-center gap-2 mb-2">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Task title..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <input 
          type="date" 
          className="form-control" 
          style={{ maxWidth: '160px' }}
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <input 
          type="text" 
          className="form-control" 
          placeholder="tags (comma separated)" 
          style={{ maxWidth: '220px' }}
          value={taskTags}
          onChange={(e) => setTaskTags(e.target.value)}
        />
        <button onClick={handleAddTask} className="btn btn-primary">
          Add Task
        </button>
      </div>
      
      {error && <div className="alert alert-warning">{error}</div>}

      {/* Task List - Dynamic rendering using tasks state */}
      <ul id="taskList" className="list-unstyled">
        {tasks.length === 0 ? (
          <li className="text-muted">No tasks found. Add a new one!</li>
        ) : (
          tasks.map(task => (
            <li key={task._id || task.title} className="d-flex justify-content-between align-items-center border-bottom py-2">
              <span>{task.title}</span>
              <small className="text-muted">Due: {task.dueDate}</small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TasksByDayTab;