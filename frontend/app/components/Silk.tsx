'use client';

import React from 'react';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

const Silk: React.FC<SilkProps> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes silk-shimmer {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        @keyframes silk-wave-1 {
          0%, 100% {
            transform: translateY(-10%) translateX(0) skewY(1deg);
          }
          25% {
            transform: translateY(-5%) translateX(2%) skewY(-1deg);
          }
          50% {
            transform: translateY(0%) translateX(0) skewY(1deg);
          }
          75% {
            transform: translateY(-5%) translateX(-2%) skewY(-1deg);
          }
        }

        @keyframes silk-wave-2 {
          0%, 100% {
            transform: translateY(0%) translateX(0) skewY(-1deg);
          }
          25% {
            transform: translateY(-8%) translateX(-2%) skewY(1deg);
          }
          50% {
            transform: translateY(-5%) translateX(0) skewY(-1deg);
          }
          75% {
            transform: translateY(0%) translateX(2%) skewY(1deg);
          }
        }

        @keyframes silk-wave-3 {
          0%, 100% {
            transform: translateY(-5%) translateX(0) skewY(0deg);
          }
          25% {
            transform: translateY(-3%) translateX(1%) skewY(0.5deg);
          }
          50% {
            transform: translateY(0%) translateX(0) skewY(0deg);
          }
          75% {
            transform: translateY(-3%) translateX(-1%) skewY(-0.5deg);
          }
        }

        .silk-container {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%);
          background-size: 400% 400%;
          animation: silk-shimmer ${20 / speed}s ease-in-out infinite;
          overflow: hidden;
        }

        .silk-layer {
          position: absolute;
          inset: 0;
          opacity: 0.4;
          mix-blend-mode: screen;
        }

        .silk-layer:nth-child(1) {
          animation: silk-wave-1 ${8 / speed}s ease-in-out infinite;
          background: radial-gradient(
            ellipse 80% 30% at 50% 50%,
            rgba(123, 116, 129, 0.8) 0%,
            rgba(123, 116, 129, 0.3) 40%,
            transparent 70%
          );
        }

        .silk-layer:nth-child(2) {
          animation: silk-wave-2 ${12 / speed}s ease-in-out infinite;
          animation-delay: -${4 / speed}s;
          background: radial-gradient(
            ellipse 60% 40% at 50% 30%,
            rgba(147, 112, 219, 0.6) 0%,
            rgba(147, 112, 219, 0.2) 50%,
            transparent 80%
          );
        }

        .silk-layer:nth-child(3) {
          animation: silk-wave-3 ${10 / speed}s ease-in-out infinite;
          animation-delay: -${2 / speed}s;
          background: radial-gradient(
            ellipse 100% 50% at 50% 60%,
            rgba(123, 116, 129, 0.5) 0%,
            rgba(123, 116, 129, 0.1) 60%,
            transparent 90%
          );
        }

        .silk-noise {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          mix-blend-mode: overlay;
          background-image: 
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.1) 2px,
              rgba(255, 255, 255, 0.1) 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.1) 2px,
              rgba(255, 255, 255, 0.1) 4px
            );
        }
      `}</style>

      <div className="silk-container">
        <div className="silk-layer" style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="silk-layer" style={{ transform: `rotate(${rotation + 120}deg)` }} />
        <div className="silk-layer" style={{ transform: `rotate(${rotation + 240}deg)` }} />
        <div className="silk-noise" />
      </div>
    </div>
  );
};

export default Silk;

