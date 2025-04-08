"use client";

import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

const StampPage = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const swiperRef = useRef<any>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      const currentIndex = swiperRef.current?.swiper.realIndex || 0;
      const currentCard = stamps[currentIndex];
      const nextStampIndex = currentCard.findIndex((s) => s === 0);

      if (nextStampIndex !== -1) {
        const updatedCard = [...currentCard];
        updatedCard[nextStampIndex] = 1;

        const newStamps = [...stamps];
        newStamps[currentIndex] = updatedCard;
        setStamps(newStamps);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">スタンプカード</h1>

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
                  className="w-16 h-16 border-2 rounded-full flex items-center justify-center text-2xl bg-white"
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

      <div className="mt-6 w-full max-w-sm">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default StampPage;


