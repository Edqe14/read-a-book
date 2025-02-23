import { useEffect, useRef, useState } from 'react';

export type ScrollState = {
  y: number;
};

/**
 * Scroll direction hook.
 *
 * 1 = Downwards
 * -1 = Upward
 */
export const useScrollDirection = () => {
  const [direction, setDirection] = useState<null | 1 | -1>(null);
  const scrollState = useRef<ScrollState | null>(null);

  useEffect(() => {
    const aborter = new AbortController();

    window.addEventListener(
      'scroll',
      () => {
        const state = scrollState.current;

        if (state) {
          setDirection(window.scrollY > state.y ? 1 : -1);
        }

        scrollState.current = {
          y: window.scrollY,
        };
      },
      { signal: aborter.signal }
    );

    return () => {
      aborter.abort();
    };
  }, []);

  return direction;
};
