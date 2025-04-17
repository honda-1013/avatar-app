"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  trigger: boolean;
  onComplete: () => void;
  emoji: string;
};

const EffectOverlay = ({ trigger, onComplete, emoji }: Props) => {
  const [flyingEmojis, setFlyingEmojis] = useState<
    { id: number; x: number; y: number; rotation: number }[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger) return;

    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    const newEmojis = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      rotation: Math.random() * 360,
    }));

    setFlyingEmojis(newEmojis);

    const timer = setTimeout(() => {
      setFlyingEmojis([]);
      onComplete();
    }, 1500); // エフェクト時間

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence>
        {flyingEmojis.map((e) => (
          <motion.div
            key={e.id}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            animate={{
              x: e.x,
              y: e.y,
              rotate: e.rotation,
              opacity: 0,
              scale: 2,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute text-3xl"
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EffectOverlay;



