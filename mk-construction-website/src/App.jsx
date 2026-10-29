import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About.jsx";         
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import SimplePage from "./pages/SimplePage";
import Team from "./pages/Team"; 

export default function App() {
  const [ready, setReady] = useState(
    () => sessionStorage.getItem("mk-preloader") === "1"
  );
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [ready]);

  const handleDone = () => {
    sessionStorage.setItem("mk-preloader", "1");
    setReady(true);
  };

  const isLoginPage = pathname === "/login";

  return (
    <>
      {!ready && <Preloader onDone={handleDone} />}
      <div className={`transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
        
        {!isLoginPage && <Navbar />}

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            
            <Route path="/about" element={<About />} />
            
            <Route path="/services" element={<Services />} />
            <Route path="/team" element={<Team />} /> 
            <Route path="/projects" element={<Projects />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<SimplePage />} />
          </Routes>
        </main>

        {!isLoginPage && <Footer />}
      </div>
    </>
  );
}