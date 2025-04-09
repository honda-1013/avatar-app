"use client";

import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

const CardPage: React.FC = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const swiperRef = useRef<{ swiper: { realIndex: number } } | null>(null);
  const qrRegionRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

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
    const html5QrCode = new Html5Qrcode(qrRegionRef.current!.id);

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        () => pushStamp(),
        (errorMessage) => console.warn("読み取りエラー:", errorMessage)
      )
      .catch((err) => console.error("QR起動エラー:", err));

    return () => {
      html5QrCode.stop().catch((err) => console.error("停止エラー:", err));
    };
  }, [pushStamp]); // React Hook依存関係エラー回避

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start">
      <div
        ref={qrRegionRef}
        id="reader"
        className="w-[250px] h-[250px] mt-4 rounded-md overflow-hidden"
      />

      <h1 className="text-2xl font-bold my-4 text-center">スタンプカード</h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = { swiper })}
        className="w-full max-w-xs"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-3 place-items-center">
              {card.map((filled, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center text-2xl bg-white"
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

      <div className="mt-6 flex justify-around w-full border-t py-2 bg-white fixed bottom-0">
        {["メニュー", "マイページ", "ホーム", "カード"].map((label) => (
          <div key={label} className="text-black text-sm">{label}</div>
        ))}
      </div>
    </div>
  );
};

export default CardPage;
