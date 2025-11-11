// src/components/CalendarTab.js

import React, { useState, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap'; 
import '../App.css';

const formatDate = (date) => date.toISOString().split('T')[0];

function CalendarTab({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState(null);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }, [currentDate]);

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`pad-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dateString = formatDate(dayDate);
      
      const isToday = formatDate(new Date()) === dateString;
      const isSelected = selectedDate && formatDate(selectedDate) === dateString;

      const tasksForDay = tasks.filter(task => task.date === dateString);
      
      daysArray.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          // ** ГОЛ 1: Встановлюємо вибрану дату при кліку **
          onClick={() => setSelectedDate(dayDate)} 
        >
          <span className="day-number">{day}</span>
          
          {/* ** ГОЛ 2: Відображення назв завдань у комірці ** */}
          <div className="tasks-in-cell">
            {tasksForDay.slice(0, 2).map(task => ( // Показуємо макс. 2 завдання
              <div key={task._id} className="task-preview" title={task.text}>
                {task.text}
              </div>
            ))}
            {tasksForDay.length > 2 && ( // Якщо завдань більше
              <div className="task-preview-more">
                ...
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div id="calendar" className="border rounded p-2">
        <div className="d-grid calendar-day-headers">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div id="daysGrid" className="d-grid calendar-grid mt-1">
          {daysArray}
        </div>
      </div>
    );
  };

  // --- ** ГОЛ 1: Рендеринг бічної панелі ** ---
  const renderTaskSidebar = () => {
    if (!selectedDate) return null; // Не рендеримо, якщо дата не вибрана

    const dateString = formatDate(selectedDate);
    const tasksForDay = tasks.filter(task => task.date === dateString);

    return (
      <div className="task-sidebar border rounded p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h5>
          <button 
            className="btn-close" 
            onClick={() => setSelectedDate(null)} 
          ></button>
        </div>

        {tasksForDay.length === 0 ? (
          <div className="alert alert-info">No tasks for this day.</div>
        ) : (
          <ul className="list-group">
            {tasksForDay.map(task => (
              <li 
                key={task._id} 
                className={`list-group-item ${task.completed ? 'list-group-item-success' : ''}`}
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              >
                {task.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button onClick={handlePrevMonth} className="btn btn-sm btn-outline-secondary me-2">&lt;</button>
          <button onClick={handleNextMonth} className="btn btn-sm btn-outline-secondary">&gt;</button>
        </div>
        <h4 id="monthYear" className="m-0 micro-5-regular">{monthYearLabel}</h4>
        <div>
          <button onClick={handleToday} className="btn btn-sm btn-outline-primary">Today</button>
        </div>
      </div>

      <Row>
        <Col md={selectedDate ? 8 : 12} className="calendar-container">
          {renderDays()}
        </Col>
        {selectedDate && (
          <Col md={4} className="sidebar-container">
            {renderTaskSidebar()}
          </Col>
        )}
      </Row>
    </div>
  );
}

export default CalendarTab;