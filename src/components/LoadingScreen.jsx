import React, { useState, useEffect } from 'react'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('載入中...')

  useEffect(() => {
    const loadingSteps = [
      { progress: 15, text: '初始化系統...' },
      { progress: 30, text: '載入醫師資料...' },
      { progress: 45, text: '載入員工資料...' },
      { progress: 60, text: '載入客戶資料...' },
      { progress: 75, text: '載入預約資料...' },
      { progress: 90, text: '準備就緒...' },
      { progress: 100, text: '載入完成！' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress)
        setLoadingText(loadingSteps[currentStep].text)
        currentStep++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onLoadingComplete()
        }, 800)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 背景動畫粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-30 animation-delay-3000"></div>
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 text-center">
        {/* 主要載入圓圈 */}
        <div className="relative w-40 h-40 mx-auto mb-12">
          {/* 外圈旋轉動畫 */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
          
          {/* 內圈反向旋轉 */}
          <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-cyan-400 border-l-pink-400 animate-spin-reverse"></div>
          
          {/* 進度圓圈 */}
          <svg className="absolute inset-2 w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* 中心LOGO */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl tracking-wider">F</span>
            </div>
          </div>
        </div>

        {/* 標題 */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-wider">
            FLOS曜診所
          </h1>
          <p className="text-xl text-slate-300 tracking-wide">
            預約管理系統
          </p>
        </div>

        {/* 進度條 */}
        <div className="w-96 mx-auto mb-6">
          <div className="bg-slate-700/50 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 載入文字和進度 */}
        <div className="mb-8">
          <div className="text-slate-200 text-lg mb-2 font-medium">
            {loadingText}
          </div>
          <div className="text-blue-300 text-sm font-mono">
            {progress}%
          </div>
        </div>

        {/* 載入點動畫 */}
        <div className="flex justify-center space-x-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg animation-delay-200"></div>
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-lg animation-delay-400"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
