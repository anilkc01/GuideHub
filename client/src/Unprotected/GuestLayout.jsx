import { useRef, useState, useEffect } from "react";
import GuideWelcome from "./welcome/GuideIntro";
import LandingPage from "./welcome/IntroPage";
import TrekkerWelcome from "./welcome/TrekkerIntro";
import Navbar from "./GuestNavBar";

const GuestLayout = ({ onLoginSuccess }) => {
  const scrollContainerRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;

      // 1. Check if we are perfectly snapped to any page
      const isSnapped = Math.abs(scrollTop % clientHeight) < 10;

      // 2. Determine scroll direction
      const isScrollingDown = scrollTop > lastScrollTop.current;

      if (isSnapped) {
        // Always show when a page is fully in view
        setShowNavbar(true);
      } else if (isScrollingDown) {
        // Hide only when moving downwards between pages
        setShowNavbar(false);
      } else {
        // Show when moving upwards between pages
        setShowNavbar(true);
      }

      lastScrollTop.current = scrollTop;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="hidden sm:block">
        <Navbar isVisible={showNavbar} />
      </div>

      <div
        ref={scrollContainerRef}
        className="h-screen w-full relative overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-black"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="h-screen w-full snap-start snap-always">
          <LandingPage scrollContainerRef={scrollContainerRef} />
        </div>
        <div className="h-screen w-full snap-start snap-always">
          <TrekkerWelcome scrollContainerRef={scrollContainerRef} onLoginSuccess={onLoginSuccess}/>
        </div>
        <div className="h-screen w-full snap-start snap-always">
          <GuideWelcome scrollContainerRef={scrollContainerRef} onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

export default GuestLayout;
