"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🍒", "🍇", "🍉", "🍍", "🥝", "🍎", "⭐"];

const CardPage = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const qrRegionRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<{ swiper: { realIndex: number } } | null>(null);

  const pushStamp = useCallback(() => {
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
  }, [stamps]);

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
        (error) => {
          console.warn("QR decode error", error);
        }
      )
      .catch((err) => console.error("Failed to start QR scanner", err));
  
    return () => {
      html5QrCode.stop().catch((err) => console.error("Failed to stop", err));
    };
  }, [pushStamp]);  

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f4f8f7] pt-4">
      <div
        id="reader"
        ref={qrRegionRef}
        className="w-[90vw] max-w-[350px] aspect-square bg-white rounded-xl overflow-hidden shadow"
      />
      <h2 className="text-lg font-semibold text-black mt-4 mb-2">
        スタンプカード
      </h2>
      <div className="w-full px-4">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = { swiper })}
        >
          {stamps.map((card, cardIndex) => (
            <SwiperSlide key={cardIndex}>
              <div className="grid grid-cols-3 gap-4 p-4">
                {card.map((filled, i) => (
                  <motion.div
                    key={i}
                    className="w-16 h-16 border-2 rounded-full flex items-center justify-center"
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
      <nav className="fixed bottom-0 left-0 w-full bg-white text-black flex justify-around py-2 border-t">
        <span>メニュー</span>
        <span>マイページ</span>
        <span>ホーム</span>
        <span>カード</span>
      </nav>
    </div>
  );
};

export default CardPage;

