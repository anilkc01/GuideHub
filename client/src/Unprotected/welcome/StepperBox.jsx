import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StepperBox = ({ steps }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full bg-white/5 backdrop-blur-2xl 
                    p-3 sm:p-5 lg:p-10 xl:p-14 
                    rounded-xl sm:rounded-2xl lg:rounded-[50px] 
                    border border-white/10 shadow-2xl
                    h-70 sm:h-80 lg:h-120 xl:h-135">
      <div className="relative flex flex-col gap-y-2.5 sm:gap-y-4 lg:gap-y-8 xl:gap-y-10 h-full justify-between">
        {/* The Vertical Line */}
        <div className="absolute left-1 sm:left-1.5 lg:left-2.75 top-1 sm:top-1.5 lg:top-2 bottom-1 sm:bottom-1.5 lg:bottom-2 w-0.5 bg-white/10" />
        <motion.div 
          className="absolute left-1 sm:left-1.5 lg:left-2.75 top-1 sm:top-1.5 lg:top-2 w-0.5 bg-white shadow-[0_0_10px_white]"
          animate={{ height: `${(current / (steps.length - 1)) * 95}%` }}
          transition={{ duration: 0.8 }}
        />
        
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start group">
            {/* Step Circle */}
            <div 
              className={`z-10 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-5 lg:h-5 xl:w-6 xl:h-6 
                         rounded-full border-2 shrink-0 transition-all duration-500 flex items-center justify-center
                         ${index <= current ? 'bg-white border-white' : 'bg-transparent border-white/20'}`}
            />
            
            {/* Text Content */}
            <div className="ml-2.5 sm:ml-4 lg:ml-8 xl:ml-10 -mt-0.5 sm:-mt-0.5 lg:-mt-1">
              <h3 className={`text-xs sm:text-sm lg:text-xl xl:text-[26px] 
                             font-serif transition-all duration-500 leading-tight
                             ${index === current ? 'text-white scale-105 origin-left' : 'text-white/30'}`}
              >
                {step.title}
              </h3>
              
              <AnimatePresence mode="wait">
                {index === current && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-gray-400 text-[10px] sm:text-xs lg:text-[15px] 
                              mt-0.5 sm:mt-1 lg:mt-2 
                              leading-relaxed max-w-full lg:max-w-87.5 overflow-hidden"
                  >
                    {step.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepperBox;