import React, { useState, useEffect } from 'react';
import TasksByDayTab from '../components/TasksByDayTab'; 
import CalendarTab from '../components/CalendarTab';
import PomodoroTab from '../components/PomodoroTab'; 
import TasksByTagTab from '../components/TasksByTagTab';
import { fetchTasks, addTask, updateTask, deleteTask } from '../services/api';
import '../styles/HomePage.css';

const getToken = () => localStorage.getItem('token'); 

function HomePage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('tasksByDay'); 
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const initialTasks = await fetchTasks();
      setTasks(initialTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError('Failed to load tasks. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

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
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => 
        prevTasks.filter(task => task._id !== taskId)
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'tasksByDay':
        return <TasksByDayTab 
                  tasks={tasks} 
                  onAddTask={handleAddTask}
                  onToggleComplete={handleToggleComplete} 
                  onDeleteTask={handleDeleteTask} 
               />;
      case 'tasksByTag':
        return <TasksByTagTab 
                  tasks={tasks} 
                  onToggleComplete={handleToggleComplete} 
                  onDeleteTask={handleDeleteTask}
               />;
      case 'calendar':
        return <CalendarTab tasks={tasks} />;
      case 'pomodoro':
        return <PomodoroTab />; 
      default:
        return <TasksByDayTab tasks={tasks} onAddTask={handleAddTask} onToggleComplete={handleToggleComplete} onDeleteTask={handleDeleteTask} />;
    }
  };

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;


  return (
    <div className="home-container">
      
      <nav className="home-sidebar">
        <div>
          <h2 className="sidebar-header micro-5-regular">Planner</h2>
          <ul className="sidebar-nav">
            <li>
              <a 
                className={activeView === 'tasksByDay' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); setActiveView('tasksByDay'); }}
              >
                Tasks by Day
              </a>
            </li>
            <li>
              <a 
                className={activeView === 'tasksByTag' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); setActiveView('tasksByTag'); }}
              >
                Tasks by Tag
              </a>
            </li>
            <li>
              <a 
                className={activeView === 'calendar' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); setActiveView('calendar'); }}
              >
                Calendar
              </a>
            </li>
            <li>
              <a 
                className={activeView === 'pomodoro' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); setActiveView('pomodoro'); }}
              >
                Pomodoro
              </a>
            </li>
          </ul>
        </div>
        
        <button className="btn logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </nav>

      <main className="home-content">
        {renderActiveView()}
      </main>
      
    </div>
  );
}

export default HomePage;