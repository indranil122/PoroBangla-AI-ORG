import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none bg-[#050505]">
      {/* Base Black */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Starfield Layer */}
      <div id="stars1" className="absolute inset-0"></div>
      <div id="stars2" className="absolute inset-0"></div>
      <div id="stars3" className="absolute inset-0"></div>

      {/* Nebula/Glow Layer */}
      <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-gradient-radial from-[#F3C567]/10 via-[#F3C567]/5 to-transparent rounded-full animate-pulse-slow blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-gradient-radial from-[#8A8F94]/10 via-[#8A8F94]/5 to-transparent rounded-full animate-pulse-slow animation-delay-2000 blur-3xl"></div>

      <style>{`
        @keyframes move-twink-back {
            from {background-position:0 0;}
            to {background-position:-10000px 5000px;}
        }
        #stars1, #stars2, #stars3 {
            width:100%;
            height:100%;
            position:absolute;
            top:0;
            left:0;
            background:transparent;
            background-repeat:repeat;
        }
        #stars1 {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cstyle%3E .star%7B fill: rgba(243, 197, 103, 0.4); animation: twinkle 3s infinite ease-in-out; transform-origin: center; %7D @keyframes twinkle %7B 0%25, 100%25 %7B transform: scale(0.8); opacity: 0.4;%7D 50%25 %7B transform: scale(1.2); opacity: 0.8;%7D %7D %3C/style%3E%3C/defs%3E%3Ccircle class='star' cx='5%25' cy='10%25' r='1'/%3E%3Ccircle class='star' cx='15%25' cy='30%25' r='1'/%3E%3Ccircle class='star' cx='25%25' cy='5%25' r='0.5'/%3E%3Ccircle class='star' cx='45%25' cy='50%25' r='1'/%3E%3Ccircle class='star' cx='60%25' cy='20%25' r='0.5'/%3E%3Ccircle class='star' cx='75%25' cy='60%25' r='1'/%3E%3Ccircle class='star' cx='90%25' cy='40%25' r='0.5'/%3E%3Ccircle class='star' cx='95%25' cy='80%25' r='1'/%3E%3C/svg%3E");
            background-size: 1600px 1600px;
            animation: move-twink-back 200s linear infinite;
        }
        #stars2 {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cstyle%3E .star%7B fill: rgba(200, 204, 209, 0.4); animation: twinkle 4s infinite ease-in-out; animation-delay: 1s; transform-origin: center; %7D @keyframes twinkle %7B 0%25, 100%25 %7B transform: scale(0.6); opacity: 0.3;%7D 50%25 %7B transform: scale(1); opacity: 0.7;%7D %7D %3C/style%3E%3C/defs%3E%3Ccircle class='star' cx='10%25' cy='70%25' r='0.5'/%3E%3Ccircle class='star' cx='30%25' cy='90%25' r='0.5'/%3E%3Ccircle class='star' cx='50%25' cy='40%25' r='1'/%3E%3Ccircle class='star' cx='65%25' cy='85%25' r='0.5'/%3E%3Ccircle class='star' cx='80%25' cy='15%25' r='1'/%3E%3C/svg%3E");
            background-size: 1200px 1200px;
            animation: move-twink-back 150s linear infinite;
        }
        #stars3 {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cstyle%3E .star%7B fill: rgba(248, 248, 248, 0.3); animation: twinkle 5s infinite ease-in-out; animation-delay: 2s; transform-origin: center; %7D @keyframes twinkle %7B 0%25, 100%25 %7B transform: scale(0.4); opacity: 0.2;%7D 50%25 %7B transform: scale(0.8); opacity: 0.5;%7D %7D %3C/style%3E%3C/defs%3E%3Ccircle class='star' cx='20%25' cy='50%25' r='0.5'/%3E%3Ccircle class='star' cx='40%25' cy='80%25' r='0.5'/%3E%3Ccircle class='star' cx='70%25' cy='30%25' r='0.5'/%3E%3Ccircle class='star' cx='85%25' cy='95%25' r='0.5'/%3E%3C/svg%3E");
            background-size: 800px 800px;
            animation: move-twink-back 100s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;