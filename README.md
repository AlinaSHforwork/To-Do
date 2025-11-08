<h1>A Full-Stack Task Management & Productivity Application💕</h1>

<h2>Executive Summary:</h2>

<h3>Site is a modern, full-stack web application designed for comprehensive task management and personal productivity. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it provides a secure, single-page application (SPA) experience where users can manage their daily schedules, organize tasks, and stay focused.</h3>

<h3>The application features a sleek, minimalist design, transitioning from an animated public-facing landing page to a secure, in-app dashboard. The user experience is centered around a persistent sidebar navigation, allowing users to seamlessly switch between different productivity modules without leaving the page.</h3>

<h2>Key Features:</h2>

<h3>Secure Authentication:</h3>
<ul>
  <li>Animated Landing & Auth Flow: The user journey begins on a custom landing page with a typing animation. This leads to an animated, split-screen interface for Login and Sign Up.</li>
  <li>Backend Security: The Node.js backend uses bcrypt for password hashing and a (mock) JSON Web Token (JWT) system for authenticating users and securing API endpoints.</li>
  <li>Protected Routes: Users cannot access the main application dashboard (/home) unless they are authenticated.</li>
</ul>

<h3>Main Productivity Dashboard (HomePage):</h3>
<ul>
  <li>Centralized State: The main dashboard fetches all of the user's tasks upon login and manages the central state, passing tasks and functions down to child components.</li>
  <li>Modern Sidebar Navigation: All features are accessible from a persistent, dark-themed sidebar, which controls the main content view.</li>
</ul>

<h3>Core Modules:</h3>
<ul>
  <li>Tasks by Day: The primary task management view. Users can navigate between days, view an agenda for the selected date, and add new tasks with titles, due dates, and custom tags. All tasks support "complete" and "delete" functionality.</li>
  <li>Tasks by Tag: A powerful filtering view. The app automatically aggregates all user-created tags (e.g., "work," "personal," "urgent") into a filter list, allowing the user to see all related tasks in one place.</li>
  <li>Interactive Calendar: A full monthly calendar grid that populates with tasks. Task titles are rendered directly within the calendar days. It features a "master-detail" UI where clicking any day opens a side panel displaying all tasks for that specific date.</li>
  <li>Pomodoro Timer: A built-in productivity tool to help users focus. It includes standard "Work," "Short Break," and "Long Break" modes, complete with start/pause/reset controls and configurable time settings.</li>
</ul>

<h2>Technical Architecture</h2>

<h3>Frontend:</h3>
<ul>
  <li>Framework: React</li>
  <li>Routing: React Router DOM (v6) is used for all client-side routing, including protected routes (<ProtectedRoute>), nested routes (<Outlet>), and navigation (useNavigate, <Link>).</li>
  <li>Styling: A custom-built design using CSS (flexbox, grid, animations, transitions) combined with the Bootstrap framework for layout and components.</li>
  <li>State Management: Handled locally within components using React Hooks (useState, useEffect, useMemo, useRef).</li>
</ul>

<h3>Backend:</h3>
<ul>
  <li>Framework: Node.js & Express.js</li>
  <li>Database: MongoDB with Mongoose for data modeling (Users, Tasks).</li>
  <li>API: A RESTful API handles all communication between the client and server. The api.js service on the frontend manages all fetch calls for user authentication (register, login) and task CRUD (Create, Read, Update, Delete) operations.</li>
  <li>Authentication: authenticateToken middleware on the server validates the JWT on all protected API routes (e.g., GET /api/tasks, POST /api/tasks).</li>
</ul>


  
