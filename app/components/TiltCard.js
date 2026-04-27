"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export function TiltCard({ children, className = "", multiplier = 15 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${multiplier}deg`, `-${multiplier}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${multiplier}deg`, `${multiplier}deg`]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative perspective-1000 ${className}`}
    >
      <div 
        style={{
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative"
      >
        {children}
      </div>
    </motion.div>
  );
}

export function SpatialLayer({ children, className = "", depth = 50 }) {
  return (
    <div 
      className={`relative z-10 ${className}`}
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: "preserve-3d"
      }}
    >
      {children}
    </div>
  );
}
