import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import PhotoImg from "../components/PhotoImg";
import api from "../services/api";
import { projects as demoProjects } from "../data";

const statusBadge = (status) => {
  const map = {
    planning: "bg-blue-100 text-blue-700",
    "in-progress": "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    "on-hold": "bg-red-100 text-red-700",
  };
  return map[status?.toLowerCase()] || "bg-slate-100 text-slate-700";
};

// "project-1" -> /videos/project-1.mp4 | full URL or path is used as it is
const getVideoSrc = (video) => {
  if (!video) return null;
  if (video.startsWith("http") || video.startsWith("/")) return video;
  return `/videos/${video}.mp4`;
};

function ProjectCard({ p }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoSrc = getVideoSrc(p.video || p.videoUrl);
  const hasVideo = videoSrc && !videoError;

  const startVideo = () => {
    if (!hasVideo || !videoRef.current) return;
    setPlaying(true);
    videoRef.current.play().catch(() => {});
  };

  const stopVideo = () => {
    if (!videoRef.current) return;
    setPlaying(false);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  // Mobile has no hover, so tap toggles the video
  const toggleVideo = () => (playing ? stopVideo() : startVideo());

  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl">
      <div
        className="relative h-60 cursor-pointer overflow-hidden bg-slate-200"
        onMouseEnter={startVideo}
        onMouseLeave={stopVideo}
        onClick={toggleVideo}
      >
        {/* Image (default) */}
        <PhotoImg
          name={p.image || "project-1"}
          alt={p.name || p.title}
          className="h-full w-full object-cover"
        />

        {/* Video (shown on hover) */}
        {hasVideo && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              playing ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Play icon hint */}
        {hasVideo && !playing && (
          <div className="pointer-events-none absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
            <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute right-4 top-4">
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusBadge(p.status)}`}>
            {p.status || "Completed"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-2 font-heading text-xl font-bold text-navy">{p.name || p.title}</h3>
        <p className="mb-4 flex items-center gap-1 text-sm text-slate-500">
          📍 {p.location || p.siteAddress || p.meta || "Maharashtra"}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Budget</p>
            <p className="font-semibold text-navy">
              {p.budget ? `₹${Number(p.budget).toLocaleString("en-IN")}` : "On Request"}
            </p>
          </div>
          <Link to="/contact" className="text-sm font-semibold text-navy hover:underline">
            Enquire →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Projects({ embedded = false }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/projects")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.projects || [];
        if (data.length > 0) {
          setProjects(data);
        } else {
          setProjects(demoProjects.map((p) => ({ ...p, status: "completed" })));
        }
      })
      .catch(() => {
        setProjects(demoProjects.map((p) => ({ ...p, status: "completed" })));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.status?.toLowerCase() === filter);

  return (
    <div className={`bg-slate-50 pb-20 ${embedded ? "" : "min-h-screen pt-24"}`}>
      <section className="bg-navy px-6 py-20 text-center text-white">
        <Reveal>
          <h1 className="font-heading text-4xl font-extrabold md:text-5xl">Our Projects</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Explore our portfolio of residential and commercial constructions.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {["all", "planning", "in-progress", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                  filter === f ? "bg-navy text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.replace("-", " ")}
              </button>
            ))}
          </div>
        </Reveal>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-slate-500">No projects found for this category.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p, i) => (
              <Reveal key={p._id || p.title} delay={i * 0.1}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}