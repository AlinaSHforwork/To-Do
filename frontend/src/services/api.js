// src/services/api.js

export const BACKEND_API_URL = "http://localhost:4000/api"; 
const API_BASE_URL = BACKEND_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if the HTTP status is 200-299 (success)
    if (!response.ok) {
      // If the API returns a specific error (e.g., 401 Unauthorized)
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed.');
    }
    const data = await response.json();
    return data; 
    
  } catch (error) {
    throw error;
  }
};


export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed.');
    }
    const data = await response.json();
    return data; 
    
  } catch (error) {
    throw error;
  }
};

const getToken = () => localStorage.getItem('token');


export const fetchTasks = async () => {
  const token = getToken();
  if (!token) throw new Error("No authorization token found. Please log in.");

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch tasks.');
  }
  return response.json();
};

export const addTask = async (taskData) => {
  const token = getToken();
  if (!token) throw new Error("No authorization token found. Please log in.");

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown server error.' }));
    throw new Error(errorData.message || `Failed to add task. Status: ${response.status}`);
  }
  return response.json();
};
// --- TASK CRUD OPERATIONS ---

// 1. Function to Update an existing task
export const updateTask = async (taskId, updateData) => {
  const token = getToken();
  if (!token) throw new Error("No authorization token found. Please log in.");

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task.');
  }
  return response.json();
};


// 2. Function to Delete a task
export const deleteTask = async (taskId) => {
  const token = getToken();
  if (!token) throw new Error("No authorization token found. Please log in.");

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });

  // DELETE returns 204 No Content on success, so we check for that status
  if (response.status === 204) {
    return true; // Deletion successful
  }
  
  // Handle other non-success codes (e.g., 404, 403)
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete task.');
  }
};