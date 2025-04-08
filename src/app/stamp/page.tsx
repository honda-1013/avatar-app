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
  const qrCodeRegionId = "qr-reader";

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
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
        },
        () => {
          pushStamp();
        }
      )
      .catch((err) => {
        console.error("QRコードの読み取りに失敗しました", err);
      });

    return () => {
      html5QrCode.stop().catch((err) => console.error("停止エラー", err));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between p-4">
      {/* QRコード読み取り画面 */}
      <div className="w-full max-w-xs h-1/2 flex items-center justify-center">
        <div id={qrCodeRegionId} className="w-52 h-52" />
      </div>

      {/* スタンプカード */}
      <div className="w-full max-w-xs h-1/2 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-2">スタンプカード</h1>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full"
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
    </div>
  );
};

export default StampPage;




