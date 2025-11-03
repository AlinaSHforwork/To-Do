// src/components/CalendarTab.js (FULL LOGIC)

import React, { useState, useEffect } from 'react';

// NOTE: You must import your API service for events here
// import { fetchEvents, addEvent } from '../services/api'; 

function CalendarTab({ tasks }) { 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null); // Date object for selected day

  // --- API/Data Logic ---
  useEffect(() => {
    // This is where you call the API. For now, we use mock data.
    const loadEvents = async () => {
      setLoading(true);
      try {
        // const fetchedEvents = await fetchEvents(currentDate.getFullYear(), currentDate.getMonth());
        
        // --- MOCK DATA ---
        const mockEvents = [
          { _id: 'e1', title: 'Start React Component', date: '2025-11-05', time: '10:00', taskId: null },
          { _id: 'e2', title: 'Meeting with Alina', date: '2025-11-15', time: '14:30', taskId: null },
          { _id: 'e3', title: 'Code Review Deadline', date: '2025-11-28', time: '17:00', taskId: null },
        ];
        setEvents(mockEvents);
        // --- END MOCK DATA ---
        
      } catch (err) {
        // setError("Failed to load events. Check API connection.");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [currentDate]); 

  // --- Navigation Handlers ---
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };
  
  // --- Calendar Rendering Logic ---
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month (0=Sun, 6=Sat)
    const firstDay = new Date(year, month, 1).getDay();
    // Get the total number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];

    // 1. Add blank tiles for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`blank-${i}`} className="calendar-day text-muted"></div>);
    }

    // 2. Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayEvents = events.filter(event => event.date === dayKey);

      const isToday = new Date().toDateString() === dayDate.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === dayDate.toDateString();
      const dayTasks = tasks.filter(task => task.date === dayKey);
      
      days.push(
        <div 
          key={dayKey}
          className={`text-center py-2 border rounded calendar-day-cell cursor-pointer ${isToday ? 'bg-info bg-opacity-10' : ''} ${isSelected ? 'border-primary border-2' : ''}`}
          onClick={() => setSelectedDate(dayDate)}
          style={{ minHeight: '60px' }}
        >
          <div className="fw-bold">{day}</div>
          {dayTasks.length > 0 && <small className="badge bg-danger rounded-pill">{dayTasks.length} Task{dayTasks.length > 1 ? 's' : ''}</small>}
        </div>
      );
    }
    
    return days;
  };
  
  // Helper to format the Month/Year display
  const monthYearLabel = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  
  // --- Selected Day Panel Logic ---
  const renderDayPanel = () => {
      if (!selectedDate) return null;

      const dayKey = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');
      const eventsForSelectedDay = events.filter(event => event.date === dayKey);

      return (
        <div id="dayPanel" className="mt-3 border rounded p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 id="selectedDateLabel" className="mb-1">{selectedDate.toDateString()}</h5>
              <small id="selectedDateInfo" className="text-muted">You have {eventsForSelectedDay.length} event(s).</small>
            </div>
            <div>
              <button onClick={() => setSelectedDate(null)} className="btn btn-sm btn-outline-secondary">Close</button>
            </div>
          </div>

          <hr />

          <div id="eventsList" className="mb-3">
            {eventsForSelectedDay.length === 0 ? (
                <p>No events for this day.</p>
            ) : (
                <ul className="list-unstyled">
                    {eventsForSelectedDay.map(event => (
                        <li key={event._id}>
                            <strong>{event.title}</strong> at {event.time}
                        </li>
                    ))}
                </ul>
            )}
          </div>
          
          
        </div>
      );
  };

  return (
    <div className="calendar-wrap">
      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <button onClick={handlePrevMonth} className="btn btn-sm btn-outline-secondary me-2">&lt;</button>
          <button onClick={handleNextMonth} className="btn btn-sm btn-outline-secondary">&gt;</button>
        </div>
        <h4 id="monthYear" className="m-0">{monthYearLabel}</h4>
        <div>
          <button onClick={handleToday} className="btn btn-sm btn-outline-primary">Today</button>
        </div>
      </div>

      {/* Calendar Grid Structure */}
      <div id="calendar" className="border rounded p-2">
        {/* Day Headers */}
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', display: 'grid' }}>
          <div className="text-center fw-bold py-1">Sun</div>
          <div className="text-center fw-bold py-1">Mon</div>
          <div className="text-center fw-bold py-1">Tue</div>
          <div className="text-center fw-bold py-1">Wed</div>
          <div className="text-center fw-bold py-1">Thu</div>
          <div className="text-center fw-bold py-1">Fri</div>
          <div className="text-center fw-bold py-1">Sat</div>
        </div>
        
        {/* Render the Days here */}
        <div id="daysGrid" className="d-grid mt-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', display: 'grid' }}>
            {loading ? <div className="text-center py-5 col-span-7">Loading Calendar...</div> : renderCalendarDays()}
        </div>
      </div>
      
      {/* Selected Day Panel */}
      {renderDayPanel()}

    </div>
  );
}

export default CalendarTab;