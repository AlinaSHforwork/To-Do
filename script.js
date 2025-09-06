document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <button>Delete</button>
        `;

        // Toggle completed status on click
        li.querySelector('span').addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        // Delete task on button click
        li.querySelector('button').addEventListener('click', () => {
            taskList.removeChild(li);
        });

        taskList.appendChild(li);
        taskInput.value = ''; // Clear input field
    }
});