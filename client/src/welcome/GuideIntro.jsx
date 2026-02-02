import { useRef } from "react";
import { motion } from "framer-motion";
import StepperBox from "./StepperBox";

const guideSteps = [
  {
    title: "Register as Guide",
    desc: "Verify your license and create a professional guide profile.",
  },
  {
    title: "Find Treks",
    desc: "Browse through trekker posts that match your expert routes.",
  },
  {
    title: "Send Proposals",
    desc: "Pitch custom itineraries and negotiate directly with clients.",
  },
  {
    title: "Confirm Booking",
    desc: "Secure your hire and finalize dates with the trekker.",
  },
  {
    title: "Lead the Way",
    desc: "Provide high-quality guiding and cultural Himalayan insights.",
  },
  {
    title: "Build Brand",
    desc: "Earn top ratings to attract more high-paying trekkers.",
  },
];

const GuideWelcome = () => {
  const ref = useRef(null);

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
          <StepperBox steps={guideSteps} />
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
              Join as Guide
            </h1>
            <p className="text-white/70 text-base sm:text-lg font-light italic ml-1">
              Lead adventures, earn premium rates.
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
            Join as Guide
          </h1>
          <p className="text-white/70 text-lg xl:text-xl font-light italic ml-2">
            Lead adventures, earn premium rates.
          </p>
        </div>
        <button className="w-fit mt-6 xl:mt-8 px-10 xl:px-14 py-2.5 xl:py-3 bg-white/20 border border-white/30 rounded-full text-white text-xl xl:text-2xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-xl">
          Get Started
        </button>
      </motion.div>

      {/* Right content */}
      <motion.div
        style={{
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
        <StepperBox steps={guideSteps} />
      </motion.div>

      {/* Background with GPU acceleration */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/src/assets/guide.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
};

export default GuideWelcome;