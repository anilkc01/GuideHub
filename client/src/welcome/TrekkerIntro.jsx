import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import StepperBox from "./StepperBox";

const stepperData = [
  { title: "Sign Up", desc: "SignUp to our portal to explore the freelancing world of trekkers and guides." },
  { title: "Post your plan", desc: "Post your proposed plan, place, route, iternity and budget." },
  { title: "Plan your iternity", desc: "Chat with guides who wish to guide you and plan your iternity and budget." },
  { title: "Choose your Guide", desc: "Pick a guide with best idea, budget and good for you." },
  { title: "Go to Trek", desc: "Hit the trail with the guide you choose." },
  { title: "Review", desc: "Leave review of your guide and post blogs of your trek." },
];

const TrekkerWelcome = ({ scrollContainerRef }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const backgroundY = useTransform(
    scrollYProgress, 
    [0, 1], 
    ["0%", "100%"]
  );
  
  const textY = useTransform(
    scrollYProgress, 
    [0, 1], 
    ["0%", "20%"]
  );

  return (
    <div
      ref={ref}
      className="w-full h-screen overflow-hidden relative grid place-items-center"
    >
      {/* Mobile Layout - Stacked */}
      <div className="lg:hidden flex flex-col items-center justify-center px-4 w-full h-full relative z-30 gap-15">
        {/* Stepper on top for mobile */}
        <motion.div
          style={{ 
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 0.9, y: 0 }}
          viewport={{ amount: 0.2, once: false }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2
          }}
        >
          <StepperBox steps={stepperData} />
        </motion.div>

        {/* Text and button at bottom for mobile */}
        <motion.div
          className="w-full max-w-sm flex flex-col gap-2"
          style={{ 
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: false }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.3
          }}
        >
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-[0.9] font-serif drop-shadow-2xl">
              Join as Trekker
            </h1>
            <p className="text-white/70 text-base sm:text-lg font-light italic ml-1">
              Start your Himalayan adventure today.
            </p>
          </div>
          <button className="w-full sm:w-fit mt-3 px-8 sm:px-10 py-2 sm:py-2.5 bg-white/20 border border-white/30 rounded-full text-white text-lg sm:text-xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-xl">
            Get Started
          </button>
        </motion.div>
      </div>

      {/* Desktop Layout - Side by Side */}
      {/* Left content */}
      <motion.div
        className="hidden lg:flex absolute left-12 xl:left-30 top-1/2 -translate-y-1/2 flex-col gap-4 z-30"
        style={{ 
          y: textY,
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
        initial={{ opacity: 0, x: -120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ amount: 0.3, once: false }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.2
        }}
      >
        <div className="space-y-4">
          <h1 className="text-4xl xl:text-[clamp(40px,5vw,60px)] font-bold text-white leading-[0.9] font-serif drop-shadow-2xl">
            Join as Trekker
          </h1>
          <p className="text-white/70 text-lg xl:text-xl font-light italic ml-2">
            Start your Himalayan adventure today.
          </p>
        </div>
        <button className="w-fit mt-6 xl:mt-8 px-10 xl:px-14 py-2.5 xl:py-3 bg-white/20 border border-white/30 rounded-full text-white text-xl xl:text-2xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-xl">
          Get Started
        </button>
      </motion.div>

      {/* Right content */}
      <motion.div
        style={{ 
          y: textY,
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
        className="hidden lg:block absolute right-12 xl:right-20 top-1/2 -translate-y-1/2 z-30"
        initial={{ opacity: 0, x: 140 }}
        whileInView={{ opacity: 0.9, x: 0 }}
        viewport={{ amount: 0.3, once: false }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.3
        }}
      >
        <StepperBox steps={stepperData} />
      </motion.div>

      {/* Background layer with GPU acceleration */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/src/assets/snowHigh.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          y: backgroundY,
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
          transform: "translateZ(0)",
        }}
      />

      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent)',
          transform: "translateZ(0)",
        }}
      />

      {/* Foreground layer */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage: 'url("/src/assets/snowLow.png")',
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Foreground gradient */}
      <div 
        className="absolute inset-0 z-21 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent)',
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
};

TrekkerWelcome.displayName = "TrekkerWelcome";

export default TrekkerWelcome;