"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("waitlist").insert([{ email }]);

    if (error) {
      setMessage("Oops! This email is already on the list.");
    } else {
      setMessage("🎉 You're on the list! We'll notify you soon.");
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-zinc-950 to-blue-950 text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Floating Wireframe Cubes */}
      <div
        className="absolute top-[5%] left-[5%] w-32 h-32 border-2 border-blue-400/40 rounded-lg animate-float-1"
        style={{
          transform: "rotateX(45deg) rotateY(45deg)",
          transformStyle: "preserve-3d",
        }}
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-40 h-40 border-2 border-cyan-400/30 rounded-xl animate-float-2"
        style={{
          transform: "rotateX(-30deg) rotateY(-60deg)",
          transformStyle: "preserve-3d",
        }}
      />
      <div
        className="absolute top-[15%] right-[20%] w-24 h-24 border-2 border-blue-300/50 rounded-md animate-float-3"
        style={{
          transform: "rotateX(60deg) rotateY(20deg)",
          transformStyle: "preserve-3d",
        }}
      />
      <div
        className="absolute bottom-[20%] left-[15%] w-28 h-28 border-2 border-blue-500/30 rounded-lg animate-float-1"
        style={{
          transform: "rotateX(-45deg) rotateY(30deg)",
          transformStyle: "preserve-3d",
        }}
      />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />

      {/* Main Card */}
      <Card className="relative z-10 w-full max-w-md border border-blue-500/40 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-blue-900/30">
        <CardHeader className="space-y-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/40">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Vendly
          </CardTitle>
          <CardDescription className="text-zinc-300 text-center text-base">
            Stop getting ghosted. Get paid instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-blue-200 ml-1">
                Enter your email for early access
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@youruniversity.edu.ng"
                className="w-full rounded-lg border border-blue-500/40 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400/60"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-blue-600/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Joining..." : "Get Early Access"}
            </Button>
          </form>

          {message && (
            <p
              className={`text-sm text-center font-semibold ${message.includes("Oops") ? "text-red-400" : "text-green-400"}`}
            >
              {message}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 mt-4">
            <span className="text-blue-400">🔒</span>
            <span>
              <span> Exclusive for university vendors nationwide</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
