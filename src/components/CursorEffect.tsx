import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;  // Add color property for each particle
}

export const CursorEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const frameRef = useRef<number>(0);

  // Function to generate various hues of white
  const getWhiteShade = (): string => {
    // Generate a random variation between 240 and 255 for RGB values (close to white)
    const r = 255; // Keep the red channel full white
    const g = Math.random() * 15 + 240; // Slight variation on green
    const b = Math.random() * 15 + 240; // Slight variation on blue

    // Return the color in rgba format with full opacity (255, 255, 255 is white)
    return `rgba(${r}, ${Math.round(g)}, ${Math.round(b)}, 0.7)`; // Opacity set to 0.7 for visual effect
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Particle creation
    const createParticle = (x: number, y: number, dx: number, dy: number): Particle => {
      const speed = Math.random() * 2 + 1; // Speed of the particle
      return {
        x,
        y,
        dx: dx * speed,  // Directional velocity towards the cursor path
        dy: dy * speed,  // Directional velocity towards the cursor path
        size: Math.random() * 3 + 2, // Size of the particle
        life: 0,
        maxLife: Math.random() * 80 + 60, // Random lifespan of the particle
        color: getWhiteShade(), // Assign a random white shade to each particle
      };
    };

    // Animation loop for particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Calculate movement of mouse
      const dx = mouseRef.current.x - mouseRef.current.prevX;
      const dy = mouseRef.current.y - mouseRef.current.prevY;

      // Emit particles along the path the cursor creates
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        const particleCount = Math.min(Math.floor(Math.hypot(dx, dy) / 3), 10); // More particles for larger movement
        for (let i = 0; i < particleCount; i++) {
          // Particle positions along the movement path
          const pathSegmentRatio = i / particleCount;
          const particleX = mouseRef.current.prevX + dx * pathSegmentRatio;
          const particleY = mouseRef.current.prevY + dy * pathSegmentRatio;

          // Sideways movement by adjusting the angle
          const angle = Math.atan2(dy, dx); // Calculate the angle of movement
          const angleVariance = Math.random() * Math.PI / 3 - Math.PI / 6; // Randomly rotate particles between -30 and +30 degrees
          const rotatedAngle = angle + angleVariance; // Apply the angle variance

          // Calculate new direction (sideways effect)
          const sideDx = Math.cos(rotatedAngle);
          const sideDy = Math.sin(rotatedAngle);

          // Add particles flowing sideways but still following the cursor path
          particlesRef.current.push(createParticle(
            particleX,  // Start position of particle
            particleY,  // Start position of particle
            sideDx,  // Sideways direction (adjusted by angle)
            sideDy   // Sideways direction (adjusted by angle)
          ));
        }
      }

      // Update particles and remove the ones that fade out
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life++;

        const opacity = Math.max(0, 1 - particle.life / particle.maxLife); // Fade effect
        const size = Math.max(0.1, particle.size * (1 - particle.life / particle.maxLife)); // Shrink effect

        if (size > 0) {
          // Draw the particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace('0.7', `${opacity}`); // Apply opacity to the color
          ctx.fill();

          // Apply glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = particle.color;
        }

        return particle.life < particle.maxLife; // Remove expired particles
      });

      // Draw cursor glow
      const cursorSize = 20;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, cursorSize, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        cursorSize
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Update previous mouse position for the next frame
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;

      // Request the next animation frame
      frameRef.current = requestAnimationFrame(animate);
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        ...mouseRef.current,
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Initialize mouse position
    mouseRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prevX: window.innerWidth / 2,
      prevY: window.innerHeight / 2,
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 50 }}
    />
  );
};
