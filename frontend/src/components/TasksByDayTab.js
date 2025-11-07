// src/components/TasksByDayTab.js

import React, { useState, useMemo } from 'react';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => new Date(date).toISOString().split('T')[0];

// Accept the props needed from HomePage
function TasksByDayTab({ tasks, onAddTask, onToggleComplete, onDeleteTask }) { 
    
    // State for Date Navigation
    const [currentDay, setCurrentDay] = useState(new Date()); 
    
    // States for new task inputs
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(formatDate(currentDay)); 
    const [newTaskTags, setNewTaskTags] = useState('');
    
    // State for showing success/error messages
    const [statusMessage, setStatusMessage] = useState({ type: null, text: '' }); 
    
    // --- Navigation Handlers ---
    const changeDay = (offset) => {
        setCurrentDay(prevDay => {
            const newDay = new Date(prevDay);
            newDay.setDate(newDay.getDate() + offset);
            setNewTaskDate(formatDate(newDay)); // Update date in input when day changes
            return newDay;
        });
    };

    // Helper to format the displayed date title
    const formattedCurrentDay = useMemo(() => {
        return currentDay.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }, [currentDay]);

    // --- Add Task Handler ---
    const handleAddClick = async (e) => {
        e.preventDefault();
        
        if (!newTaskText || !newTaskDate) {
            setStatusMessage({ type: 'error', text: 'Please fill in at least the task title and date.' });
            return;
        }

        // Convert tags from "tag1, tag2" to ["tag1", "tag2"]
        const tagsArray = newTaskTags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const taskData = {
            text: newTaskText,
            date: newTaskDate,
            tags: tagsArray,
            completed: false
        };

        const result = await onAddTask(taskData);
        
        if (result.success) {
            setStatusMessage({ type: 'success', text: 'Task added successfully!' });
            // Clear inputs
            setNewTaskText('');
            setNewTaskTags('');
            // Reset date input to the currently viewed day (in case it was changed)
            setNewTaskDate(formatDate(currentDay));
        } else {
            setStatusMessage({ type: 'error', text: `Failed to add task: ${result.message}` });
        }
        
        // Hide message after 3 seconds
        setTimeout(() => setStatusMessage({ type: null, text: '' }), 3000);
    };

    // --- *** НОВА ЧАСТИНА: Фільтрація та рендеринг завдань *** ---

    // 1. Filter tasks for the currently selected day
    const filteredTasks = useMemo(() => {
        const currentDayStr = formatDate(currentDay);
        return tasks.filter(task => task.date === currentDayStr);
    }, [tasks, currentDay]);

    // 2. Render the list of filtered tasks
    const renderTaskList = () => {
        if (filteredTasks.length === 0) {
            return <div className="alert alert-info mt-3">No tasks for this day.</div>;
        }

        return (
            <ul className="list-group mt-3">
                {filteredTasks.map(task => (
                    <li 
                        key={task._id} 
                        className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`}
                    >
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={task.completed}
                                onChange={() => onToggleComplete(task._id, !task.completed)}
                                id={`task-${task._id}`}
                            />
                            <label 
                                className="form-check-label" 
                                htmlFor={`task-${task._id}`}
                                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                            >
                                {task.text}
                            </label>
                        </div>
                        
                        <div>
                            {/* Show tags */}
                            {task.tags && task.tags.map(tag => (
                                <span key={tag} className="badge bg-secondary me-2">{tag}</span>
                            ))}
                            
                            {/* Delete Button */}
                            <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => onDeleteTask(task._id)}
                            >
                                &times; {/* 'x' symbol */}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    // --- Main Component Render ---
   return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={() => changeDay(-1)} className="btn btn-outline-secondary">&lt; Prev Day</button>
                <h3 className="mb-0 micro-5-regular">{formattedCurrentDay}</h3>
                <button onClick={() => changeDay(1)} className="btn btn-outline-secondary">Next Day &gt;</button>
            </div>

            {renderTaskList()}

            <form onSubmit={handleAddClick} className="task-form-card">
                <h4 className="micro-5-regular mb-3">Add a New Task</h4>
            
                {statusMessage.type === 'error' && <div className="alert alert-danger">{statusMessage.text}</div>}
                {statusMessage.type === 'success' && <div className="alert alert-success">{statusMessage.text}</div>}

                <div className="input-group mb-2">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Task title..." 
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        required 
                    />
                </div>
                <div className="input-group mb-2">
                     <span className="input-group-text">Date</span>
                    <input 
                        type="date" 
                        className="form-control" 
                        value={newTaskDate}
                        onChange={(e) => setNewTaskDate(e.target.value)}
                        required 
                    />
                     <span className="input-group-text">Tags</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Tags (comma separated)" 
                        value={newTaskTags}
                        onChange={(e) => setNewTaskTags(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Add Task</button>
            </form>
            
        </div>
    );
}

export default TasksByDayTab;