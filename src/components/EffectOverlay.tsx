"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EffectOverlayProps {
  trigger: boolean;
  onComplete: () => void;
  emoji: string;
}

const EffectOverlay: React.FC<EffectOverlayProps> = ({ trigger, onComplete, emoji }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute text-3xl"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EffectOverlay;


