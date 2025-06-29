import React, { useEffect, useState, useRef } from 'react';

const beepSoundUrl = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

const QuestionTimer = ({ duration, onTimeUp, resetTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const beepAudio = useRef(null);

  // Reset timer on duration or resetTrigger change
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetTrigger]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }
    if (timeLeft <= 5 && timeLeft > 0) {
      beepAudio.current.play().catch(() => {});
    }

    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, onTimeUp]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 50,   // yahan se adjust kar sakte ho position
      right: 20,
      backgroundColor: 'white',
      padding: '8px 16px',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.15)',
      fontWeight: 'bold',
      fontSize: '18px',
      userSelect: 'none',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span role="img" aria-label="timer">⏰</span> {timeLeft}s
      <audio ref={beepAudio} src={beepSoundUrl} preload="auto" />
    </div>
  );
};

export default QuestionTimer;
