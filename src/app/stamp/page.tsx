'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const emojiList = ['🍑', '🍓', '🥳', '☺️', '🧃', '🌈', '🦄', '🎁', '✨']

export default function StampPage() {
  const [stamps, setStamps] = useState(0)

  const handleAddStamp = () => {
    if (stamps < 9) {
      setStamps(stamps + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">スタンプカード</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="w-20 h-20 rounded-full border-2 border-pink-400 flex items-center justify-center text-3xl bg-white"
            animate={i < stamps ? { scale: [0.8, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {i < stamps ? emojiList[i % emojiList.length] : ''}
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleAddStamp}
        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md"
      >
        QRコードを読み取る（仮）
      </button>

      {stamps >= 9 && (
        <p className="mt-6 text-pink-600 font-semibold text-lg">
          🎉 スタンプカード完成！おめでとう！
        </p>
      )}
    </div>
  )
}
