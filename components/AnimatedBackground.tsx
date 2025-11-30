import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none bg-background">
      {/* Deep Atmosphere Base */}
      <div className="absolute inset-0 bg-[#050507]"></div>
      
      {/* Moving Aurora 1 (Violet) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-violet-900/30 rounded-full blur-[120px] animate-aurora mix-blend-screen opacity-40"></div>
      
      {/* Moving Aurora 2 (Fuchsia) */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/20 rounded-full blur-[120px] animate-aurora animation-delay-2000 mix-blend-screen opacity-40"></div>
      
      {/* Floating Orbs for Depth */}
      <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-indigo-500/10 rounded-full blur-[100px] animate-float opacity-30"></div>
      <div className="absolute bottom-[20%] left-[20%] w-[25vw] h-[25vw] bg-pink-500/10 rounded-full blur-[100px] animate-float animation-delay-4000 opacity-30"></div>

      {/* Cinematic Film Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay animate-grain" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px'
      }}></div>
      
      {/* CSS for custom grain animation if not in tailwind config */}
      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;