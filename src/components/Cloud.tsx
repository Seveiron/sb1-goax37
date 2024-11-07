import React from 'react';
import { useEffect, useRef } from 'react';

interface CloudProps {
  delay: number;
  scale: number;
  opacity: number;
  speed: number;
  initialY: number;
  rotation: number;
}

export const Cloud: React.FC<CloudProps> = ({ 
  delay, 
  scale, 
  opacity, 
  speed, 
  initialY,
  rotation 
}) => {
  const cloudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cloudRef.current;
    if (!element) return;

    const startPosition = -200 - (delay * 200); // Increased spacing between clouds
    element.style.transform = `translate(${startPosition}px, ${initialY}px) scale(${scale}) rotate(${rotation}deg)`;

    const animate = () => {
      const currentTransform = getComputedStyle(element).transform;
      const matrix = new DOMMatrix(currentTransform);
      const currentX = matrix.m41;
      
      if (currentX > window.innerWidth + 200) {
        // Reset position with random vertical position
        const newY = Math.random() * window.innerHeight * 1.2;
        element.style.transform = `translate(${startPosition}px, ${newY}px) scale(${scale}) rotate(${rotation}deg)`;
      } else {
        element.style.transform = `translate(${currentX + speed}px, ${initialY}px) scale(${scale}) rotate(${rotation}deg)`;
      }
      
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [delay, scale, speed, initialY, rotation]);

  return (
    <div
      ref={cloudRef}
      className="fixed cloud"
      style={{
        opacity,
        filter: `blur(${2 * scale}px) contrast(0.9)`, // Adjusted blur and contrast
        transition: 'transform 0.1s linear',
        zIndex: Math.floor(scale * 10),
      }}
    >
      <div className="relative">
        <div className="w-40 h-28 bg-gradient-to-b from-white/70 to-white/30 rounded-[100%] relative backdrop-blur-sm">
          <div className="absolute w-32 h-24 bg-gradient-to-b from-white/60 to-white/20 rounded-[100%] -top-8 -left-6" />
          <div className="absolute w-36 h-24 bg-gradient-to-b from-white/50 to-white/15 rounded-[100%] -top-4 left-16" />
          <div className="absolute w-28 h-20 bg-gradient-to-b from-white/40 to-white/10 rounded-[100%] top-6 -left-4" />
          <div className="absolute w-24 h-16 bg-gradient-to-b from-white/30 to-white/5 rounded-[100%] top-8 left-20" />
        </div>
      </div>
    </div>
  );
};