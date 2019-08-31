/* @format */

import { useState, useEffect } from 'react';

export default function useKeyCode(keyCode) {
  const [isKeyPressed, setKeyPressed] = useState();
  // Only allow fetching each keypress event once to prevent infinite loops
  if (isKeyPressed) {
    setKeyPressed(false);
  }

  useEffect(() => {
    function downHandler(event) {
      if (event.keyCode === keyCode) {
        event.preventDefault();
        setKeyPressed(true);
      }
    }
    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener('keydown', downHandler);
  }, [keyCode]);

  return isKeyPressed;
}

export function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (max !== null && value > max) {
    return max;
  }
  return value;
}
