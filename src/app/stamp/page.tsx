"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

const StampPage = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const swiperRef = useRef<any>(null);
  const scannerRef = useRef<any>(null);

  const handleScan = useCallback((decodedText: string) => {
    console.log("読み取り結果:", decodedText);
    alert(`読み取りました: ${decodedText}`);

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
  }, [stamps]);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scannerRef.current.render(
        handleScan,
        (err: any) => console.warn("読み取りエラー", err)
      );
    }
  }, [handleScan]);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">スタンプカード</h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full max-w-sm"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-4">
              {card.map((filled, i) => (
                <motion.div
                  key={i}
                  className="w-20 h-20 border-2 border-pink-400 rounded-full flex items-center justify-center text-3xl bg-white"
                  animate={{ scale: filled ? 1.2 : 1, opacity: filled ? 1 : 0.4 }}
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
        <div id="qr-reader" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}></div>
      </div>

      <p className="text-pink-500 text-sm mt-4">
        スタンプを押すにはQRコードを読み取ってね📷
      </p>
    </div>
  );
};

export default StampPage;




