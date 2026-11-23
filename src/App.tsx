import { useCallback, useEffect, useState } from "react";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import About from "./components/About";
import Equipment from "./components/Equipment";
import Zones from "./components/Zones";
import Why from "./components/Why";
import Membership from "./components/Membership";
import Motivation from "./components/Motivation";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { ScrollTrigger, getLenis, initSmoothScroll } from "./lib/scroll";
import { playClank } from "./lib/sound";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const lenis = initSmoothScroll();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    // metallic click feedback (only audible if the user enabled sound)
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest("a,button")) playClank();
    };
    document.addEventListener("click", click);

    return () => {
      window.removeEventListener("load", refresh);
      document.removeEventListener("click", click);
    };
  }, []);

  const onLoaded = useCallback(() => {
    document.body.style.overflow = "";
    getLenis()?.start();
    window.scrollTo(0, 0);
    setReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div className="relative min-h-screen bg-ink text-white">
      <Loader onDone={onLoaded} />
      <Cursor />
      <ScrollProgress />
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} />
        <About />
        <Equipment />
        <Zones />
        <Why />
        <Membership />
        <Motivation />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
