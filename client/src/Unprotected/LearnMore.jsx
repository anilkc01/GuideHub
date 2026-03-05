import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Send, Gavel, MessageSquare, 
  Map, Mountain, Star, BookOpen 
} from 'lucide-react';
import Navbar from './GuestNavBar';


const steps = [
  { title: "Login & Profile", desc: "Create your account and set up your trekker profile.", icon: <UserPlus className="text-emerald-400" /> },
  { title: "Post a Plan", desc: "Tell us where you want to go, your budget, and preferred dates.", icon: <Send className="text-blue-400" /> },
  { title: "Guides Place Bids", desc: "Certified freelance guides will see your plan and offer prices.", icon: <Gavel className="text-purple-400" /> },
  { title: "Pick Your Guide", desc: "Chat with guides, check reviews, and hire the perfect match.", icon: <MessageSquare className="text-pink-400" /> },
  { title: "Customize Plan", desc: "Work with your guide to refine the itinerary and gear.", icon: <Map className="text-orange-400" /> },
  { title: "Complete the Trek", desc: "Hit the trails! Your guide ensures safety and an amazing experience.", icon: <Mountain className="text-emerald-500" /> },
  { title: "Rate & Review", desc: "Share your experience. Both trekkers and guides review each other.", icon: <Star className="text-yellow-400" /> },
  { title: "Explore & Blog", desc: "Share your story on our community blog to inspire others.", icon: <BookOpen className="text-indigo-400" /> }
];

const LearnMorePage = () => {
  return (
    // overflow-y-auto is critical here to allow normal scrolling
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto">
      
      {/* Guest Navbar - Force visibility */}
      <Navbar isVisible={true} />

      <main className="py-32 px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-5xl lg:text-7xl font-serif font-medium mb-6">
            Your journey, <span className="italic text-zinc-500">simplified.</span>
          </h1>
          <p className="text-zinc-400 text-lg">From your first click to the mountain peak.</p>
        </div>

        {/* Vertical Stepper */}
        <div className="max-w-3xl mx-auto relative">
          
          {/* The Vertical Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-800 md:-translate-x-1/2" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center md:justify-between w-full ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content Box */}
                <div className="ml-16 md:ml-0 md:w-[42%] p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all duration-500 group">
                  <div className="mb-4 text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    Step 0{index + 1}
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                {/* Icon Circle */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-black border-2 border-zinc-800 z-10 group-hover:border-emerald-500/50 group-hover:scale-110 transition-all duration-500">
                  {step.icon}
                </div>

                <div className="hidden md:block md:w-[42%]" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA at Bottom */}
        <div className="mt-40 text-center pb-20">
          <div className="inline-block p-px rounded-full bg-linear-to-b from-white/20 to-transparent">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-zinc-900 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Ready to Start?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnMorePage;