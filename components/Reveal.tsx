import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'epic';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  duration = 1000,
  className = '',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up': return 'animate-fade-in-up';
      case 'fade-in': return 'animate-fade-in';
      case 'slide-left': return 'animate-slide-in-left';
      case 'slide-right': return 'animate-slide-in-right';
      case 'scale': return 'animate-scale-in';
      case 'epic': return 'animate-epic-reveal';
      default: return 'animate-fade-in-up';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`will-change-transform ${className} ${isVisible ? getAnimationClass() : 'opacity-0'}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;