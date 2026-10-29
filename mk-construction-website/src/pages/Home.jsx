import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView } from "framer-motion";
import PhotoImg from "../components/PhotoImg";
import { stats } from "../data";
import About from "./About";
import Services from "./Services";
import Projects from "./Projects";
import Contact from "./Contact";

import Team from "./Team"; 

import Reviews from "./Reviews";    

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function Counter({ end }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, { duration: 2, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, end]);

  return <span ref={ref}>{value}+</span>;
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section id="home" className="bg-gradient-to-br from-navy-dark via-navy to-navy-mid px-6 pb-16 pt-36 text-white min-h-screen flex flex-col justify-center">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-12">
          
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
            <motion.span variants={item} className="inline-block rounded-full border border-white/35 px-4 py-1.5 text-xs tracking-[0.25em] text-sky">
              RESIDENTIAL & COMMERCIAL
            </motion.span>
            <motion.h1 variants={item} className="mb-4 mt-5 whitespace-pre-line font-heading text-5xl font-extrabold leading-tight md:text-6xl">
              Building Dreams
              Into Reality
            </motion.h1>
            <motion.p variants={item} className="mb-8 text-lg text-slate-300">
              Quality construction, delivered on time and within budget.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-4">
              <a href="#contact" className="rounded-lg bg-white px-7 py-3.5 font-semibold text-navy transition hover:-translate-y-0.5">
                Get Free Quote
              </a>
              <a href="#projects" className="rounded-lg border border-white px-7 py-3.5 font-semibold transition hover:bg-white/10">
                View Projects
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="w-full max-w-2xl flex-1">
            <PhotoImg name="main" alt="Construction site" className="block w-full object-contain" />
          </motion.div>
          
        </div>

        <div className="mx-auto mt-14 flex w-full max-w-7xl flex-wrap gap-12 border-t border-white/20 pt-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-4xl font-extrabold"><Counter end={s.value} /></p>
              <p className="mt-1 text-slate-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
            {/* 2. OTHER SECTIONS */}
      <section id="about"><About embedded /></section>
      <section id="services"><Services embedded /></section>
      <section id="team"><Team embedded /></section>  
      <section id="projects"><Projects embedded /></section>
      <section id="reviews"><Reviews /></section> 
      <section id="contact"><Contact embedded /></section>
    </div>
  );
}