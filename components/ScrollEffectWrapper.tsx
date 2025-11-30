import React, { ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity, useMotionTemplate } from "framer-motion";

interface ScrollEffectWrapperProps {
  children: ReactNode;
}

const ScrollEffectWrapper: React.FC<ScrollEffectWrapperProps> = ({ children }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth out the velocity value to prevent jitter
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300
  });

  // Calculate skew: moves slightly vertically based on speed (max 1 degree)
  // Positive velocity = skew one way, negative = skew other
  const skewY = useTransform(smoothVelocity, [-3000, 3000], [1, -1]); 
  
  // Calculate blur: 0 at rest, up to 2px at high speed to maintain readability
  // We transform both negative (scrolling up) and positive (scrolling down) velocity to a positive blur value
  const blurValue = useTransform(smoothVelocity, [-3000, 0, 3000], [2, 0, 2]);
  const filter = useMotionTemplate`blur(${blurValue}px)`;
  
  // Opacity: Slight dimming at extreme speeds for effect
  const opacity = useTransform(smoothVelocity, [-5000, 0, 5000], [0.9, 1, 0.9]);

  return (
    <motion.div 
      style={{ skewY, filter, opacity }} 
      className="will-change-transform origin-center bg-transparent"
    >
      {children}
    </motion.div>
  );
};

export default ScrollEffectWrapper;