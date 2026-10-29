import Reveal from "../components/Reveal";
import PhotoImg from "../components/PhotoImg";
import { team } from "../data";

export default function Team({ embedded = false }) {
  return (
    <div className={embedded ? "pb-20" : "pt-24 pb-20"}>
      {/* Banner */}
      <section className="bg-navy px-6 py-20 text-center text-white">
        <Reveal>
          <h1 className="font-heading text-4xl font-extrabold text-white md:text-5xl">{team.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white">{team.intro}</p>
        </Reveal>
      </section>

      {/* Group photo + info (same layout as Our Story) */}
      <section className="bg-navy-dark px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="min-h-[300px] overflow-hidden rounded-2xl bg-white/10">
              <PhotoImg name="team" alt="MK Construction team" className="h-[400px] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="mb-6 font-heading text-3xl font-bold text-white">{team.heading}</h2>
            {team.paragraphs.map((text) => (
              <p key={text} className="mb-4 leading-relaxed text-white">
                {text}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-navy px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          {team.highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-white/20 bg-white/10 p-8">
                <h3 className="mb-3 font-heading text-xl font-bold text-white">{h.title}</h3>
                <p className="text-sm leading-relaxed text-white">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}