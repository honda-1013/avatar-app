"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { motion } from "framer-motion";
import "swiper/css";

const emojiList = ["🍑", "🍓", "🥳", "☺️", "🍇", "🍍", "🌈", "🎶", "⭐️"];

export default function CardPage() {
  const [stamps, setStamps] = useState<number[][]>(
    Array(5).fill(Array(9).fill(0))
  );
  const swiperRef = useRef<SwiperClass | null>(null);
  const qrRegionRef = useRef<HTMLDivElement>(null);

  const pushStamp = useCallback(() => {
    const index = swiperRef.current?.realIndex || 0;
    const card = [...stamps[index]];
    const nextIndex = card.findIndex((s) => s === 0);
    if (nextIndex !== -1) {
      card[nextIndex] = 1;
      const newStamps = [...stamps];
      newStamps[index] = card;
      setStamps(newStamps);
    } else if (index < 4) {
      const newStamps = [...stamps];
      newStamps[index + 1][0] = 1;
      setStamps(newStamps);
      swiperRef.current?.slideTo(index + 1);
    }
  }, [stamps]);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrRegionRef.current!.id);
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        () => {
          pushStamp();
        },
        (err) => {
          console.error("QRコード読み取りエラー:", err);
        }
      );

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [pushStamp]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-white">
        <div ref={qrRegionRef} id="qr-reader" className="w-[250px] h-[250px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4 bg-gray-100">
        <h1 className="text-xl font-bold">スタンプカード</h1>

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
      </div>
    </div>
  );
}
