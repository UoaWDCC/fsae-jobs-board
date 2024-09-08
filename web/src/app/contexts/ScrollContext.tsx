// ScrollContext.tsx
import React, { createContext, useContext, useRef } from 'react';

interface ScrollContextProps {
  scrollToGuide: (guide: string) => void;
  refs: {
    [key: string]: React.RefObject<HTMLDivElement>;
  };
}

const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const studentGuideRef = useRef<HTMLDivElement>(null);
  const sponsorGuideRef = useRef<HTMLDivElement>(null);
  const alumniGuideRef = useRef<HTMLDivElement>(null);

  const refs = {
    student: studentGuideRef,
    sponsor: sponsorGuideRef,
    alumni: alumniGuideRef,
  };

  const scrollToGuide = (guide: string) => {
    refs[guide]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ScrollContext.Provider value={{ scrollToGuide, refs }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};
