import React from 'react';
import { Cloud } from './components/Cloud';
import { ParallaxSection } from './components/ParallaxSection';
import { RaycastEffect } from './components/RaycastEffect';
import { CursorEffect } from './components/CursorEffect';
import { Sparkles, ArrowDown } from 'lucide-react';

function App() {
  const clouds = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      delay: i * 1.2,
      scale: 0.3 + Math.random() * 1.4,
      opacity: 0.12 + Math.random() * 0.18,
      speed: 0.1 + Math.random() * 0.2,
      initialY: Math.random() * window.innerHeight * 1.2,
      rotation: -15 + Math.random() * 30
    }));
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#FF6B6B] via-[#FFA5A5] to-[#FFE2E2] z-0" />

      {/* Clouds */}
      {clouds.map((cloud, i) => (
        <Cloud
          key={i}
          delay={cloud.delay}
          scale={cloud.scale}
          opacity={cloud.opacity}
          speed={cloud.speed}
          initialY={cloud.initialY}
          rotation={cloud.rotation}
        />
      ))}

      {/* Effects */}
      <RaycastEffect />
      <CursorEffect />

      {/* Content */}
      <div className="relative z-20">
        <ParallaxSection speed={-0.5} className="min-h-screen flex items-center justify-center">
          <div className="text-center px-4">
            <div className="mb-6 flex justify-center">
              <Sparkles className="w-16 h-16 text-white animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              AsterIsland
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              Discover a new dimension of digital experiences where innovation meets imagination
            </p>
          </div>
        </ParallaxSection>

        <ParallaxSection speed={-0.3} className="min-h-screen flex items-center justify-center">
          <div className="text-center px-4 py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: 'Innovative',
                  description: 'Pushing boundaries with cutting-edge technology',
                },
                {
                  title: 'Creative',
                  description: 'Where artistry meets digital excellence',
                },
                {
                  title: 'Dynamic',
                  description: 'Responsive and evolving experiences',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/80 font-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ParallaxSection>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <ArrowDown className="w-8 h-8 text-white/70" />
        </div>
      </div>
    </div>
  );
}

export default App;