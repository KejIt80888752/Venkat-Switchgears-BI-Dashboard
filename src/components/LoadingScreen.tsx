import React, { useEffect, useState } from "react";
import { COMPANY } from "@/data/mockData";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const phases = [
    "Connecting to Tally ERP...",
    "Loading Sales Data...",
    "Syncing Inventory...",
    "Fetching GST Reports...",
    "Preparing Dashboard...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setPhase(Math.min(4, Math.floor(progress / 20)));
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Subtle grid pattern — like the website background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#0D2B5E 1px, transparent 1px), linear-gradient(90deg, #0D2B5E 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-6">

        {/* Spinning ring — exactly like CMS loader */}
        <div className="relative flex items-center justify-center">
          {/* Outer spinning ring */}
          <svg
            className="animate-spin absolute"
            style={{ width: 100, height: 100, animationDuration: "1s" }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="#E87722"
              strokeWidth="3"
              strokeDasharray="60 220"
              strokeLinecap="round"
            />
          </svg>

          {/* Second ring — counter spin */}
          <svg
            className="animate-spin absolute"
            style={{ width: 76, height: 76, animationDuration: "1.5s", animationDirection: "reverse" }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="#0D2B5E"
              strokeWidth="2"
              strokeDasharray="30 250"
              strokeLinecap="round"
            />
          </svg>

          {/* Logo in center */}
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border border-slate-100">
            <img
              src={COMPANY.logo}
              alt="Venkat Switchgears"
              className="w-12 h-12 object-contain"
              onError={e => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                el.parentElement!.innerHTML = '<span style="color:#0D2B5E;font-size:1.5rem;font-weight:900">V</span>';
              }}
            />
          </div>
        </div>

        {/* Company name */}
        <div className="text-center">
          <h1 className="text-venkat-navy font-black text-xl tracking-wide">Venkat Switchgears</h1>
          <p className="text-venkat-orange text-xs font-bold tracking-[0.2em] uppercase mt-0.5">
            {COMPANY.tagline}
          </p>
        </div>

        {/* Progress bar — thin, like website */}
        <div className="w-56 space-y-2">
          <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-venkat-orange rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate-400 text-[11px] text-center tracking-wide">{phases[phase]}</p>
        </div>

      </div>

      {/* Bottom — Tally status dot */}
      <div className="absolute bottom-8 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <p className="text-slate-300 text-[11px] tracking-wide">Tally ERP · Peenya, Bangalore</p>
      </div>

      {/* Built by The Raise — bottom right */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-40">
        <p className="text-slate-400 text-[9px] uppercase tracking-widest">Built by</p>
        <img
          src="/Venkat-Switchgears-BI-Dashboard/the-raise-logo.png"
          alt="The Raise"
          className="h-3.5 object-contain"
        />
      </div>
    </div>
  );
}
