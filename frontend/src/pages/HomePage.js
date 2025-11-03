// src/pages/HomePage.js (LIFTING STATE UP - FINAL VERSION)

import React, { useState, useEffect } from 'react';
import TasksByDayTab from '../components/TasksByDayTab'; 
import CalendarTab from '../components/CalendarTab';
import PomodoroTab from '../components/PomodoroTab'; 
import TasksByTagTab from '../components/TasksByTagTab'; // Ensure this is imported

// --- MOCK/SIMPLIFIED API FUNCTIONS (For demonstration) ---
// In your real application, these should be in src/services/api.js
const getToken = () => localStorage.getItem('token'); 

// Fetch function must send the Authorization header
const fetchTasksApi = async () => {
    // Check if the backend auth fix was applied. If not, this will fail.
    const token = getToken();
    // Use the actual fetch call from your api.js once the backend auth is fixed
    // For now, we return mock data or an empty array
    
    // Example of a minimal fetch (assuming backend auth fix from previous step):
    /*
    const response = await fetch('http://localhost:4000/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch tasks.');
    return response.json();
    */

    return [
        // Mock initial data
        { _id: 't1', text: 'Initial Task for Calendar', completed: false, date: '2025-11-05', tags: ['Code', 'Project'] },
        { _id: 't2', text: 'Task with Tag', completed: true, date: '2025-11-06', tags: ['Personal', 'Urgent'] },
    ];
};

const addTaskApi = async (newTask) => {
    // Call the actual POST endpoint
    /*
    const token = getToken();
    const response = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newTask)
    });
    if (!response.ok) throw new Error('Failed to add task.');
    return response.json();
    */
    
    // Mock successful creation (assign a temporary ID)
    return { ...newTask, _id: Date.now().toString() };
};
// --- END MOCK API ---


function HomePage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch initial data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const initialTasks = await fetchTasksApi();
        setTasks(initialTasks);
      } catch (err) {
        setError("Failed to load initial data. Check API.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Function to add a task (passed down to TasksByDayTab)
  const handleAddTask = async (newTaskData) => {
    try {
      const addedTask = await addTaskApi(newTaskData);
      // Update the centralized state array with the new task
      setTasks(prevTasks => [...prevTasks, addedTask]);
      return true; // Indicate success
    } catch (err) {
      setError("Could not add task. Try restarting backend.");
      console.error(err);
      return false; // Indicate failure
    }
  };

  if (loading) {
      return <div className="container text-center mt-5">Loading app data...</div>;
  }
  
  if (error) {
       return <div className="container text-center mt-5 alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container col-10 mt-4">
      <div className="row">
        
        {/* Sidebar Navigation (Tabs)*/}
        <div className="col-md-2 mb-3">
          <ul className="flex-column sideButton" id="sidebarTabs" role="tablist" aria-orientation="vertical">          
            <li className="nav-item" role="presentation"><button className="nav-link active" id="tab1-tab" data-bs-toggle="pill" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">Account</button></li>
            <li className="nav-item" role="presentation"><button className="nav-link" id="tab2-tab" data-bs-toggle="pill" data-bs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">Calendar</button></li>
            <li className="nav-item" role="presentation"><button className="nav-link" id="tab3-tab" data-bs-toggle="pill" data-bs-target="#tab3" type="button" role="tab" aria-controls="tab3" aria-selected="false">Tasks by Day</button></li>
            <li className="nav-item" role="presentation"><button className="nav-link" id="tab4-tab" data-bs-toggle="pill" data-bs-target="#tab4" type="button" role="tab" aria-controls="tab4" aria-selected="false">Tasks by Tag</button></li>
            <li className="nav-item" role="presentation"><button className="nav-link" id="tab5-tab" data-bs-toggle="pill" data-bs-target="#tab5" type="button" role="tab" aria-controls="tab5" aria-selected="false">Pomodoro</button></li>
          </ul>
        </div>
        
        {/* Tab Content Area */}
        <div className="col-md-9">
          <div className="tab-content" id="sidebarTabsContent">
            
            {/* Tab 1: Account */}
            <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
              <h1>Account</h1>
              <p>Account details and settings go here.</p>
              <button className="btn btn-danger mt-3" onClick={onLogout} >Log Out</button>
            </div>
            
            {/* Tab 2: Calendar - PASSES TASKS */}
            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
                <CalendarTab tasks={tasks} /> {/* Pass tasks down */}
            </div>
            
            {/* Tab 3: Tasks by Day - PASSES TASKS AND ADD FUNCTION */}
            <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
                <TasksByDayTab tasks={tasks} onAddTask={handleAddTask} /> {/* Pass state and function */}
            </div>
            
            {/* Tab 4: Tasks by Tag - PASSES TASKS */}
            <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4-tab">
                <TasksByTagTab tasks={tasks} /> {/* Pass tasks down */}
            </div>
            
            {/* Tab 5: Pomodoro Timer - unchanged */}
            <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-tab">
                <PomodoroTab />
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default HomePage;