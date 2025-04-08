"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import { Html5Qrcode } from "html5-qrcode";
import type SwiperClass from "swiper";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

export default function StampPage() {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const swiperRef = useRef<SwiperClass | null>(null);
  const qrRef = useRef<Html5Qrcode | null>(null);

  const handleScan = useCallback((decodedText: string) => {
    console.log("QR読み取り成功:", decodedText);
    if (!decodedText) return;
    const currentIndex = swiperRef.current?.realIndex || 0;
    const currentCard = stamps[currentIndex];
    const nextIndex = currentCard.findIndex((s) => s === 0);
    if (nextIndex !== -1) {
      const newCard = [...currentCard];
      newCard[nextIndex] = 1;
      const newStamps = [...stamps];
      newStamps[currentIndex] = newCard;
      setStamps(newStamps);
    }
  }, [stamps]);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    qrRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
        },
        (text) => {
          scanner.pause();
          handleScan(text);
          setTimeout(() => scanner.resume(), 1500);
        },
        (err) => console.warn("QRスキャンエラー:", err)
      )
      .catch((err) => console.error("カメラ起動エラー:", err));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [handleScan]);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-2xl font-bold text-pink-700">スタンプカード</h1>

      <div id="qr-reader" className="w-72 h-48 border-2 border-pink-400 rounded-md" />

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full max-w-sm"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-md">
              {card.map((filled, i) => (
                <motion.div
                  key={i}
                  className="w-20 h-20 border-2 border-pink-300 rounded-full flex items-center justify-center text-2xl"
                  animate={filled ? { scale: [0.8, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {filled ? emojiList[i % emojiList.length] : ""}
                </motion.div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="text-pink-600 text-sm">
        スタンプを押すにはQRコードを読み取ってね📷
      </p>
    </div>
  );
}



