"use client";

import { useEffect, useState } from "react";

type Mode = "auto" | "mobile" | "desktop";

const STORAGE_KEY = "na-viewport-mode";
const MOBILE_WIDTH = "430px";

export default function ViewportToggle({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("auto");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (saved === "mobile" || saved === "desktop" || saved === "auto") setMode(saved);
    } catch {
      // localStorage indisponível (modo privado etc.) — segue com "auto"
    }
  }, []);

  const choose = (next: Mode) => {
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignora — é só uma conveniência de teste, não crítico
    }
  };

  return (
    <>
      <div
        className="fixed top-3 right-3 z-[9999] flex gap-1 rounded-full p-1 shadow-lg"
        style={{ background: "#1e293b" }}
      >
        {(
          [
            { key: "mobile" as const, icon: "fa-mobile-screen-button", label: "Celular" },
            { key: "auto" as const, icon: "fa-arrows-left-right", label: "Real" },
            { key: "desktop" as const, icon: "fa-desktop", label: "Computador" },
          ]
        ).map((opt) => (
          <button
            key={opt.key}
            title={opt.label}
            onClick={() => choose(opt.key)}
            className="flex items-center justify-center w-9 h-9 rounded-full text-sm transition-colors"
            style={{
              background: mode === opt.key ? "var(--na-gold)" : "transparent",
              color: mode === opt.key ? "#1e293b" : "#cbd5e1",
            }}
          >
            <i className={`fa-solid ${opt.icon}`} />
          </button>
        ))}
      </div>

      <div
        style={{
          containerType: "inline-size",
          width: mode === "mobile" ? MOBILE_WIDTH : mode === "desktop" ? "100%" : undefined,
          margin: mode === "mobile" ? "0 auto" : undefined,
          minHeight: mode === "mobile" ? "100vh" : undefined,
          boxShadow: mode === "mobile" ? "0 0 0 1px #cbd5e1, 0 20px 40px rgba(0,0,0,0.15)" : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
}
