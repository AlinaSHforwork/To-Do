document.addEventListener('DOMContentLoaded', () => {
    // Tasks by Day UI (Tab 3)
    const titleInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // optional inputs we will add in HTML for date/tags; if missing, fall back
    let dateInput = document.getElementById('taskDate');
    let tagsInput = document.getElementById('taskTags');

    // helper: uid
    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

    function loadTasks() {
        try { return JSON.parse(localStorage.getItem('tasks') || '[]'); } catch { return []; }
    }

    function saveTasks(tasks) { localStorage.setItem('tasks', JSON.stringify(tasks)); }

    function renderTasksForDate(dateStr) {
        taskList.innerHTML = '';
        const tasks = loadTasks().filter(t => (t.date || '') === (dateStr || ''));
        if (!tasks.length) {
            taskList.innerHTML = '<li class="text-muted">No tasks for this date.</li>';
            return;
        }
        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = t.completed ? 'completed' : '';
            li.innerHTML = `
                <span class="task-title">${escapeHtml(t.text)}</span>
                <div>
                    <button class="btn btn-sm btn-outline-secondary toggle-complete">${t.completed? 'Undo':'Done'}</button>
                    <button class="btn btn-sm btn-outline-danger ms-2 delete-task">Delete</button>
                </div>
            `;
            // toggle completed
            li.querySelector('.toggle-complete').addEventListener('click', () => {
                t.completed = !t.completed;
                const all = loadTasks().map(x => x.id === t.id ? t : x);
                saveTasks(all);
                document.dispatchEvent(new Event('tasksUpdated'));
                renderTasksForDate(dateStr);
            });
            // delete
            li.querySelector('.delete-task').addEventListener('click', () => {
                if (!confirm('Delete this task?')) return;
                const all = loadTasks().filter(x => x.id !== t.id);
                saveTasks(all);
                document.dispatchEvent(new Event('tasksUpdated'));
                renderTasksForDate(dateStr);
            });
            taskList.appendChild(li);
        });
    }

    function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]); }

    function getTodayIso() { const d=new Date(); return d.toISOString().slice(0,10); }

    // ensure dateInput and tagsInput exist; if not, inject small form controls into DOM
    (function ensureInputs(){
        const container = document.querySelector('#tab3 .input-container');
        if (!container) return;
        if (!dateInput) {
            const inp = document.createElement('input');
            inp.type = 'date';
            inp.id = 'taskDate';
            inp.value = getTodayIso();
            inp.className = 'form-control ms-2';
            inp.style.maxWidth = '160px';
            container.insertBefore(inp, container.children[1] || null);
            dateInput = inp;
        }
        if (!tagsInput) {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.id = 'taskTags';
            inp.placeholder = 'tags (comma separated)';
            inp.className = 'form-control ms-2';
            inp.style.maxWidth = '220px';
            container.insertBefore(inp, container.children[2] || null);
            tagsInput = inp;
        }
    })();

    // if some other part of the app requested opening a specific date, apply it
    const pending = localStorage.getItem('selectedDateForTab3');
    if (pending) {
        try {
            if (dateInput) dateInput.value = pending;
            localStorage.removeItem('selectedDateForTab3');
        } catch {}
    }

    // add task handler
    addTaskBtn.addEventListener('click', addTask);
    titleInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

    function addTask() {
        const text = (titleInput.value || '').trim();
        if (!text) { alert('Please enter a task.'); return; }
        const date = (dateInput && dateInput.value) ? dateInput.value : getTodayIso();
        const tagsRaw = (tagsInput && tagsInput.value) ? tagsInput.value : '';
        const tags = tagsRaw.split(',').map(s=>s.trim()).filter(Boolean);
        const t = { id: uid(), text, completed:false, date, tags };
        const all = loadTasks();
        all.push(t);
        saveTasks(all);
        document.dispatchEvent(new Event('tasksUpdated'));
        titleInput.value = '';
        if (tagsInput) tagsInput.value = '';
        renderTasksForDate(date);
    }

    // re-render when date changes
    if (dateInput) {
        dateInput.addEventListener('change', () => renderTasksForDate(dateInput.value));
    }

    // on load render today's tasks
    const initialDate = (dateInput && dateInput.value) ? dateInput.value : getTodayIso();
    renderTasksForDate(initialDate);

    // also allow external listeners (calendar) to refresh when tasks change
});



