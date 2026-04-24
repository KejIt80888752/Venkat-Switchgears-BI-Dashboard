import React, { useEffect, useState } from "react";
import { COMPANY } from "@/data/mockData";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

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
          setTimeout(onComplete, 300);
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
    <div className="fixed inset-0 bg-venkat-navy flex flex-col items-center justify-center z-50">
      {/* Animated power grid background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#E87722" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Pulsing ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-venkat-orange/20 animate-ping" style={{ width: 120, height: 120, margin: "auto", top: 0, left: 0, right: 0, bottom: 0 }} />
        <div className="relative w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl">
          <img
            src={COMPANY.logo}
            alt="Venkat Switchgears"
            className="w-20 h-20 object-contain"
            onError={e => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.parentElement!.innerHTML = '<span style="color:#0D2B5E;font-size:2rem;font-weight:900">V</span>';
            }}
          />
        </div>
      </div>

      {/* Company Name */}
      <h1 className="text-white text-2xl font-bold tracking-wide mb-1">Venkat Switchgears</h1>
      <p className="text-venkat-orange text-sm font-semibold tracking-widest uppercase mb-1">
        {COMPANY.tagline}
      </p>
      <p className="text-[#8BAED6] text-xs mb-10">Business Intelligence Dashboard</p>

      {/* Progress Bar */}
      <div className="w-72 space-y-3">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-venkat-orange rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[#8BAED6] text-xs">{phases[phase]}</p>
          <p className="text-white text-xs font-semibold">{progress}%</p>
        </div>
      </div>

      {/* Tally ERP badge */}
      <div className="absolute bottom-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <p className="text-[#8BAED6] text-xs">Tally ERP · Mock Mode · Peenya, Bangalore</p>
      </div>
    </div>
  );
}
