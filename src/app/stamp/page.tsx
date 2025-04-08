"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

interface SwiperRef {
  swiper: {
    realIndex: number;
    slideTo: (index: number) => void;
  };
}

const StampPage = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const swiperRef = useRef<SwiperRef | null>(null);
  const qrRegionRef = useRef<HTMLDivElement | null>(null);

  const pushStamp = () => {
    const currentIndex = swiperRef.current?.swiper.realIndex || 0;
    const currentCard = stamps[currentIndex];
    const nextStampIndex = currentCard.findIndex((s) => s === 0);

    if (nextStampIndex !== -1) {
      const updatedCard = [...currentCard];
      updatedCard[nextStampIndex] = 1;

      const newStamps = [...stamps];
      newStamps[currentIndex] = updatedCard;
      setStamps(newStamps);

      if (nextStampIndex === updatedCard.length - 1) {
        const nextCardIndex = currentIndex + 1;
        if (nextCardIndex < stamps.length) {
          setTimeout(() => {
            swiperRef.current?.swiper.slideTo(nextCardIndex);
          }, 500);
        }
      }
    }
  };

  useEffect(() => {
    if (!qrRegionRef.current) return;

    const html5QrCode = new Html5Qrcode(qrRegionRef.current.id);
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        () => {
          pushStamp();
        },
        (errorMessage) => {
          console.warn("QRスキャンエラー:", errorMessage);
        }
      )
      .catch((err) => {
        console.error("QR読み取り開始エラー", err);
      });

    return () => {
      html5QrCode.stop().catch((err) => {
        console.error("QR停止エラー", err);
      });
    };
  }, [pushStamp]); // ←依存配列修正済み！

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-between p-4">
      <h1 className="text-2xl font-bold text-pink-600 mb-2">スタンプカード</h1>

      <div
        ref={qrRegionRef}
        id="qr-reader"
        className="w-full max-w-xs aspect-square bg-white mb-4"
      />

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = { swiper })}
        className="w-full max-w-sm"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-2">
              {card.map((filled, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 border-2 border-pink-300 rounded-full flex items-center justify-center text-2xl bg-white"
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

      <p className="text-pink-600 mt-4">
        スタンプを押すにはQRコードを読み取ってね📷
      </p>
    </div>
  );
};

export default StampPage;


