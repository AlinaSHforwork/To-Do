import React from 'react';
import TasksByDayTab from '../components/TasksByDayTab';

function HomePage({ onLogout }) {
  // Transfer the HTML structure (form, inputs, etc.) 
  // NOTE: You MUST use 'className' instead of 'class' for CSS.
  // NOTE: You MUST use 'htmlFor' instead of 'for' for labels (though none were present here).
  // NOTE: Elements that don't close themselves (like <input>) need a trailing slash: <input ... />
  
  return (
    <div className="container col-10 mt-4">
      <div className="row">
        
        {/* Sidebar Navigation (Tabs) */}
        <div className="col-md-2 mb-3">
          <ul className="flex-column sideButton" id="sidebarTabs" role="tablist" aria-orientation="vertical">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="tab1-tab" data-bs-toggle="pill" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">Account</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="tab2-tab" data-bs-toggle="pill" data-bs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">Calendar</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="tab3-tab" data-bs-toggle="pill" data-bs-target="#tab3" type="button" role="tab" aria-controls="tab3" aria-selected="false">Tasks by Day</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="tab4-tab" data-bs-toggle="pill" data-bs-target="#tab4" type="button" role="tab" aria-controls="tab4" aria-selected="false">Tasks by Tag</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="tab5-tab" data-bs-toggle="pill" data-bs-target="#tab5" type="button" role="tab" aria-controls="tab5" aria-selected="false">Pomodoro</button>
            </li>
          </ul>
        </div>
        
        {/* Tab Content Area */}
        <div className="col-md-9">
          <div className="tab-content" id="sidebarTabsContent">
            
            {/* Tab 1: Account */}
            <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
            <h1>Account</h1>
            <p>Account details and settings go here.</p>
            {/* The Logout Button */}
            <button className="btn btn-danger mt-3" onClick={onLogout} >Log Out </button>
        </div>
            
            {/* Tab 2: Calendar */}
            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
              <div className="calendar-wrap">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    {/* These buttons will need onClick handlers in React */}
                    <button id="prevMonth" className="btn btn-sm btn-outline-secondary me-2">&lt;</button>
                    <button id="nextMonth" className="btn btn-sm btn-outline-secondary">&gt;</button>
                  </div>
                  <h4 id="monthYear" className="m-0"></h4>
                  <div>
                    <button id="todayBtn" className="btn btn-sm btn-outline-primary">Today</button>
                  </div>
                </div>

                <div id="calendar" className="border rounded p-2">
                  <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', display: 'grid' }}>
                    <div className="text-center fw-bold py-1">Sun</div>
                    <div className="text-center fw-bold py-1">Mon</div>
                    <div className="text-center fw-bold py-1">Tue</div>
                    <div className="text-center fw-bold py-1">Wed</div>
                    <div className="text-center fw-bold py-1">Thu</div>
                    <div className="text-center fw-bold py-1">Fri</div>
                    <div className="text-center fw-bold py-1">Sat</div>
                  </div>
                  <div id="daysGrid" className="d-grid mt-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', display: 'grid' }}></div>
                </div>

                <div id="dayPanel" className="mt-3 border rounded p-3" style={{ display: 'none' }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 id="selectedDateLabel" className="mb-1"></h5>
                      <small id="selectedDateInfo" className="text-muted"></small>
                    </div>
                    <div>
                      <button id="closeDayPanel" className="btn btn-sm btn-outline-secondary">Close</button>
                    </div>
                  </div>

                  <hr />

                  <div id="eventsList" className="mb-3"></div>

                  <form id="addEventForm" className="row g-2">
                    <div className="col-12 col-md-6">
                      <input type="text" id="eventTitle" className="form-control" placeholder="Event title" required />
                    </div>
                    <div className="col-6 col-md-3">
                      <input type="time" id="eventTime" className="form-control" />
                    </div>
                    <div className="col-6 col-md-3">
                      <select id="eventTaskSelect" className="form-select">
                        <option value="">Link to task (optional)</option>
                      </select>
                    </div>
                    <div className="col-12 d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary btn-sm">Add Event</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Tab 3: Tasks by Day */}
            <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
        <TasksByDayTab /> {/* <-- RENDER THE NEW COMPONENT HERE */}
    </div>
            
            {/* Tab 4: Tasks by Tag */}
            <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4-tab">
              <h2>Tasks by Tag</h2>
              <p className="small text-muted">Click a tag to filter tasks, or select "All".</p>
              <div id="tagFilterList" className="mb-2"></div>
              <div id="tagsTaskList"></div>
            </div>
            
            {/* Tab 5: Pomodoro Timer */}
            <div className="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-tab">
              <div className="pomodoro-wrap p-3">
                <h2 className="text-center">Pomodoro Timer</h2>
                
                <div className="timer-display text-center mb-3">
                  <div id="timer" className="display-4">25:00</div>
                  <div className="text-muted small">Focus on one task during Work sessions.</div>
                </div>

                <div className="d-flex justify-content-center gap-2 mb-3">
                  <button id="startPomodoro" className="btn btn-primary">Start</button>
                  <button id="pausePomodoro" className="btn btn-secondary">Pause</button>
                  <button id="resetPomodoro" className="btn btn-outline-danger">Reset</button>
                </div>

                <div className="pomodoro-settings border rounded p-3">
                  <div className="row g-2 align-items-center">
                    <div className="col-6 col-md-3">
                      <label className="form-label small mb-1">Work (min)</label>
                      <input id="workMinutes" type="number" min="1" className="form-control form-control-sm" defaultValue="25" />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small mb-1">Short Break (min)</label>
                      <input id="shortBreakMinutes" type="number" min="1" className="form-control form-control-sm" defaultValue="5" />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small mb-1">Long Break (min)</label>
                      <input id="longBreakMinutes" type="number" min="1" className="form-control form-control-sm" defaultValue="15" />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small mb-1">Sessions/Long Break</label>
                      <input id="sessionsBeforeLong" type="number" min="1" className="form-control form-control-sm" defaultValue="4" />
                    </div>
                  </div>
                  <div className="mt-2 text-muted small">Settings are saved locally.</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default HomePage;