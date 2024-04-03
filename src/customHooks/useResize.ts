import { useState, useEffect } from 'react';

type Screen = {
  height?: number;
  width?: number;
  isMobile?: boolean;
};

export const useResize = () => {
  const mobileWidth = 576;
  const [windowSize, setWindowSize] = useState<Screen>({
    height: undefined,
    width: undefined,
    isMobile: undefined
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
        isMobile: window.innerWidth < mobileWidth
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
