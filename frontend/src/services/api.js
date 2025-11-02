// src/services/api.js

export const BACKEND_API_URL = "http://localhost:4000/api"; // Change 3000 if your backend uses a different port



// src/services/api.js
const API_BASE_URL = BACKEND_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the email and password as JSON in the request body
      body: JSON.stringify({ email, password }),
    });

    // Check if the HTTP status is 200-299 (success)
    if (!response.ok) {
      // If the API returns a specific error (e.g., 401 Unauthorized), 
      // throw an error with the message from the backend.
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed.');
    }

    // Parse the successful response body (which should contain a token or user data)
    const data = await response.json();
    return data; 
    
  } catch (error) {
    // Re-throw the error to be handled by the component (LoginPage.js)
    throw error;
  }
};

// Function to handle user registration (Sign-up)
export const registerUser = async (email, password) => {
  // Assuming your backend sign-up endpoint is /api/register or /api/signup
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the registration data
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // If the registration fails (e.g., email already exists, bad data)
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed.');
    }

    // Parse the successful response (may contain the new user's token/ID)
    const data = await response.json();
    return data; 
    
  } catch (error) {
    throw error;
  }
};

const getToken = () => localStorage.getItem('token');

// Function to fetch all tasks for the current user
export const fetchTasks = async () => {
  const token = getToken();
  if (!token) throw new Error("No authorization token found. Please log in.");

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Send the token for authentication
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch tasks.');
  }
  return response.json();
};

// Function to add a new task
export const addTask = async (taskData) => {
  const token = getToken();
  if (!token) throw new Error("No authorization token found. Please log in.");

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Send the token
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add task.');
  }
  return response.json(); // Backend should return the newly created task object
};