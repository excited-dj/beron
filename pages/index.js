"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-zinc-800 backdrop-blur p-2 ${className}`}>
    {children}
  </div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
const Button = ({ children, className = "", ...props }) => (
  <button className={`px-4 py-2 rounded-lg ${className}`} {...props}>
    {children}
  </button>
);

export default function BerOnTelegramWebApp() {
  const [coins, setCoins] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const [maxEnergy, setMaxEnergy] = useState(1000);
  const [tapPower] = useState(1);
  const [multiplier] = useState(1);
  const [activeTab, setActiveTab] = useState("mine");
  const [bpLevel, setBpLevel] = useState(1);
  const [bpExp, setBpExp] = useState(0);
  const [critEffect, setCritEffect] = useState(null);
  const [shake, setShake] = useState(false);
  const [flyingCoins, setFlyingCoins] = useState([]);
  const expToBPLevel = bpLevel * 300;

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((e) => Math.min(maxEnergy, e + 3));
    }, 1000);
    return () => clearInterval(interval);
  }, [maxEnergy]);

  const spawnCoins = () => {
    const newCoins = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      x: (Math.random() - 0.5) * 120,
      y: -Math.random() * 120,
    }));
    setFlyingCoins((prev) => [...prev, ...newCoins]);
    setTimeout(() => setFlyingCoins((prev) => prev.slice(6)), 800);
  };

  const gainBPExp = (amount) => {
    setBpExp((prev) => {
      const newExp = prev + amount;
      if (newExp >= expToBPLevel) {
        setBpLevel((l) => l + 1);
        return newExp - expToBPLevel;
      }
      return newExp;
    });
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleTap = () => {
    if (energy <= 0) return;
    const isMegaCrit = Math.random() < 0.05;
    const isUltraCrit = Math.random() < 0.01;
    let reward = tapPower * multiplier;
    if (isUltraCrit) reward *= 20;
    else if (isMegaCrit) reward *= 5;
    setCoins((c) => c + reward);
    setEnergy((e) => e - 1);
    gainBPExp(2);
    spawnCoins();
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      if (isUltraCrit) window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      else if (isMegaCrit) window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
      else window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }
    setCritEffect(isUltraCrit ? "ULTRA CRIT 🔥" : isMegaCrit ? "MEGA CRIT 😈" : null);
    if (isUltraCrit) triggerShake();
    setTimeout(() => setCritEffect(null), 600);
  };

  const openCase = () => {
    const reward = Math.floor(Math.random() * 800 + 200);
    setCoins((c) => c + reward);
    triggerShake();
  };

  return (
    <div className={`min-h-screen bg-black text-white flex justify-center relative overflow-hidden ${shake ? "animate-pulse" : ""}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(236,72,153,0.12),transparent_40%)]" />
      <div className="w-full max-w-md p-4 space-y-4 pb-32 relative z-10">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">BerOn ⚡️</h1>
          <p className="text-xs text-zinc-500">Ultra Telegram Experience</p>
        </div>
        <AnimatePresence mode="wait">
          {activeTab === "mine" && (
            <motion.div key="mine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <Card className="bg-zinc-950/80 shadow-[0_0_30px_rgba(99,102,241,0.35)]">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold">{Math.floor(coins)}</div>
                  <div className="text-xs text-zinc-500">BER Coins</div>
                </CardContent>
              </Card>
              <div className="flex justify-center py-4 relative">
                <motion.button onClick={handleTap} whileTap={{ scale: 0.9 }}>
                  <div className="w-44 h-44 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-6xl shadow-[0_0_80px_rgba(139,92,246,1)]">⚡️</div>
                </motion.button>
                <AnimatePresence>
                  {critEffect && (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="absolute text-lg font-bold text-pink-400">
                      {critEffect}
                    </motion.div>
                  )}
                </AnimatePresence>
                {flyingCoins.map((coin) => (
                  <motion.div key={coin.id} initial={{ opacity: 1, x: 0, y: 0 }} animate={{ opacity: 0, x: coin.x, y: coin.y }} transition={{ duration: 0.8 }} className="absolute text-yellow-400">
                    🪙
                  </motion.div>
                ))}
              </div>
              <Card className="bg-zinc-950/80">
                <CardContent className="p-3 flex justify-between text-xs text-zinc-400">
                  <span>Energy</span>
                  <span>{energy} / {maxEnergy}</span>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
