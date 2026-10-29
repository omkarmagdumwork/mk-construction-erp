import Reveal from "../components/Reveal";
import { reviews } from "../data";

function ReviewCard({ r }) {
  return (
    <div className="mr-6 w-82 shrink-0 md:w-96">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* 1. Photo */}
        {r.image && (
          <img
            src={encodeURI(`/images/${r.image}.png`)}
            alt={r.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-72 w-full object-cover object-top md:h-80"
          />
        )}

        <div className="flex flex-1 flex-col p-6">
          {/* 2. Review text */}
          <p className="mb-6 flex-1 leading-relaxed text-slate-600">“{r.text}”</p>

          {/* 3. Customer name and location */}
          <div className="border-t border-slate-100 pt-4">
            <p className="font-heading font-bold text-navy">{r.name}</p>
            <p className="text-sm text-slate-500">📍 {r.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  // The list is shown twice so the loop never shows an empty gap
  const loop = [...reviews, ...reviews];

  return (
    <div className="bg-slate-50 py-20">
      <Reveal>
        <h2 className="mb-10 px-6 text-center font-heading text-3xl font-bold text-navy">
          What Our Customers Say
        </h2>
      </Reveal>

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div
          className="marquee-track"
          style={{ animationDuration: `${reviews.length * 4}s` }}
        >
          {loop.map((r, i) => (
            <div key={i} aria-hidden={i >= reviews.length}>
              <ReviewCard r={r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}