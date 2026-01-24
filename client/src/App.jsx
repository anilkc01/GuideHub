import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Parallax, Mousewheel } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import './App.css';

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef(null);

  // Auto-play stepper logic - only runs on slides 1 and 2 (trekker/guide)
  useEffect(() => {
    if (activeSlide === 0) return; // Don't run on intro slide
    
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(timer);
  }, [activeSlide]);

  // Reset stepper when changing slides
  useEffect(() => {
    setActiveStep(0);
  }, [activeSlide]);

  const slides = [
    {
      id: 1,
      type: "intro",
      title: ["Explore ", "Nepal"],
      subtitle: "With Freedom & Trust",
      page: "The Platform",
      text: "A modern platform that connects trekkers directly with professional freelance guides. Plan your trek, design your own itinerary, and explore Nepal with transparency.",
      imgLeft: "/introLeft.jpg",
      imgRight: "/introRight.jpg",
    },
    {
      id: 2,
      type: "trekker",
      title: ["Join as ", "Trekker"],
      subtitle: "Plan Your Adventure",
      page: "For Travelers",
      imgLeft: "/trekkerLeft.jpg",
      imgRight: "/trekkerRight.jpg",
      steps: [
        { label: "Step One", title: "Post a Request", desc: "Share your dream destination and budget." },
        { label: "Step Two", title: "Review Proposals", desc: "Compare local guide profiles and offers." },
        { label: "Step Three", title: "Book & Explore", desc: "Start your journey with confidence." }
      ]
    },
    {
      id: 3,
      type: "guide",
      title: ["Join as ", "Guide"],
      subtitle: "Grow Your Career",
      page: "For Freelance Guides",
      imgLeft: "/guideLeft.jpg",
      imgRight: "/guideRight.jpg",
      steps: [
        { label: "Step One", title: "Build Profile", desc: "Showcase your license and expertise." },
        { label: "Step Two", title: "Apply to Jobs", desc: "Bid on trekker requests directly." },
        { label: "Step Three", title: "Lead Treks", desc: "Build your independent brand name." }
      ]
    }
  ];

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-zinc-900 via-neutral-900 to-stone-900">
      <div className="h-screen w-screen relative">
        <Swiper
          direction={'vertical'}
          speed={1000}
          loop={true}
          parallax={true}
          mousewheel={true}
          grabCursor={true}
          pagination={{ clickable: true }}
          modules={[Pagination, Parallax, Mousewheel]}
          className="swiper-container h-full w-full shadow-2xl"
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveSlide(0);
          }}
        >
          {slides.map((slide, slideIndex) => (
            <SwiperSlide key={slide.id} className={`swiper-slide flex bg-black theme-${slide.type}`}>
              
              {/* LEFT SECTION (Title & Buttons) */}
              <div className="w-1/2 h-full overflow-hidden" data-swiper-parallax-y="-20%">
                <div
                  className="swiper-image-left w-full h-full bg-cover bg-center flex flex-col justify-center items-start px-[10%] transition-all duration-[1200ms]"
                  style={{ 
                    backgroundImage: `url(${slide.imgLeft})`,
                  }}
                >
                  <div className="flex flex-col gap-6">
                    <h1 className="slide-title text-white text-7xl leading-tight m-0">
                      {slide.title[0]}
                      <span className="emphasis">{slide.title[1]}</span>.
                      <br />
                      <span className="subtitle">{slide.subtitle}</span>
                    </h1>

                    <p className="page-title text-white text-base tracking-[4px] uppercase m-0">{slide.page}</p>

                    {slide.type !== "intro" && (
                      <button className={`slider-btn py-3.5 px-10 uppercase tracking-wider text-white border border-white/30 bg-white/10 backdrop-blur-md cursor-pointer w-fit transition-all duration-400 hover:bg-blue-600/80 hover:border-blue-600`}>
                        Join Now <span className="arrow inline-block ml-2.5 transition-transform duration-300">→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION (Stepper only on Trekker/Guide slides) */}
              <div className="w-1/2 h-full overflow-hidden" data-swiper-parallax-y="35%">
                <div
                  className="swiper-image-right w-full h-full bg-cover bg-center flex flex-col justify-center items-center px-[15%] transition-all duration-[1200ms]"
                  style={{ 
                    backgroundImage: `url(${slide.imgRight})`,
                  }}
                >
                  {slide.type === "intro" ? (
                    <p className="paragraph text-white text-justify text-xl leading-relaxed m-0 max-w-md">
                      {slide.text}
                    </p>
                  ) : (
                    <div className="vertical-stepper w-full max-w-md flex flex-col gap-10 pl-5 relative">
                      {slide.steps.map((step, idx) => {
                        const isActive = activeStep === idx;
                        return (
                          <div 
                            key={idx} 
                            className={`step-item flex gap-8 transition-all duration-[600ms] ${
                              isActive ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-5'
                            }`}
                          >
                            <div className="step-visual relative flex-shrink-0">
                              <div className={`dot w-8 h-8 rounded-full border-2 flex items-center justify-center z-[2] relative transition-all duration-300 ${
                                isActive 
                                  ? slide.type === 'trekker' 
                                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                                    : 'bg-green-600 border-green-400 shadow-[0_0_15px_rgba(22,163,74,0.5)]'
                                  : 'border-white/30 bg-black/20'
                              }`}>
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              </div>
                              {isActive && <div className="progress-line-fill"></div>}
                            </div>
                            <div className="step-text flex-1">
                              <span className="step-label block text-xs tracking-wider text-white/50 uppercase">{step.label}</span>
                              <h3 className="step-title text-white text-3xl m-0 mt-1 leading-tight">{step.title}</h3>
                              <p className="step-desc text-white/80 text-lg mt-1.5">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default App;