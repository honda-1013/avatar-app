"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

const StampPage = () => {
  const [stamps, setStamps] = useState<number[]>(Array(9).fill(0));
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrRef.current) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 200, height: 200 },
      },
      (decodedText: string) => {
        const nextIndex = stamps.findIndex((s) => s === 0);
        if (nextIndex !== -1) {
          const newStamps = [...stamps];
          newStamps[nextIndex] = 1;
          setStamps(newStamps);
        }
      },
      (err) => {
        console.error("QR Error:", err);
      }
    );

    return () => {
      html5QrCode.stop().catch((err) => console.error("Stop failed", err));
    };
  }, [stamps]);

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {/* QRコード読み取りエリア（上半分） */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div
          id="qr-reader"
          ref={qrRef}
          className="w-60 h-60 border-4 border-pink-400 rounded-lg overflow-hidden"
        ></div>
      </div>

      {/* スタンプカード（下半分） */}
      <div className="flex-1 flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">スタンプカード</h1>
        <div className="grid grid-cols-3 gap-4">
          {stamps.map((filled, i) => (
            <motion.div
              key={i}
              className="w-20 h-20 border-2 border-pink-400 rounded-full flex items-center justify-center text-3xl bg-white"
              animate={{ scale: filled ? 1.2 : 1, opacity: filled ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {filled ? emojiList[i % emojiList.length] : ""}
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-pink-600 mt-4">スタンプを押すにはQRコードを読み取ってね📷</p>
      </div>
    </div>
  );
};

export default StampPage;




