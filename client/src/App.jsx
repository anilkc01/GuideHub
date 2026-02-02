import { useRef } from "react";
import LandingPage from "./welcome/IntroPage";
import TrekkerWelcome from "./welcome/TrekkerIntro";
import GuideWelcome from "./welcome/GuideIntro";

const App = () => {
  const scrollContainerRef = useRef(null);
  
  return (
    <div 
      ref={scrollContainerRef}
      className="h-screen w-full relative overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-black"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="h-screen w-full snap-start snap-always">
        <LandingPage scrollContainerRef={scrollContainerRef} />
      </div>
      <div className="h-screen w-full snap-start snap-always">
        <TrekkerWelcome scrollContainerRef={scrollContainerRef} />
      </div>
      <div className="h-screen w-full snap-start snap-always">
        <GuideWelcome scrollContainerRef={scrollContainerRef} />
      </div>
    </div>
  );
};

export default App;