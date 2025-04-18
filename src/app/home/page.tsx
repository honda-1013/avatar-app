"use client";

import { useState } from "react";

export default function HomePage() {
  const [avatarColor, setAvatarColor] = useState("bg-blue-400");

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">アバター作成</h1>
      
      {/* カラーの丸 */}
      <div className={`w-32 h-32 rounded-full ${avatarColor}`}></div>
      
      {/* ここに画像を追加！ */}
      <div className="relative w-40 h-40 mt-4">
        <img
          src="/avatar.png"
          alt="Avatar"
          className="w-full h-full object-contain touch-manipulation"
        />
      </div>

      {/* 色ボタン */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setAvatarColor("bg-blue-400")}
          className="p-2 rounded bg-blue-400 text-white"
        >
          青
        </button>
        <button
          onClick={() => setAvatarColor("bg-pink-400")}
          className="p-2 rounded bg-pink-400 text-white"
        >
          ピンク
        </button>
        <button
          onClick={() => setAvatarColor("bg-green-400")}
          className="p-2 rounded bg-green-400 text-white"
        >
          緑
        </button>
      </div>
    </div>
  );
}
