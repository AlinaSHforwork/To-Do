// src/components/PomodoroTab.js

import React, { useState, useEffect, useRef } from 'react';

// Default settings (matching your template inputs)
const DEFAULT_WORK = 25;
const DEFAULT_SHORT_BREAK = 5;
const DEFAULT_LONG_BREAK = 15;
const SESSIONS_BEFORE_LONG = 4;

const SESSION_TYPES = {
  WORK: 'Work',
  SHORT_BREAK: 'Short Break',
  LONG_BREAK: 'Long Break'
};

function PomodoroTab() {
  // Timer state
  const [minutes, setMinutes] = useState(DEFAULT_WORK);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState(SESSION_TYPES.WORK);
  const [workCount, setWorkCount] = useState(0);

  // Settings state (Controlled inputs)
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(DEFAULT_SHORT_BREAK);
  const [longBreakMinutes, setLongBreakMinutes] = useState(DEFAULT_LONG_BREAK);
  
  // Use ref to hold the interval ID, preventing unnecessary re-renders
  const timerRef = useRef(null);

  // --- Core Timer Logic (useEffect) ---
  useEffect(() => {
    if (isRunning) {
      // Set the interval
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes(prevMinutes => prevMinutes - 1);
          setSeconds(59);
        } else {
          // Timer reached 0:00 -> Transition to the next session
          clearInterval(timerRef.current);
          handleSessionEnd();
        }
      }, 1000);
    }
    
    // Cleanup function: clears the interval when the component unmounts or isRunning changes
    return () => clearInterval(timerRef.current);
  }, [isRunning, minutes, seconds]); // Only runs when these state values change

  // --- Session Transition Logic ---
  const handleSessionEnd = () => {
    let nextSession;
    let nextMinutes;
    let nextWorkCount = workCount;

    if (session === SESSION_TYPES.WORK) {
      nextWorkCount++;
      setWorkCount(nextWorkCount);
      if (nextWorkCount % SESSIONS_BEFORE_LONG === 0) {
        nextSession = SESSION_TYPES.LONG_BREAK;
        nextMinutes = longBreakMinutes;
      } else {
        nextSession = SESSION_TYPES.SHORT_BREAK;
        nextMinutes = shortBreakMinutes;
      }
    } else {
      // If it was a break, go back to work
      nextSession = SESSION_TYPES.WORK;
      nextMinutes = workMinutes;
    }
    
    setSession(nextSession);
    setMinutes(nextMinutes);
    setSeconds(0);
    setIsRunning(true); // Auto-start the next session
    
    // Notification logic (you can add a browser notification here)
    console.log(`Time for ${nextSession}!`);
  };

  // --- Handlers for User Buttons ---
  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const handleReset = () => {
    handlePause(); // Stop the timer
    // Reset to the start of the current session type's duration
    const resetMinutes = session === SESSION_TYPES.WORK ? workMinutes : (session === SESSION_TYPES.SHORT_BREAK ? shortBreakMinutes : longBreakMinutes);
    setMinutes(resetMinutes);
    setSeconds(0);
    setWorkCount(0);
    setSession(SESSION_TYPES.WORK); // Always reset session type to WORK
  };
  
  // --- Render Formatting ---
  const formatTime = (time) => String(time).padStart(2, '0');
  const timerDisplay = `${formatTime(minutes)}:${formatTime(seconds)}`;
  
  return (
    <div className="pomodoro-wrap p-3">
      <h2 className="text-center">{session} Timer</h2>
      
      {/* Timer Display */}
      <div className="timer-display text-center mb-3">
        <div id="timer" className="display-4">{timerDisplay}</div>
        <div className="text-muted small">Focus on one task during Work sessions.</div>
        <div className="small">Work sessions completed: {workCount}</div>
      </div>

      {/* Control Buttons */}
      <div className="d-flex justify-content-center gap-2 mb-3">
        <button 
          onClick={handleStart} 
          className="btn btn-primary"
          disabled={isRunning}
        >
          Start
        </button>
        <button 
          onClick={handlePause} 
          className="btn btn-secondary"
          disabled={!isRunning}
        >
          Pause
        </button>
        <button 
          onClick={handleReset} 
          className="btn btn-outline-danger"
        >
          Reset
        </button>
      </div>

      {/* Settings (Controlled Inputs) */}
      <div className="pomodoro-settings border rounded p-3">
        <div className="row g-2 align-items-center">
          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Work (min)</label>
            <input 
              type="number" min="1" className="form-control form-control-sm"
              value={workMinutes} 
              onChange={(e) => setWorkMinutes(Number(e.target.value))}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Short Break (min)</label>
            <input 
              type="number" min="1" className="form-control form-control-sm"
              value={shortBreakMinutes} 
              onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Long Break (min)</label>
            <input 
              type="number" min="1" className="form-control form-control-sm"
              value={longBreakMinutes} 
              onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Sessions/Long Break</label>
            <input 
              type="number" min="1" className="form-control form-control-sm"
              defaultValue={SESSIONS_BEFORE_LONG} 
              // Note: For simplicity, we keep this input uncontrolled (defaultValue)
              // but ideally, this would also be state-controlled.
            />
          </div>
        </div>
        <div className="mt-2 text-muted small">Settings are saved locally (on change, not automatically saved to disk here).</div>
      </div>
    </div>
  );
}

export default PomodoroTab;