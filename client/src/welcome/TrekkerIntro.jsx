import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stepperData = [
  { title: "Sign Up", desc: "SignUp to our portal to explore the freelancing world of trekkers and guides." },
  { title: "Post your plan", desc: "Post your proposed plan, place, route, iternity and budget." },
  { title: "Plan your iternity", desc: "Chat with guides who wish to guide you and plan your iternity and budget." },
  { title: "Choose your Guide", desc: "Pick a guide with best idea, budget and good for you." },
  { title: "Go to Trek", desc: "Hit the trail with the guide you choose." },
  { title: "Review", desc: "Leave review of your guide and post blogs of your trek." },
];

const TrekkerWelcome = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stepperData.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black font-['Poppins'] select-none">
      
      {/* Background Image with Ken Burns Effect */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/trekker.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 h-full w-full flex items-center justify-between px-24 lg:px-32"
      >
        
        {/* Left Side: Text Content */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-[clamp(60px,8vw,100px)] font-bold text-white leading-[0.9] font-serif drop-shadow-2xl">
              Join as Trekker
            </h1>
            <p className="text-white/70 text-2xl font-light italic ml-2">
              Start your Himalayan adventure today.
            </p>
          </div>
          <button className="w-fit mt-8 px-14 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-2xl font-medium hover:bg-white hover:text-black transition-all duration-500 shadow-xl">
            Get Started
          </button>
        </div>

        {/* Right Side: Material-Style Vertical Stepper */}
        <div className="w-[580px] bg-black/40 backdrop-blur-2xl p-14 rounded-[50px] border border-white/10 shadow-2xl">
          <div className="relative flex flex-col gap-y-10">
            
            {/* The Vertical Line (Material Style) */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/10" />
            <motion.div 
              className="absolute left-[11px] top-2 w-[2px] bg-white shadow-[0_0_10px_white]"
              animate={{ height: `${(current / (stepperData.length - 1)) * 95}%` }}
              transition={{ duration: 0.8 }}
            />

            {stepperData.map((step, index) => (
              <div key={index} className="relative flex items-start group">
                
                {/* Step Circle */}
                <div 
                  className={`z-10 w-6 h-6 rounded-full border-2 shrink-0 transition-all duration-500 flex items-center justify-center
                  ${index <= current ? 'bg-white border-white' : 'bg-transparent border-white/20'}`}
                >
                  {index < current && (
                    <span className="text-black text-[10px] font-bold"></span>
                  )}
                </div>

                {/* Text Content */}
                <div className="ml-10 -mt-1">
                  <h3 className={`text-[26px] font-serif transition-all duration-500 leading-tight
                    ${index === current ? 'text-white scale-105 origin-left' : 'text-white/30'}`}
                  >
                    {step.title}
                  </h3>
                  
                  <AnimatePresence>
                    {index === current && (
                      <motion.p 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-gray-400 text-[15px] mt-2 leading-relaxed max-w-[350px] overflow-hidden"
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
      </motion.div>

      {/* Down Arrow */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5 animate-bounce">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </div>

    </div>
  );
};

export default TrekkerWelcome;