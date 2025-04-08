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
  const qrCodeRegionId = "reader";
  const swiperRef = useRef<{ swiper: { realIndex: number } } | null>(null); // ✅ 型を明確に指定

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 }
        },
        () => {
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
        },
        (err) => console.error("QRコードエラー:", err)
      )
      .catch((err) => console.error("開始エラー:", err));

    return () => {
      html5QrCode.stop().catch((err) => console.error("停止エラー:", err));
    };
  }, [stamps]); // ✅ stamps を依存に追加

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">スタンプカード</h1>

      <div className="w-full max-w-sm h-[50vh] border-4 border-pink-300 rounded-lg overflow-hidden mb-4">
        <div id={qrCodeRegionId} className="w-full h-full" />
      </div>

      <div className="w-full max-w-sm h-[50vh] flex flex-col items-center justify-start">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full"
        >
          {stamps.map((card, cardIndex) => (
            <SwiperSlide key={cardIndex}>
              <div className="grid grid-cols-3 gap-3 p-4">
                {card.map((filled, i) => (
                  <motion.div
                    key={i}
                    className="w-20 h-20 border-2 border-pink-400 rounded-full flex items-center justify-center text-2xl bg-white"
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
        <p className="text-pink-600 text-sm mt-2">
          スタンプを押すにはQRコードを読み取ってね📷
        </p>
      </div>
    </div>
  );
};

export default StampPage;




