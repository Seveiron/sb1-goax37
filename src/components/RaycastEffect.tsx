import React, { useEffect, useRef } from 'react';

export const RaycastEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color palettes for ethereal sunset rays
    const rayColors = [
      { start: 'rgba(255, 255, 255, ', mid: 'rgba(255, 233, 213, ', end: 'rgba(255, 183, 143, ' },
      { start: 'rgba(255, 241, 230, ', mid: 'rgba(255, 210, 161, ', end: 'rgba(255, 140, 120, ' },
      { start: 'rgba(255, 226, 226, ', mid: 'rgba(255, 190, 190, ', end: 'rgba(255, 150, 150, ' },
      { start: 'rgba(255, 218, 233, ', mid: 'rgba(255, 182, 193, ', end: 'rgba(255, 130, 170, ' },
    ];

    const rays: Array<{
      x: number;
      y: number;
      width: number;
      length: number;
      angle: number;
      speed: number;
      opacity: number;
      colorIndex: number;
      spread: number;
    }> = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: -100 - Math.random() * 200,
      width: 30 + Math.random() * 50,
      length: 800 + Math.random() * 600,
      angle: (Math.PI / 24) + (Math.random() * Math.PI / 12),
      speed: 0.05 + Math.random() * 0.15,
      opacity: 0.05 + Math.random() * 0.15,
      colorIndex: Math.floor(Math.random() * rayColors.length),
      spread: 1.5 + Math.random() * 1.5
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rays.forEach((ray) => {
        ctx.save();
        ctx.translate(ray.x, ray.y);
        ctx.rotate(ray.angle);
        
        const colors = rayColors[ray.colorIndex];
        const gradient = ctx.createLinearGradient(0, 0, 0, ray.length);
        
        // Create more complex gradient with multiple color stops
        gradient.addColorStop(0, colors.start + ray.opacity + ')');
        gradient.addColorStop(0.3, colors.mid + (ray.opacity * 0.7) + ')');
        gradient.addColorStop(0.7, colors.end + (ray.opacity * 0.4) + ')');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // Create a more natural, curved shape for the ray
        ctx.beginPath();
        ctx.moveTo(-ray.width / 2, 0);
        ctx.lineTo(ray.width / 2, 0);
        
        // Use quadratic curves for more natural ray spread
        ctx.quadraticCurveTo(
          ray.width * ray.spread, 
          ray.length * 0.6, 
          ray.width * ray.spread * 1.5, 
          ray.length
        );
        ctx.quadraticCurveTo(
          0,
          ray.length * 0.8,
          -ray.width * ray.spread * 1.5,
          ray.length
        );
        
        ctx.closePath();
        
        // Add blur effect
        ctx.filter = `blur(${ray.width * 0.1}px)`;
        ctx.globalCompositeOperation = 'screen';
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ray.y += ray.speed;
        if (ray.y > -100) {
          ray.y = -200 - Math.random() * 200;
          ray.x = Math.random() * canvas.width;
          ray.opacity = 0.05 + Math.random() * 0.15;
          ray.colorIndex = Math.floor(Math.random() * rayColors.length);
          ray.spread = 1.5 + Math.random() * 1.5;
        }
        
        ctx.restore();
      });
      
      requestAnimationFrame(animate);
    };

    const animation = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};