// src/components/TasksByDayTab.js (FINAL VERSION with Day Navigation)

import React, { useState } from 'react';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

function TasksByDayTab({ tasks, onAddTask }) { 
    // 1. STATE FOR DATE NAVIGATION
    const [currentDay, setCurrentDay] = useState(new Date()); // Tracks the day being viewed
    
    // States for new task inputs
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(formatDate(new Date())); // Default to today
    const [newTaskTags, setNewTaskTags] = useState('');
    
    // --- Navigation Handlers ---
    const changeDay = (offset) => {
        setCurrentDay(prevDay => {
            const newDay = new Date(prevDay);
            newDay.setDate(newDay.getDate() + offset);
            return newDay;
        });
    };

    // --- Task Creation Handler ---
    const handleAddClick = async (e) => {
        e.preventDefault();
        // Check if required fields are filled
        if (!newTaskText || !newTaskDate) return; 

        const tagsArray = newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        const newTask = {
            text: newTaskText,
            date: newTaskDate, // Ensure this is in YYYY-MM-DD format
            tags: tagsArray,
            completed: false
        };

        const success = await onAddTask(newTask); // Call the centralized function

        if (success) {
            // Clear the input fields on success
            setNewTaskText('');
            setNewTaskTags('');
            // Keep the newTaskDate as the currently viewed day's date for quick entry
        }
    };
    
    // --- Task Filtering ---
    const currentDayKey = formatDate(currentDay);
    const tasksForCurrentDay = tasks
        .filter(task => task.date === currentDayKey)
        .sort((a, b) => a.completed - b.completed); // Sort uncompleted tasks first

    // --- Date Label Formatting ---
    const dateLabel = currentDay.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });


    return (
        <div>
          {/* --- Add New Task Form --- */}
            <h4 className="mt-4">Add a New Task</h4>
            <form onSubmit={handleAddClick} className="d-flex mb-4 gap-2">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Task title..." 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    required 
                />
                <input 
                    type="date" 
                    className="form-control" 
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    required 
                />
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Tags (comma separated)" 
                    value={newTaskTags}
                    onChange={(e) => setNewTaskTags(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Add Task</button>
            </form>
            
            {/* --- Day Navigation and Header --- */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                    <button onClick={() => changeDay(-1)} className="btn btn-sm btn-outline-secondary me-2">&lt;</button>
                    <h3 className="m-0 me-3">{dateLabel}</h3>
                    <button onClick={() => changeDay(1)} className="btn btn-sm btn-outline-secondary">&gt;</button>
                </div>
                {/* Optional: Add a 'Today' button */}
                <button onClick={() => setCurrentDay(new Date())} className="btn btn-sm btn-outline-primary">Today</button>
            </div>
            
            {/* --- Tasks on This Day --- */}
            <div className="mb-4">
                <h4>Tasks for This Day</h4>
                {tasksForCurrentDay.length === 0 ? (
                    <p className="text-muted alert alert-light">No tasks planned for {dateLabel}.</p>
                ) : (
                    <ul className="list-group">
                        {tasksForCurrentDay.map(task => (
                            <li key={task._id} className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-light text-muted' : ''}`}>
                                <div>
                                    {/* You would add a checkbox here and a handleToggleComplete function */}
                                    <input type="checkbox" checked={task.completed} className="me-2" readOnly />
                                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                        {task.text}
                                    </span>
                                    <small className="ms-3 badge bg-secondary">{task.tags.join(', ')}</small>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <hr/>
            
            
            
        </div>
    );
}

export default TasksByDayTab;