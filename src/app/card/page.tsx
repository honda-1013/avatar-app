"use client";

import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

const CardPage = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const qrRegionRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<{ swiper: { realIndex: number } } | null>(null);

  const pushStamp = () => {
    const currentIndex = swiperRef.current?.swiper.realIndex || 0;
    const currentCard = [...stamps[currentIndex]];
    const nextStampIndex = currentCard.findIndex((s) => s === 0);

    if (nextStampIndex !== -1) {
      currentCard[nextStampIndex] = 1;

      const newStamps = [...stamps];
      newStamps[currentIndex] = currentCard;
      setStamps(newStamps);
    }
  };

  useEffect(() => {
    if (!qrRegionRef.current) return;

    const html5QrCode = new Html5Qrcode(qrRegionRef.current.id);
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      () => {
        pushStamp();
      }
    );

    return () => {
      html5QrCode.stop().catch((err) => console.error("停止エラー:", err));
    };
  }, [pushStamp]);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">スタンプカード</h1>

      <div
        id="reader"
        ref={qrRegionRef}
        className="w-full max-w-xs aspect-square mb-6 rounded-xl border-4 border-pink-400 overflow-hidden"
      />

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper as any)}
        className="w-full max-w-xs"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-lg shadow-md">
              {card.map((filled, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 border-2 border-pink-300 rounded-full flex items-center justify-center text-2xl"
                  animate={{ scale: filled ? 1.2 : 1, opacity: filled ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  {filled ? emojiList[i % emojiList.length] : ""}
                </motion.div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="mt-4 text-pink-500 text-sm">
        スタンプを押すにはQRコードを読み取ってね📷
      </p>
    </div>
  );
};

export default CardPage;
