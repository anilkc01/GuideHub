import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepperBox from "./StepperBox";
import RegistrationBox from "../Authentication/Register";


const stepperData = [
  { title: "Sign Up", desc: "SignUp to our portal to explore the freelancing world of trekkers and guides." },
  { title: "Post your plan", desc: "Post your proposed plan, place, route, iternity and budget." },
  { title: "Plan your iternity", desc: "Chat with guides who wish to guide you and plan your iternity and budget." },
  { title: "Choose your Guide", desc: "Pick a guide with best idea, budget and good for you." },
  { title: "Go to Trek", desc: "Hit the trail with the guide you choose." },
  { title: "Review", desc: "Leave review of your guide and post blogs of your trek." },
];

const TrekkerWelcome = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden relative grid place-items-center bg-black">
      
      {/* Container for Content */}
      <div className="z-30 w-full max-w-7xl px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT/BOTTOM TEXT SECTION (Stable) */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2 order-2 lg:order-1 items-center lg:items-start text-center lg:text-left">
          <div className="space-y-2 lg:space-y-4">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white font-serif">
              Join as Trekker
            </h1>
            <p className="text-white/70 text-lg lg:text-xl italic">
              Start your Himalayan adventure today.
            </p>
          </div>

          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-fit px-10 py-3 bg-white/10 border border-white/20 rounded-full text-white text-lg lg:text-xl font-medium hover:bg-white hover:text-black transition-all"
          >
            {isRegistering ? "I will join later" : "Get Started"}
          </button>
        </div>

        {/* RIGHT/TOP INTERACTIVE SECTION (Swaps Stepper <-> Registration) */}
        <div className="w-full lg:w-112.5 xl:w-125 order-1 lg:order-2">
          <AnimatePresence mode="wait">
            {!isRegistering ? (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <StepperBox steps={stepperData} />
              </motion.div>
            ) : (
              <motion.div
                key="registration"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <RegistrationBox />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-0 z-0 bg-black" />
    </div>
  );
};

export default TrekkerWelcome;