import { useState, useEffect } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | undefined;

const useBreakPoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setBreakpoint(identifyBreakpoint(window.innerWidth));
      };

      window.addEventListener('resize', handleResize);

      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { breakpoint };
};

export const identifyBreakpoint = (width: number): Breakpoint => {
  if (width >= 768 && width < 1024) {
    return 'md';
  }
  if (width >= 1024 && width < 1280) {
    return 'lg';
  }
  if (width >= 1280 && width < 1440) {
    return 'xl';
  }
  if (width >= 1440 && width < 1600) {
    return '2xl';
  }
  if (width >= 1600) {
    return '3xl';
  }
  return 'sm';
};

export default useBreakPoint;
