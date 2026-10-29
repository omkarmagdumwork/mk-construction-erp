import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const done = useRef(onDone);

  useEffect(() => {
    const fade = setTimeout(() => setLeaving(true), 1800);
    const finish = setTimeout(() => done.current(), 2400);
    return () => { clearTimeout(fade); clearTimeout(finish); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-navy-dark to-navy"
    >
      <img src="/images/sky.svg" alt="" className="absolute bottom-1.5 left-0 h-44 w-full object-cover object-right-bottom opacity-15" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative rounded-2xl bg-white px-7 py-5 shadow-2xl"
      >
        <img src="/images/logo.png" alt="MK Construction and Builders" className="w-64 sm:w-80" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative mt-6 text-sm tracking-widest text-sky"
      >
        LOADING...
      </motion.p>
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-white/10">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
