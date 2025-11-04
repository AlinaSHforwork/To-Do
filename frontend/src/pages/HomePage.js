import React, { useState, useEffect } from 'react';
import TasksByDayTab from '../components/TasksByDayTab'; 
import CalendarTab from '../components/CalendarTab';
import PomodoroTab from '../components/PomodoroTab'; 
import TasksByTagTab from '../components/TasksByTagTab';
import { fetchTasks, addTask, updateTask, deleteTask } from '../services/api';

const getToken = () => localStorage.getItem('token'); 

// --- REMOVE THE MOCK API FUNCTIONS (fetchTasksApi, addTaskApi) ---

function HomePage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load tasks (now using the real API)
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 2. USE THE REAL FETCH FUNCTION
      const initialTasks = await fetchTasks();
      setTasks(initialTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError('Failed to load tasks. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Fetch initial data on component mount
  useEffect(() => {
    loadData();
  }, []);

 const handleAddTask = async (taskData) => {
    try {
      const newTask = await addTask(taskData);      
      setTasks(prevTasks => [...prevTasks, newTask]);      
      return { success: true, data: newTask };
      
    } catch (err) {
      console.error("Failed to add task:", err);
      return { success: false, message: err.message };
    }
  };
  
const handleToggleComplete = async (taskId, newCompletedStatus) => {
    try {
      const updatedTask = await updateTask(taskId, { completed: newCompletedStatus });
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
      
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

const handleDeleteTask = async (taskId) => {

    if (!window.confirm("Are you sure you want to delete this task?")) {
     return;
    }    
    try {
      await deleteTask(taskId);
      
      setTasks(prevTasks => 
        prevTasks.filter(task => task._id !== taskId)
      );
      
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  if (loading) return <div className="container mt-5 text-center">Loading tasks...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

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
                <TasksByDayTab 
                    tasks={tasks} 
                    onAddTask={handleAddTask}
                    onToggleComplete={handleToggleComplete} 
                    onDeleteTask={handleDeleteTask}
                />
            </div>
            
            {/* Tab 4: Tasks by Tag - PASSES TASKS */}
            <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4-tab">
                <TasksByTagTab 
                tasks={tasks} 
                onToggleComplete={handleToggleComplete} // NEW
                onDeleteTask={handleDeleteTask}
                />
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