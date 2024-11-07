import React from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed: number;
  className?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed,
  className = '',
}) => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{
        transform: `translateY(${offset * speed}px)`,
        transition: 'transform 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      }}
    >
      {children}
    </div>
  );
};