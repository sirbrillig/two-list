/* @format */

import { useEffect } from 'react';

export default function useKeyCode(code, callback) {
  useEffect(() => {
    const downHandler = event => {
      if (event.keyCode === code) {
        callback();
      }
    };
    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener('keydown', downHandler);
  }, [code, callback]);
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
