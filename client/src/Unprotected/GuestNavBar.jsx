import { motion } from "framer-motion";

const Navbar = ({ isVisible }) => {
  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-2 lg:px-8 lg:py-2 
      bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-lg 
      transition-all duration-100 ease-in-out
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src="/src/assets/logoHW.png" 
          alt="Trekker Logo" 
          className="h-15 w-auto lg:h-15"
        />
      </div>

      {/* Navigation Links & Buttons */}
      <div className="flex items-center gap-6 lg:gap-10">
        <a 
          href="#about" 
          className="hidden md:block text-white/80 hover:text-white text-sm lg:text-base transition-colors"
        >
          About Us
        </a>
        
        <div className="flex items-center gap-3 lg:gap-4">
          <button className="text-white text-sm lg:text-base px-4 py-2 hover:bg-white/10 rounded-full transition-all">
            Login
          </button>
          <button className="bg-white text-black text-sm lg:text-base px-5 py-2 lg:px-7 lg:py-2.5 rounded-full font-medium hover:bg-gray-200 transition-all shadow-lg">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;