import React, { useState, useEffect } from 'react';

const IntroPage = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black select-none">
      
      {/* Background Image - Frame 1 Style */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000"
        style={{ backgroundImage: `url('/intro.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content Container */}
      <div className={`relative z-10 h-full w-full flex items-center justify-between px-20 lg:px-32 transition-all duration-1000 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* Left Content: Heading & Subtitle */}
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-[96px] font-bold text-white leading-none font-serif drop-shadow-2xl">
            Explore Nepal
          </h1>
          <h2 className="text-[42px] text-white/90 font-light italic font-serif">
            With Freedom and Trust
          </h2>
        </div>

        {/* Right Content: The 50% Opacity Box */}
        <div className="bg-black/50  p-14 rounded-[40px] border border-white/10 max-w-145 shadow-2xl mr-10 transition-all duration-1000 delay-300">
          <p className="text-[22px] text-white/95 leading-relaxed font-light font-sans">
            <strong className="text-2xl block mb-4 font-bold not-italic">Your journey, your rules.</strong>
            Plan freely, choose the right guide, and experience the Himalayas beyond fixed packages and rigid schedules.
          </p>
        </div>
      </div>

      {/* Center Down Arrow */}
      <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-md animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </div>

    </div>
  );
};

export default IntroPage;