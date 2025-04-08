/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (!qrRegionRef.current) return;

    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
        },
        (decodedText: string) => {
          const currentIndex = swiperRef.current?.swiper?.realIndex || 0;
          const currentCard = stamps[currentIndex];
          const nextIndex = currentCard.findIndex((s) => s === 0);
          if (nextIndex !== -1) {
            const updatedCard = [...currentCard];
            updatedCard[nextIndex] = 1;
            const newStamps = [...stamps];
            newStamps[currentIndex] = updatedCard;
            setStamps(newStamps);
          }
        }
      )
      .catch((err) => console.error("QR start error", err));

    return () => {
      html5QrCode.stop().catch((err) => console.error("QR stop error", err));
    };
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">スタンプカード</h1>

      <div
        id="qr-reader"
        ref={qrRegionRef}
        className="mb-4 border-4 border-pink-400 rounded"
        style={{ width: "300px", height: "300px" }}
      />

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full max-w-sm"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-2">
              {card.map((filled, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 border-2 border-pink-400 rounded-full flex items-center justify-center text-2xl bg-white"
                  animate={{ scale: filled ? 1.2 : 1, opacity: filled ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  {filled ? emojiList[i % emojiList.length] : ""}
                </motion.div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="text-pink-600 text-sm mt-4">
        スタンプを押すにはQRコードを読み取ってね📷
      </p>
    </div>
  );
};

export default StampPage;




