import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none bg-background">
      {/* Deep Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#0a0a0f] to-[#050507]"></div>
      
      {/* Aurora Beams - Top Left */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[60vh] bg-violet-900/20 rounded-full blur-[120px] animate-aurora mix-blend-screen opacity-60"></div>
      
      {/* Aurora Beams - Bottom Right */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[60vh] bg-fuchsia-900/10 rounded-full blur-[100px] animate-aurora animation-delay-2000 mix-blend-screen opacity-50"></div>
      
      {/* Accent Glow - Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-indigo-900/10 rounded-full blur-[150px] animate-pulse-slow"></div>

      {/* Noise Texture Overlay for that "Film Grain" premium feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
      }}></div>
    </div>
  );
};

export default AnimatedBackground;