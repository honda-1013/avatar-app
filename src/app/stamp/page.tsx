'use client';
import React, { useState } from 'react';

const StampPage = () => {
  const [stamps, setStamps] = useState(0);

  const handleScan = () => {
    if (stamps < 5) {
      setStamps(stamps + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">スタンプカード</h1>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 border-2 rounded-full flex items-center justify-center text-xl ${
              i < stamps ? 'bg-green-400 text-white' : 'bg-white'
            }`}
          >
            {i < stamps ? '✓' : ''}
          </div>
        ))}
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleScan}
      >
        QRをスキャン！（仮ボタン）
      </button>

      {stamps >= 5 && (
        <div className="mt-6 text-green-700 font-semibold">
          🎉 特典ゲットおめでとう！
        </div>
      )}
    </div>
  );
};

export default StampPage;
