'use client';

import React from 'react';

const Silk: React.FC<{ speed?: number; scale?: number; color?: string; noiseIntensity?: number; rotation?: number }> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes silk-flow {
          0% {
            transform: translateY(-100%) rotate(${rotation}deg);
          }
          100% {
            transform: translateY(100%) rotate(${rotation}deg);
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

        .silk-layer {
          position: absolute;
          width: 200%;
          height: 200%;
          animation: silk-flow ${6 / speed}s linear infinite;
          opacity: 0.8;
        }

        .silk-layer svg {
          width: 100%;
          height: 100%;
        }

        .silk-wave {
          fill: ${color};
          filter: drop-shadow(0 0 ${noiseIntensity * 5}px rgba(255,107,53,0.3));
        }
      `}</style>

      <div className="silk-layer" style={{ animationDuration: `${6 / speed}s` }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path className="silk-wave" d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="silk-layer" style={{ animationDuration: `${8 / speed}s`, animationDelay: `-2s` }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path className="silk-wave" d="M0,60 Q300,10 600,60 T1200,60 L1200,120 L0,120 Z" style={{ opacity: 0.5 }} />
        </svg>
      </div>

      <div className="silk-layer" style={{ animationDuration: `${10 / speed}s`, animationDelay: `-4s` }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path className="silk-wave" d="M0,70 Q300,20 600,70 T1200,70 L1200,120 L0,120 Z" style={{ opacity: 0.3 }} />
        </svg>
      </div>
    </div>
  );
};

export default Silk;

