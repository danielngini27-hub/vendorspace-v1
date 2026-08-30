"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 rounded-full bg-cyan-500/10 animate-ring" />
        <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-ring-delay" />
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center animate-grow shadow-2xl shadow-cyan-500/60">
          <span className="text-5xl font-black text-white">V</span>
        </div>
      </div>
      <p className="mt-10 text-3xl font-bold text-white tracking-widest animate-fade-up">
        Vendly
      </p>
      <p className="mt-2 text-sm text-slate-400 animate-fade-up-delay">
        Buy & Sell with Trust
      </p>
    </div>
  );
}
