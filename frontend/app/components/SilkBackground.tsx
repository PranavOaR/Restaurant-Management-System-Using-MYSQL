'use client';

import Silk from './Silk';

export function SilkBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Silk
        speed={5}
        scale={1.2}
        color="#FF6B35"
        noiseIntensity={1.5}
        rotation={0}
      />
    </div>
  );
}
