"use client";

import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

const StampPage = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const swiperRef = useRef<any>(null);
  const qrRegionRef = useRef<HTMLDivElement>(null);

  const pushStamp = () => {
    const currentIndex = swiperRef.current?.swiper?.realIndex || 0;
    const currentCard = stamps[currentIndex];
    const nextStampIndex = currentCard.findIndex((s) => s === 0);

    if (nextStampIndex !== -1) {
      const updatedCard = [...currentCard];
      updatedCard[nextStampIndex] = 1;
      const newStamps = [...stamps];
      newStamps[currentIndex] = updatedCard;
      setStamps(newStamps);
    }
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    const width = qrRegionRef.current?.offsetWidth || 250;
    const height = qrRegionRef.current?.offsetHeight || 250;

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width, height },
        },
        () => {
          pushStamp();
        },
        () => {}
      )
      .catch((err) => console.error("QR start failed", err));

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-2xl font-bold">スタンプカード</h1>

      <div
        ref={qrRegionRef}
        className="relative w-full max-w-sm aspect-square border-4 border-pink-400 rounded-lg overflow-hidden"
      >
        <div id="reader" className="absolute inset-0" />
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full max-w-sm"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              {card.map((filled, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 border-2 rounded-full flex items-center justify-center text-2xl bg-white"
                  animate={{
                    scale: filled ? 1.2 : 1,
                    opacity: filled ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {filled ? emojiList[i % emojiList.length] : ""}
                </motion.div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StampPage;




