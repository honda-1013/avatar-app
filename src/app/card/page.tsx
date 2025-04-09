"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

const Page = () => {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5)
      .fill(0)
      .map(() => Array(9).fill(0))
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);
  const qrRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      } else if (currentIndex < stamps.length - 1) {
        const nextCardIndex = currentIndex + 1;
        const updatedNextCard = [...stamps[nextCardIndex]];
        const nextIndex = updatedNextCard.findIndex((s) => s === 0);
        if (nextIndex !== -1) {
          updatedNextCard[nextIndex] = 1;
          const newStamps = [...stamps];
          newStamps[nextCardIndex] = updatedNextCard;
          setStamps(newStamps);
          swiperRef.current?.swiper?.slideTo(nextCardIndex);
        }
      }
    };

    const html5QrCode = new Html5Qrcode(qrRegionRef.current!.id);
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        () => {
          pushStamp();
        }
      )
      .catch((err) => console.error("QR error", err));

    return () => {
      html5QrCode.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <div ref={qrRegionRef} id="qr-region" className="w-[250px] h-[250px] mb-4" />
      <h1 className="text-xl font-bold mb-4 text-black">スタンプカード</h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSwiper={(swiper: any) => (swiperRef.current = swiper)}
        className="w-full max-w-xs"
      >
        {stamps.map((card, cardIndex) => (
          <SwiperSlide key={cardIndex}>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
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

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-2">
        <span className="text-black">メニュー</span>
        <span className="text-black">マイページ</span>
        <span className="text-black">ホーム</span>
        <span className="text-black">カード</span>
      </nav>
    </div>
  );
};

export default Page;
