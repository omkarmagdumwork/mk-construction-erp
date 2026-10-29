import Reveal from "../components/Reveal";
import PhotoImg from "../components/PhotoImg";

export default function About({ embedded = false }) {
  return (
    <div className={embedded ? "pb-20" : "pt-24 pb-20"}>
      {/* Banner */}
      <section className="bg-navy px-6 py-20 text-center text-white">
        <Reveal>
          <h1 className="font-heading text-4xl font-extrabold text-white md:text-5xl">About Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white">
            Building trust, one structure at a time. Learn more about who we are and what drives us.
          </p>
        </Reveal>
      </section>

      {/* Our Story */}
      <section className="bg-navy-dark px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="overflow-hidden rounded-2xl">
              <PhotoImg name="hero" alt="Construction site" className="h-[400px] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="mb-6 font-heading text-3xl font-bold text-white">Our Story</h2>
            <p className="mb-4 leading-relaxed text-white">
              Since 2010, MK Construction & Builders has been at the forefront of residential and commercial construction. We started with a simple vision: to build structures that stand the test of time, both in quality and design.
            </p>
            <p className="mb-6 leading-relaxed text-white">
              Over the years, we have successfully delivered over 100 projects, transforming empty plots into thriving homes, bustling offices, and landmark commercial spaces.
            </p>
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
              <div>
                <p className="font-heading text-3xl font-bold text-white">10+</p>
                <p className="text-sm text-white">Years Experience</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-white">100+</p>
                <p className="text-sm text-white">Projects Done</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="mb-10 text-center font-heading text-3xl font-bold text-white">Why Choose Us?</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "Quality Guarantee", text: "We use top-grade materials and strict quality checks at every stage of construction." },
              { title: "On-Time Delivery", text: "We value your time. Our team works efficiently to deliver projects within the promised timeline." },
              { title: "Transparent Pricing", text: "No hidden costs. We provide detailed estimates and stick to the budget." },
            ].map((val, i) => (
              <Reveal key={val.title} delay={i * 0.1}>
                <div className="h-full rounded-xl border border-white/20 bg-white/10 p-8">
                  <h3 className="mb-3 font-heading text-xl font-bold text-white">{val.title}</h3>
                  <p className="text-sm leading-relaxed text-white">{val.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}