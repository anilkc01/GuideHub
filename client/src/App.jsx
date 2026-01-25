import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroPage from './welcome/IntroPage';
import TrekkerWelcome from './welcome/TrekkerIntro';
import GuideWelcome from './welcome/guideIntro';


const App = () => {
  const [page, setPage] = useState(0); 
  const isScrolling = useRef(false);

  const handleWheel = (e) => {
    if (isScrolling.current) return;

    // Scroll Down
    if (e.deltaY > 0 && page < 2) {
      lockScroll();
      setPage(prev => prev + 1);
    } 
    // Scroll Up
    else if (e.deltaY < 0 && page > 0) {
      lockScroll();
      setPage(prev => prev - 1);
    }
  };

  const lockScroll = () => {
    isScrolling.current = true;
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000); 
  };

  return (
    <div 
      onWheel={handleWheel} 
      className="h-screen w-screen bg-black overflow-hidden touch-none select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full w-full"
        >
          {page === 0 && <IntroPage />}
          {page === 1 && <TrekkerWelcome />}
          {page === 2 && <GuideWelcome />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {[0, 1, 2].map((idx) => (
          <div 
            key={idx}
            className={`w-1.5 rounded-full transition-all duration-500 
              ${page === idx ? 'bg-white h-8' : 'bg-white/20 h-1.5'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default App;