(function () {
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

        // include tasks so they appear in the calendar cells as well
        const tasks = loadTasks();
        const tasksByDate = tasks.reduce((acc, t) => {
            (acc[t.date] = acc[t.date] || []).push(t);
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
            const dayTasks = tasksByDate[iso] || [];
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

            }

            // show tasks inside the day cell (distinct styling)
            if (dayTasks.length) {
                const tcontainer = document.createElement('div');
                tcontainer.style.marginTop = '8px';
                dayTasks.slice(0,2).forEach(tsk => {
                    const tEl = document.createElement('div');
                    tEl.className = 'task-item small text-truncate';
                    tEl.textContent = tsk.text + (tsk.tags && tsk.tags.length ? ' • ' + tsk.tags.join(', ') : '');
                    tcontainer.appendChild(tEl);
                });
                if (dayTasks.length > 2) {
                    const moret = document.createElement('div');
                    moret.className = 'text-muted small';
                    moret.textContent = `+${dayTasks.length - 2} more task${dayTasks.length-2>1?'s':''}`;
                    tcontainer.appendChild(moret);
                }
                el.appendChild(tcontainer);
            }

            // combined count of events + tasks
            const totalCount = (dayEvents.length || 0) + (dayTasks.length || 0);
            if (totalCount) {
                const count = document.createElement('div');
                count.className = 'event-count';
                count.textContent = `${totalCount} item${totalCount>1?'s':''}`;
                el.appendChild(count);
            }
            el.addEventListener('click', () => {
                // Instead of opening bottom day panel, switch to Tasks-by-Day (Tab 3)
                // Set the date input for Tab 3 and trigger change so it renders tasks for that date.
                const tabBtn = document.getElementById('tab3-tab');
                if (tabBtn) tabBtn.click();
                const dateInp = document.getElementById('taskDate');
                if (dateInp) {
                    dateInp.value = iso;
                    // dispatch change so the Tab 3 handler re-renders tasks
                    dateInp.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    // fallback: if Tab3 doesn't have input yet, save selectedDate to localStorage
                    localStorage.setItem('selectedDateForTab3', iso);
                    // Tab3 init will read this key if present (compatible fallback)
                }
            });
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

    // allow external updates (tasks changed) to refresh calendar/task select
    document.addEventListener('tasksUpdated', refresh);

    // initialize
    refresh();
})();

// --- Pomodoro Timer ---
(function () {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return; // no pomodoro UI on page

    const startBtn = document.getElementById('startPomodoro');
    const pauseBtn = document.getElementById('pausePomodoro');
    const resetBtn = document.getElementById('resetPomodoro');
    const workInput = document.getElementById('workMinutes');
    const shortBreakInput = document.getElementById('shortBreakMinutes');
    const longBreakInput = document.getElementById('longBreakMinutes');
    const sessionsBeforeLongInput = document.getElementById('sessionsBeforeLong');
    const modeLabel = document.getElementById('modeLabel');
    const sessionCountEl = document.getElementById('sessionCount');

    const LS_KEY = 'pomodoroState_v1';
    const LS_SETTINGS = 'pomodoroSettings_v1';

    // defaults
    const defaults = {
        workMin: 25,
        shortBreakMin: 5,
        longBreakMin: 15,
        sessionsBeforeLong: 4,
    };

    // state
    let timerInterval = null;
    let remaining = defaults.workMin * 60;
    let mode = 'work'; // 'work' | 'short' | 'long'
    let running = false;
    let sessionCount = 0;

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(LS_SETTINGS) || '{}');
            return Object.assign({}, defaults, s);
        } catch { return Object.assign({}, defaults); }
    }

    function saveSettings(s) { localStorage.setItem(LS_SETTINGS, JSON.stringify(s)); }

    function loadState() {
        try {
            const st = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
            if (st) {
                mode = st.mode || 'work';
                remaining = typeof st.remaining === 'number' ? st.remaining : loadSettings().workMin * 60;
                running = !!st.running;
                sessionCount = st.sessionCount || 0;
            }
        } catch {}
    }

    function saveState() {
        const st = { mode, remaining, running, sessionCount };
        localStorage.setItem(LS_KEY, JSON.stringify(st));
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2,'0');
        const s = Math.floor(sec % 60).toString().padStart(2,'0');
        return `${m}:${s}`;
    }

    function updateUI() {
        timerEl.textContent = formatTime(remaining);
        if (modeLabel) modeLabel.innerHTML = `Mode: <strong>${mode === 'work' ? 'Work' : mode === 'short' ? 'Short Break' : 'Long Break'}</strong>`;
        if (sessionCountEl) sessionCountEl.innerHTML = `Sessions completed: <strong>${sessionCount}</strong>`;
        // disable/enable buttons
        startBtn.disabled = running;
        pauseBtn.disabled = !running;
    }

    function clearTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }

    function tick() {
        if (remaining > 0) {
            remaining -= 1;
            updateUI();
            saveState();
            return;
        }
        // session finished
        clearTimer();
        running = false;
        if (mode === 'work') {
            sessionCount += 1;
            // choose break type
            const s = loadSettings();
            if (sessionCount % s.sessionsBeforeLong === 0) {
                mode = 'long';
                remaining = s.longBreakMin * 60;
            } else {
                mode = 'short';
                remaining = s.shortBreakMin * 60;
            }
        } else {
            // break finished -> go to work
            mode = 'work';
            remaining = loadSettings().workMin * 60;
        }
        // auto-start next session
        startTimer();
        updateUI();
        saveState();
    }

    function startTimer() {
        if (running) return;
        running = true;
        clearTimer();
        timerInterval = setInterval(tick, 1000);
        updateUI();
        saveState();
    }

    function pauseTimer() {
        running = false;
        clearTimer();
        updateUI();
        saveState();
    }

    function resetTimer() {
        const s = loadSettings();
        mode = 'work';
        remaining = s.workMin * 60;
        running = false;
        sessionCount = 0;
        clearTimer();
        updateUI();
        saveState();
    }

    // wire buttons
    startBtn.addEventListener('click', () => startTimer());
    pauseBtn.addEventListener('click', () => pauseTimer());
    resetBtn.addEventListener('click', () => resetTimer());

    // wire settings inputs and persist
    function applySettingsToInputs(s) {
        workInput.value = s.workMin;
        shortBreakInput.value = s.shortBreakMin;
        longBreakInput.value = s.longBreakMin;
        sessionsBeforeLongInput.value = s.sessionsBeforeLong;
    }

    function readSettingsFromInputs() {
        const s = {
            workMin: Math.max(1, parseInt(workInput.value) || defaults.workMin),
            shortBreakMin: Math.max(1, parseInt(shortBreakInput.value) || defaults.shortBreakMin),
            longBreakMin: Math.max(1, parseInt(longBreakInput.value) || defaults.longBreakMin),
            sessionsBeforeLong: Math.max(1, parseInt(sessionsBeforeLongInput.value) || defaults.sessionsBeforeLong)
        };
        saveSettings(s);
        return s;
    }

    [workInput, shortBreakInput, longBreakInput, sessionsBeforeLongInput].forEach(inp => {
        inp.addEventListener('change', () => {
            const s = readSettingsFromInputs();
            // if currently in that mode, update remaining to follow new minutes (but do not auto-start)
            if (!running) {
                if (mode === 'work') remaining = s.workMin * 60;
                if (mode === 'short') remaining = s.shortBreakMin * 60;
                if (mode === 'long') remaining = s.longBreakMin * 60;
            }
            updateUI();
            saveState();
        });
    });

    // load initial
    const initialSettings = loadSettings();
    applySettingsToInputs(initialSettings);
    loadState();
    // if nothing stored, set remaining based on settings
    if (typeof remaining !== 'number' || isNaN(remaining)) remaining = initialSettings.workMin * 60;
    updateUI();
    // if state says running, resume
    if (running) startTimer();

})();

