import React, { useEffect } from "react";

export const WPM = ({ isActive, isPaused, wordsNumber, wpm, setWpm }) => {

  useEffect(() => {
    let interval = null;
    let time = 0;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        time += 50;
        setWpm(Math.round((wordsNumber / time) * 1000 * 60));
      }, 50);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  return <></>;
};
