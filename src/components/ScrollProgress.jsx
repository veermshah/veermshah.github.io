import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = (currentScroll / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    const animateProgress = () => {
      controls.start({ width: `${scrollProgress}%` });
    };

    window.addEventListener('scroll', handleScroll);
    animateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollProgress, controls]);

  return (
    <motion.div
      className="progress-bar"
      initial={{ width: '0%' }}
      animate={controls}
      style={{
        height: '5px',
        background: '#fa1153',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    />
  );
};

export default ScrollProgress;