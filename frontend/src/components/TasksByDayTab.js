// src/components/TasksByDayTab.js (FIXED: Add Task Button Logic & Feedback)

import React, { useState } from 'react';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => new Date(date).toISOString().split('T')[0];

// Accept the props needed from HomePage
function TasksByDayTab({ tasks, onAddTask, onToggleComplete, onDeleteTask }) { 
    
    // State for Date Navigation
    const [currentDay, setCurrentDay] = useState(new Date()); 
    
    // States for new task inputs
    const [newTaskText, setNewTaskText] = useState('');
    // Ensure the date input always defaults to the currently viewed day for quick entry
    const [newTaskDate, setNewTaskDate] = useState(formatDate(currentDay)); 
    const [newTaskTags, setNewTaskTags] = useState('');
    
    // NEW: State for showing success/error messages
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

    // Helper to ensure date is in YYYY-MM-DD format (The date input should handle this, but for safety)
    const normalizeDate = (dateString) => {
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        // Assuming DD.MM.YYYY if not standard YYYY-MM-DD
        const parts = dateString.split(/[\.\-\/]/); 
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`; 
        }
        return dateString; 
    };
    
    // --- Task Creation Handler ---
    const handleAddClick = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: null, text: '' }); // Clear previous status

        // 1. INPUT VALIDATION
        if (!newTaskText || !newTaskDate) {
            setStatusMessage({ type: 'error', text: 'Task title and date are required.' });
            return; // STOP EXECUTION if fields are empty
        }

        const normalizedDate = normalizeDate(newTaskDate);
        const tagsArray = newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        const newTask = {
            text: newTaskText,
            date: normalizedDate,
            tags: tagsArray,
            completed: false
        };

        try {
            // 2. CALL API (onAddTask returns true on success, false/throws error on failure)
            const success = await onAddTask(newTask); 
            
            if (success) {
                // 3. SUCCESS: Clear fields and show message
                setStatusMessage({ type: 'success', text: 'Task added successfully!' });
                setNewTaskText('');
                setNewTaskTags('');
            } else {
                // Fallback for API returning false
                 setStatusMessage({ type: 'error', text: 'Failed to add task. Check console for details.' });
            }
        } catch (error) {
            // 4. ERROR: Display error message
            setStatusMessage({ type: 'error', text: `Error: ${error.message}` });
            console.error(error);
        }
    };
    
    // ... (rest of filtering and formatting logic) ...

    return (
        <div>
            {/* ... Day Navigation and Tasks on This Day ... */}
            
            <hr/>
            
            {/* --- Add New Task Form --- */}
            <h4 className="mt-4 micro-5-regular">Add a New Task</h4>
            
            {/* 5. DISPLAY STATUS MESSAGE */}
            {statusMessage.type === 'error' && <div className="alert alert-danger">{statusMessage.text}</div>}
            {statusMessage.type === 'success' && <div className="alert alert-success">{statusMessage.text}</div>}
            
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
            
        </div>
    );
}

export default TasksByDayTab;