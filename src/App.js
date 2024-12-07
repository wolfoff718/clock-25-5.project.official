import React, { useState, useEffect, useRef  } from 'react';
import './App.css';

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isSession, setIsSession] = useState(true);  
  const [isActive, setIsActive] = useState(false); 

  const beepRef = useRef(null);

  const playBeep = () => {
    const beepSound = beepRef.current;
    if (beepSound && beepSound.readyState >= 2) { // Verifica que el audio esté listo
      beepSound.currentTime = 0; 
      beepSound.play().catch((error) => {
        console.log("Error al intentar reproducir el sonido:", error);
      });
    }
  };

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            playBeep();
            if (isSession) {
              
              setIsSession(false);
              return breakLength * 60;
            } else {
              
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionLength, breakLength, isSession]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setIsSession(true);
    
    const beep = beepRef.current;
    beep.pause();
    beep.currentTime = 0;  
  };
    
  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const incrementBreak = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return ( 
    <div className="App">
      <div className="control-container">
        <div>
          <div id="session-label">Session Length</div>
          <div id="session-length">{sessionLength}</div>
        <div className="button-container">
          <button id="session-decrement" onClick={decrementSession}>-</button>
          <button id="session-increment" onClick={incrementSession}>+</button>
          </div>
        </div>

        <div>
          <div id="break-label">Break Length</div>
          <div id="break-length">{breakLength}</div>
        <div className="button-container">
          <button id="break-decrement" onClick={decrementBreak}>-</button>
          <button id="break-increment" onClick={incrementBreak}>+</button>
        </div>
        </div>
      </div>

      <div id="timer-label">{isSession ? "Session" : "Break"}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

    <div className="controls">
      <button id="start_stop" onClick={handleStartStop}>{isActive ? "Pause" : "Start"}</button>
      <button id="reset" onClick={handleReset}>Reset</button>
      </div>

      <audio id="beep" ref={beepRef} src="/audio/beep.mp3" preload="auto"></audio>
    </div>
  );
}

export default App;