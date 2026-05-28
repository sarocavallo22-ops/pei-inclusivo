import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return isMobile;
}
