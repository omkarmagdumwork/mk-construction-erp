import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { company } from "../data";
import useWebsiteData from "../hooks/useWebsiteData";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
    { to: "/team", label: "Team" },       
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data } = useWebsiteData();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ If not on home page, force the background to be white
  const solid = scrolled || open || location.pathname !== "/";
  const siteName = data?.companyName || company.name;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "bg-white text-navy shadow-md" : "bg-transparent text-white"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo" className="h-11 rounded bg-white p-0.5" />
          <span className="font-heading text-base font-bold sm:text-lg">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="font-medium transition hover:text-blue-600">
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="font-medium text-navy-mid hover:underline">
            Login
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/contact" className="rounded-lg bg-navy px-5 py-2.5 font-semibold text-white transition hover:bg-navy-mid">
            Get Free Quote
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 bg-white px-6 pb-6 pt-2 md:hidden shadow-md">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-medium text-navy">
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="font-medium text-navy-mid">
            Login
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="rounded-lg bg-navy px-5 py-3 text-center font-semibold text-white">
            Get Free Quote
          </Link>
        </nav>
      )}
    </header>
  );
}