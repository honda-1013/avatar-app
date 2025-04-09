"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

export default function CardPage() {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const qrCodeRegionId = "reader";
  const swiperRef = useRef<any>(null);
  const qrRegionRef = useRef<HTMLDivElement>(null);

  const pushStamp = () => {
    const currentIndex = swiperRef.current?.swiper?.realIndex || 0;
    const newStamps = [...stamps];

    for (let i = currentIndex; i < newStamps.length; i++) {
      const currentCard = [...newStamps[i]];
      const nextStampIndex = currentCard.findIndex((s) => s === 0);

      if (nextStampIndex !== -1) {
        currentCard[nextStampIndex] = 1;
        newStamps[i] = currentCard;
        break;
      }
    }

    setStamps(newStamps);
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        () => {
          pushStamp();
        }
      )
      .catch((err: any) => {
        console.error("QR読み取りエラー:", err);
      });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-start p-4">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">スタンプカード</h1>

      <div
        ref={qrRegionRef}
        id={qrCodeRegionId}
        className="w-full max-w-xs aspect-square border-4 border-pink-300 mb-4"
      ></div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full max-w-xs"
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

      <p className="mt-4 text-pink-600 text-sm">
        スタンプを押すにはQRコードを読み取ってね📷
      </p>
    </div>
  );
}
