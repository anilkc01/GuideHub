import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const LandingPage = ({ scrollContainerRef }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ["start start", "end start"],
    layoutEffect: false, // Better performance
  });

  // Smoother transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "300%"]);

  return (
    <div
      ref={ref}
      className="w-full h-screen overflow-hidden relative grid place-items-center"
    >
      <motion.h1
        style={{
          y: textY,
          willChange: "transform",
        }}
        initial={{ opacity: 1, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 2.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="font-bold text-white relative z-10
                   text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl
                   -translate-x-2 -translate-y-8
                   sm:-translate-x-3 sm:-translate-y-12
                   md:-translate-x-4 md:-translate-y-10
                   lg:-translate-x-8 lg:-translate-y-15
                   xl:-translate-x-12 xl:-translate-y-25"
      >
        GuideHub
      </motion.h1>

      {/* Background layer with GPU acceleration */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/src/assets/fullpic.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: backgroundY,
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
          transform: "translateZ(0)",
        }}
      />

      {/* Foreground layer - optimized */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 1)), url("/src/assets/mountain.png")',
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-12 md:bottom-20 z-30 flex flex-col items-center text-center px-6 w-full max-w-4xl"
      >
        {/* Description Text */}
        <p className="text-white text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-8 drop-shadow-lg">
          Stop following rigid itineraries. Post your dream trek, receive bids
          from expert local guides, and{" "}
          <strong className="font-semibold text-white">
            build a journey that fits you.
          </strong>
        </p>

        {/* Learn More Button */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6",  color: "#111827" }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3 bg-white/10 text-white font-bold rounded-full 
               transition-colors shadow-[0_10px_20px_rgba(0,0,0,0.3)] text-lg uppercase tracking-wider"
        >
          Learn More
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
