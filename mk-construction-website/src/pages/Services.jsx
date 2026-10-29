import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { services } from "../data";

export default function Services({ embedded = false }) {
  return (
    <div className={embedded ? "pb-20" : "pt-24 pb-20"}>
      <section className="bg-navy px-6 py-20 text-white text-center">
        <Reveal>
          <h1 className="font-heading text-4xl font-extrabold md:text-5xl">Our Services</h1>
          <p className="mt-4 mx-auto max-w-2xl text-slate-300">
            Complete construction solutions, from the first brick to the final finish.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl">
                <h3 className="mb-3 font-heading text-xl font-bold text-navy">{s.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-600">{s.text}</p>
                <Link to="/contact" className="text-sm font-semibold text-navy hover:underline">
                  Enquire →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}