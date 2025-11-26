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
  const animationDuration = `${6 / speed}s`;

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <style>{`
        @keyframes silk-flow {
          0% {
            transform: translateY(-100%);
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0.8;
          }
        }

        @keyframes silk-wave {
          0%, 100% {
            d: path('M0,50 Q25,25 50,50 T100,50 L100,0 L0,0 Z');
          }
          50% {
            d: path('M0,30 Q25,10 50,30 T100,30 L100,0 L0,0 Z');
          }
        }

        .silk-background {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.6;
        }

        .silk-layer {
          position: absolute;
          width: 200%;
          height: 150%;
          animation: silk-flow ${animationDuration} ease-in-out infinite;
        }

        .silk-layer:nth-child(1) {
          animation-delay: 0s;
          filter: drop-shadow(0 0 ${noiseIntensity * 10}px rgba(123, 116, 129, 0.5));
        }

        .silk-layer:nth-child(2) {
          animation-delay: -${parseFloat(animationDuration) * 0.33}s;
          filter: drop-shadow(0 0 ${noiseIntensity * 8}px rgba(147, 112, 219, 0.3));
        }

        .silk-layer:nth-child(3) {
          animation-delay: -${parseFloat(animationDuration) * 0.66}s;
          filter: drop-shadow(0 0 ${noiseIntensity * 6}px rgba(123, 116, 129, 0.2));
        }

        .silk-layer svg {
          width: 100%;
          height: 100%;
          transform: rotate(${rotation}deg);
        }

        .silk-wave {
          fill: ${color};
          filter: blur(0.5px);
        }
      `}</style>

      <div className="silk-background">
        <div className="silk-layer">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="silk-wave" d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="silk-layer">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="silk-wave" d="M0,60 Q300,10 600,60 T1200,60 L1200,120 L0,120 Z" style={{ opacity: 0.6 }} />
          </svg>
        </div>

        <div className="silk-layer">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="silk-wave" d="M0,70 Q300,20 600,70 T1200,70 L1200,120 L0,120 Z" style={{ opacity: 0.3 }} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Silk;

