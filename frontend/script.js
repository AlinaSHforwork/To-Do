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



(function () {
                                // Simple calendar with localStorage-backed events. Events shape: {id, date:'YYYY-MM-DD', title, time, taskId}
                                const daysGrid = document.getElementById('daysGrid');
                                const monthYear = document.getElementById('monthYear');
                                const prevBtn = document.getElementById('prevMonth');
                                const nextBtn = document.getElementById('nextMonth');
                                const todayBtn = document.getElementById('todayBtn');
                                const dayPanel = document.getElementById('dayPanel');
                                const selectedDateLabel = document.getElementById('selectedDateLabel');
                                const selectedDateInfo = document.getElementById('selectedDateInfo');
                                const eventsList = document.getElementById('eventsList');
                                const addEventForm = document.getElementById('addEventForm');
                                const eventTitle = document.getElementById('eventTitle');
                                const eventTime = document.getElementById('eventTime');
                                const eventTaskSelect = document.getElementById('eventTaskSelect');
                                const closeDayPanel = document.getElementById('closeDayPanel');

                                let view = new Date();
                                let selectedDate = null;

                                function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

                                function loadEvents() {
                                    try {
                                        return JSON.parse(localStorage.getItem('events') || '[]');
                                    } catch {
                                        return [];
                                    }
                                }
                                function saveEvents(evts) { localStorage.setItem('events', JSON.stringify(evts)); }

                                function loadTasks() {
                                    try {
                                        return JSON.parse(localStorage.getItem('tasks') || '[]');
                                    } catch {
                                        return [];
                                    }
                                }

                                function refreshTaskSelect() {
                                    const tasks = loadTasks();
                                    eventTaskSelect.innerHTML = '<option value="">Link to task (optional)</option>';
                                    tasks.forEach(t => {
                                        const opt = document.createElement('option');
                                        opt.value = t.id ?? t._id ?? t.id; // try common id keys
                                        opt.textContent = t.text ?? t.title ?? String(t);
                                        eventTaskSelect.appendChild(opt);
                                    });
                                }  
                                function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
                                function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth()+1, 0); }
                                function formatDate(d) {
                                    const y = d.getFullYear();
                                    const m = String(d.getMonth() + 1).padStart(2,'0');
                                    const day = String(d.getDate()).padStart(2,'0');
                                    return `${y}-${m}-${day}`;
                                }

                                function buildCalendar() {
                                    daysGrid.innerHTML = '';
                                    const first = startOfMonth(view);
                                    const last = endOfMonth(view);
                                    const startDay = first.getDay(); // 0..6
                                    const totalDays = last.getDate();
                                    // show days from previous month to fill week
                                    const prevLast = new Date(view.getFullYear(), view.getMonth(), 0).getDate();

                                    const events = loadEvents();
                                    const eventsByDate = events.reduce((acc, e) => {
                                        (acc[e.date] = acc[e.date] || []).push(e);
                                        return acc;
                                    }, {});

                                    // show 6 rows (42 cells)
                                    let cells = [];
                                    // previous month tail
                                    for (let i = startDay - 1; i >= 0; i--) {
                                        const dayNum = prevLast - i;
                                        const date = new Date(view.getFullYear(), view.getMonth()-1, dayNum);
                                        cells.push({date, inactive:true});
                                    }
                                    // current month
                                    for (let i = 1; i <= totalDays; i++) {
                                        const date = new Date(view.getFullYear(), view.getMonth(), i);
                                        cells.push({date, inactive:false});
                                    }
                                    // next month lead
                                    let nextDay = 1;
                                    while (cells.length % 7 !== 0 || cells.length < 42) {
                                        const date = new Date(view.getFullYear(), view.getMonth()+1, nextDay++);
                                        cells.push({date, inactive:true});
                                    }

                                    monthYear.textContent = view.toLocaleString(undefined, {month:'long', year:'numeric'});

                                    cells.forEach(cell => {
                                        const d = cell.date;
                                        const iso = formatDate(d);
                                        const el = document.createElement('div');
                                        el.className = 'cal-day' + (cell.inactive ? ' inactive' : '');
                                        el.dataset.date = iso;
                                        el.innerHTML = `<div class="date-num">${d.getDate()}</div>`;
                                        const dayEvents = eventsByDate[iso] || [];
                                        if (dayEvents.length) {
                                            // show up to 2 events as text, and a count badge
                                            const container = document.createElement('div');
                                            container.style.marginTop = '20px';
                                            dayEvents.slice(0,2).forEach(ev => {
                                                const evEl = document.createElement('div');
                                                evEl.className = 'event-item';
                                                evEl.textContent = (ev.time ? ev.time + ' ' : '') + ev.title;
                                                container.appendChild(evEl);
                                            });
                                            if (dayEvents.length > 2) {
                                                const more = document.createElement('div');
                                                more.className = 'text-muted';
                                                more.style.fontSize = '0.8rem';
                                                more.textContent = `+${dayEvents.length - 2} more`;
                                                container.appendChild(more);
                                            }
                                            el.appendChild(container);

                                            const count = document.createElement('div');
                                            count.className = 'event-count';
                                            count.textContent = `${dayEvents.length} event${dayEvents.length>1?'s':''}`;
                                            el.appendChild(count);
                                        }

                                        el.addEventListener('click', () => openDayPanel(iso));
                                        daysGrid.appendChild(el);  
                                        });
                                }

                                function openDayPanel(iso) {
                                    selectedDate = iso;
                                    selectedDateLabel.textContent = new Date(iso).toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'long', day:'numeric'});
                                    const events = loadEvents().filter(e => e.date === iso).sort((a,b) => (a.time||'') > (b.time||'') ? 1 : -1);
                                    eventsList.innerHTML = '';
                                    if (!events.length) {
                                        eventsList.innerHTML = '<p class="text-muted">No events for this date.</p>';
                                    } else {
                                        events.forEach(ev => {
                                            const div = document.createElement('div');
                                            div.className = 'event-item d-flex justify-content-between align-items-start';
                                            const left = document.createElement('div');
                                            left.innerHTML = `<strong>${ev.title}</strong><div class="text-muted small">${ev.time || ''}${ev.taskId ? ' • linked task' : ''}</div>`;
                                            const right = document.createElement('div');
                                            const del = document.createElement('button');
                                            del.className = 'btn btn-sm btn-outline-danger';
                                            del.textContent = 'Delete';
                                            del.addEventListener('click', () => {
                                                if (!confirm('Delete this event?')) return;
                                                const all = loadEvents().filter(x => x.id !== ev.id);
                                                saveEvents(all);
                                                refresh();
                                                openDayPanel(iso);
                                            });
                                            right.appendChild(del);
                                            div.appendChild(left);
                                            div.appendChild(right);
                                            eventsList.appendChild(div);
                                        });
                                    }

                                    // populate task link info
                                    refreshTaskSelect();

                                    dayPanel.style.display = 'block';
                                }
                                addEventForm.addEventListener('submit', function (e) {
                                    e.preventDefault();
                                    if (!selectedDate) return;
                                    const title = eventTitle.value.trim();
                                    if (!title) return;
                                    const time = eventTime.value;
                                    const taskId = eventTaskSelect.value || null;
                                    const ev = { id: uid(), date: selectedDate, title, time, taskId };
                                    const all = loadEvents();
                                    all.push(ev);
                                    saveEvents(all);
                                    eventTitle.value = '';
                                    eventTime.value = '';
                                    eventTaskSelect.value = '';
                                    refresh();
                                    openDayPanel(selectedDate);
                                });

                                closeDayPanel.addEventListener('click', () => { dayPanel.style.display = 'none'; selectedDate = null; });

                                prevBtn.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth()-1, 1); buildCalendar(); });
                                nextBtn.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth()+1, 1); buildCalendar(); });
                                todayBtn.addEventListener('click', () => { view = new Date(); buildCalendar(); });

                                function refresh() {
                                    refreshTaskSelect();
                                    buildCalendar();
                                }

                                // initialize
                                refresh();
                            })();