// --- Tags UI: Tab 4 (appended at end) ---
(function(){
    const tagFilterList = document.getElementById('tagFilterList');
    const tagsTaskList = document.getElementById('tagsTaskList');
    if (!tagFilterList || !tagsTaskList) return;

    function loadTasks() {
        try { return JSON.parse(localStorage.getItem('tasks') || '[]'); } catch { return []; }
    }

    function saveTasks(tasks) { localStorage.setItem('tasks', JSON.stringify(tasks)); }

    function getUniqueTags() {
        const tasks = loadTasks();
        const set = new Set();
        tasks.forEach(t => (t.tags||[]).forEach(tag => set.add(tag)));
        return Array.from(set).sort((a,b)=>a.localeCompare(b));
    }

    function renderTagButtons() {
        const tags = getUniqueTags();
        tagFilterList.innerHTML = '';
        const allBtn = document.createElement('button');
        allBtn.className = 'btn btn-sm btn-outline-primary me-1 mb-1';
        allBtn.textContent = 'All';
        allBtn.addEventListener('click', ()=> renderTasksForTag('All'));
        tagFilterList.appendChild(allBtn);
        tags.forEach(tag => {
            const b = document.createElement('button');
            b.className = 'btn btn-sm btn-outline-secondary me-1 mb-1';
            b.textContent = tag;
            b.addEventListener('click', ()=> renderTasksForTag(tag));
            tagFilterList.appendChild(b);
        });
    }

    function renderTasksForTag(tag) {
        tagsTaskList.innerHTML = '';
        const tasks = loadTasks().filter(t => {
            if (tag === 'All') return true;
            return (t.tags||[]).includes(tag);
        });
        if (!tasks.length) { tagsTaskList.innerHTML = '<div class="text-muted">No tasks.</div>'; return; }

        // group by date
        const byDate = tasks.reduce((acc,t)=>{ (acc[t.date||(new Date()).toISOString().slice(0,10)] = acc[t.date] || []).push(t); return acc; }, {});
        Object.keys(byDate).sort().forEach(date => {
            const h = document.createElement('h5');
            h.textContent = date;
            tagsTaskList.appendChild(h);
            const ul = document.createElement('ul');
            ul.className = 'list-unstyled mb-3';
            byDate[date].forEach(t => {
                const li = document.createElement('li');
                li.className = t.completed ? 'completed' : '';
                li.innerHTML = `<span>${escapeHtml(t.text)}</span> <small class="text-muted">${(t.tags||[]).join(', ')}</small> <div class="d-inline ms-2"></div>`;
                const div = document.createElement('div');
                div.className = 'btn-group ms-2';
                const done = document.createElement('button'); done.className='btn btn-sm btn-outline-secondary'; done.textContent = t.completed ? 'Undo' : 'Done';
                done.addEventListener('click', ()=>{ t.completed = !t.completed; const all = loadTasks().map(x => x.id===t.id? t : x); saveTasks(all); document.dispatchEvent(new Event('tasksUpdated')); renderTasksForTag(tag); });
                const del = document.createElement('button'); del.className='btn btn-sm btn-outline-danger'; del.textContent = 'Delete';
                del.addEventListener('click', ()=>{ if (!confirm('Delete this task?')) return; const all = loadTasks().filter(x=>x.id!==t.id); saveTasks(all); document.dispatchEvent(new Event('tasksUpdated')); renderTasksForTag(tag); });
                div.appendChild(done); div.appendChild(del);
                li.appendChild(div);
                ul.appendChild(li);
            });
            tagsTaskList.appendChild(ul);
        });
    }

    // utility escapeHtml reused
    function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]); }

    // react to updates
    document.addEventListener('tasksUpdated', () => { renderTagButtons(); renderTasksForTag('All'); });

    // initial render
    renderTagButtons(); renderTasksForTag('All');

})();
