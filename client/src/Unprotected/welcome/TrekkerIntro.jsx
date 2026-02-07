import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepperBox from "./StepperBox";
import FormContainer from "../Authentication/FormsContainer";

const stepperData = [
  {
    title: "Sign Up",
    desc: "SignUp to our portal to explore the freelancing world of trekkers and guides.",
  },
  {
    title: "Post your plan",
    desc: "Post your proposed plan, place, route, iternity and budget.",
  },
  {
    title: "Plan your iternity",
    desc: "Chat with guides who wish to guide you and plan your iternity and budget.",
  },
  {
    title: "Choose your Guide",
    desc: "Pick a guide with best idea, budget and good for you.",
  },
  { title: "Go to Trek", desc: "Hit the trail with the guide you choose." },
  {
    title: "Review",
    desc: "Leave review of your guide and post blogs of your trek.",
  },
];

const TrekkerWelcome = () => {
  const ref = useRef(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div
      ref={ref}
      className="w-full h-screen overflow-hidden relative grid place-items-center bg-black"
    >
      {/* --- MOBILE LAYOUT --- */}
      <div className="lg:hidden flex flex-col items-center justify-center px-4 w-full h-full relative z-30 gap-10">
        <div className="w-full max-w-sm min-h-100 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isAuthOpen ? (
              <motion.div
                key="stepper-mob"
                className="w-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <StepperBox steps={stepperData} />
              </motion.div>
            ) : (
              <motion.div
                key="auth-mob"
                className="w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <FormContainer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="w-full max-w-sm flex flex-col gap-2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: false }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        >
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-[0.9] font-serif">
              Join as Trekker
            </h1>
            <p className="text-white/70 text-base sm:text-lg font-light italic ml-1">
              Start your Himalayan adventure today.
            </p>
          </div>
          <button
            onClick={() => setIsAuthOpen(!isAuthOpen)}
            className="w-full sm:w-fit mt-3 px-8 sm:px-10 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-full text-white text-lg sm:text-xl font-medium hover:bg-white hover:text-black transition-all duration-300"
          >
            {isAuthOpen ? "I will join later" : "Get Started"}
          </button>
        </motion.div>
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      {/* Left Text Content */}
      <motion.div
        className="hidden lg:flex absolute left-12 xl:left-30 top-1/2 -translate-y-1/2 flex-col gap-4 z-30"
        initial={{ opacity: 0, x: -120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ amount: 0.3, once: false }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      >
        <div className="space-y-4">
          <h1 className="text-4xl xl:text-[clamp(40px,5vw,60px)] font-bold text-white leading-[0.9] font-serif">
            Join as Trekker
          </h1>
          <p className="text-white/70 text-lg xl:text-xl font-light italic ml-2">
            Start your Himalayan adventure today.
          </p>
        </div>
        <button
          onClick={() => setIsAuthOpen(!isAuthOpen)}
          className="w-fit mt-6 xl:mt-8 px-10 xl:px-14 py-2.5 xl:py-3 bg-white/10 border border-white/20 rounded-full text-white text-xl xl:text-2xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
        >
          {isAuthOpen ? "I will join later" : "Get Started"}
        </button>
      </motion.div>

      {/* Right Interaction Content */}
      <div className="hidden lg:block absolute right-12 xl:right-20 top-1/2 -translate-y-1/2 z-30 w-112.5 xl:w-137.5">
        <AnimatePresence mode="wait">
          {!isAuthOpen ? (
            <motion.div
              key="stepper-desk"
              className="hidden lg:block absolute right-12 xl:right-20 top-1/2 -translate-y-1/2 z-30"
              initial={{ opacity: 0, x: 140 }}
              whileInView={{ opacity: 0.9, x: 0 }}
              viewport={{ amount: 0.3, once: false }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.3,
              }}
            >
              <StepperBox steps={stepperData} />
            </motion.div>
          ) : (
            <motion.div
              key="auth-desk"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FormContainer role="trekker" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pure Black Background */}
      <div className="absolute inset-0 z-0 bg-black" />
    </div>
  );
};

export default TrekkerWelcome;
