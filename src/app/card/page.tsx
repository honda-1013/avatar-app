"use client";

import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🍇", "🍊", "🍋", "🍌", "🍉", "🥝", "⭐️"];

const CardPage = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const qrRegionRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

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
    const html5QrCode = new Html5Qrcode(qrRegionRef.current!.id);
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText: string) => {
        if (decodedText) {
          pushStamp();
        }
      },
      (errorMessage: string) => {
        console.error(errorMessage);
      }
    );

    return () => {
      html5QrCode.stop().catch((err: any) => console.error("Failed to stop", err));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex flex-col items-center mt-4">
        <div
          id="qr-reader"
          ref={qrRegionRef}
          className="w-[250px] h-[250px] bg-white rounded-md shadow-md"
        />
        <h2 className="mt-4 text-lg font-semibold text-black">スタンプカード</h2>

        <div className="w-full mt-4 px-4">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            onSwiper={(swiper) => (swiperRef.current = { swiper })}
            className="w-full"
          >
            {stamps.map((card, cardIndex) => (
              <SwiperSlide key={cardIndex}>
                <div className="grid grid-cols-3 gap-4 justify-items-center">
                  {card.map((filled, i) => (
                    <motion.div
                      key={i}
                      className="w-16 h-16 border-2 rounded-full flex items-center justify-center border-gray-400"
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
      </div>

      <footer className="w-full flex justify-around py-2 border-t bg-white text-black text-sm">
        <span>メニュー</span>
        <span>マイページ</span>
        <span>ホーム</span>
        <span>カード</span>
      </footer>
    </div>
  );
};

export default CardPage;

