'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Html5Qrcode } from 'html5-qrcode'
import { motion } from 'framer-motion'

const emojiList = ['🍑', '🍓', '🥳', '☺️', '🧃', '🌈', '🦄', '🎁', '✨']
const TOTAL_STAMPS = 45
const STAMPS_PER_PAGE = 9
const TOTAL_PAGES = TOTAL_STAMPS / STAMPS_PER_PAGE

export default function StampPage() {
  const [stamps, setStamps] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const cameraRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    const startScanner = async () => {
      if (scannerRef.current || !cameraRef.current) return

      const html5QrCode = new Html5Qrcode('reader')
      scannerRef.current = html5QrCode

      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: 200,
          },
          (decodedText) => {
            html5QrCode.pause()
            handleScan(decodedText)
            setTimeout(() => html5QrCode.resume(), 2000)
          }
        )
      } catch (err) {
        console.error('カメラ起動失敗', err)
      }
    }

    startScanner()

    return () => {
      scannerRef.current?.stop().then(() => {
        scannerRef.current = null
      })
    }
  }, [])

  const handleScan = (text: string) => {
    if (stamps < TOTAL_STAMPS) {
      setStamps((prev) => prev + 1)
    }
  }

  const getEmoji = (index: number) => {
    return emojiList[index % emojiList.length]
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-2xl font-bold text-pink-700">スタンプカード</h1>

      {/* カメラエリア */}
      <div
        id="reader"
        ref={cameraRef}
        className="w-[300px] h-[200px] border-2 border-pink-400 rounded-lg"
      />

      {/* スタンプカード（スワイプ式） */}
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
        className="w-full max-w-sm"
      >
        {Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
          <SwiperSlide key={pageIndex}>
            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-md">
              {Array.from({ length: STAMPS_PER_PAGE }).map((_, i) => {
                const stampIndex = pageIndex * STAMPS_PER_PAGE + i
                const isStamped = stampIndex < stamps

                return (
                  <motion.div
                    key={stampIndex}
                    className="w-20 h-20 border-2 border-pink-300 rounded-full flex items-center justify-center text-2xl"
                    animate={isStamped ? { scale: [0.8, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {isStamped ? getEmoji(stampIndex) : ''}
                  </motion.div>
                )
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 現在のスタンプ数 */}
      <p className="text-pink-600">
        スタンプ：{stamps} / {TOTAL_STAMPS}
      </p>
    </div>
  )
}

