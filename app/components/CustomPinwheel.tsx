import React, { useRef, useEffect, useState } from 'react';

interface OptionData {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
}

interface CustomPinwheelProps {
  data: OptionData[];
  mustSpin: boolean;
  onStopSpinning: (prize: string) => void;
  setPrizeName: (prizeNumber: number) => void;
}

const CustomPinwheel: React.FC<CustomPinwheelProps> = ({
  data,
  mustSpin,
  onStopSpinning,
  setPrizeName
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [corgiRotationAngle, setCorgiRotationAngle] = useState(0);
  const spinDuration = 3000;

  const drawWheel = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const angle = (2 * Math.PI) / data.length;
    ctx.font = '800 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    data.forEach((item, index) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, index * angle, (index + 1) * angle);
      ctx.fillStyle = item.style.backgroundColor;
      ctx.fill();
      ctx.stroke();
      ctx.save();

      ctx.translate(centerX, centerY);
      ctx.rotate((index + 0.5) * angle);
      ctx.fillStyle = item.style.textColor;
      ctx.fillText(item.option, radius / 2, 0);
      ctx.restore();
    });
  };

  useEffect(() => { 
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawWheel(ctx);
      }
    }
  }, [data]);

  useEffect(() => {
    if (mustSpin) {
      let startTime: number | null = null;
      const startAngle = Math.random() * 2 * Math.PI;

      const spinCorgi = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const easeOut = (t: number) => t * (2 - t);
        const progress = Math.min(elapsed / spinDuration, 1);
        const easingProgress = easeOut(progress);
        const rotation = startAngle + (2 * Math.PI * 4 * easingProgress);

        setCorgiRotationAngle(rotation);

        if (progress < 1) {
          requestAnimationFrame(spinCorgi);
        } else {
          const finalAngle = rotation % (2 * Math.PI);
          const sectionIndex = Math.floor(data.length - (finalAngle / (2 * Math.PI)) * data.length) % data.length;

          const selectedPrize = data[sectionIndex].option;
          setPrizeName(sectionIndex);
          onStopSpinning(selectedPrize);
        }
      };

      requestAnimationFrame(spinCorgi);
    }
  }, [mustSpin, onStopSpinning, data]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={400} height={400} />
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: `translateX(-50%) rotate(${corgiRotationAngle}rad)`,
          transformOrigin: 'center 250px',
          zIndex: 1,
        }}
      >
        <img src="/killa.png" height={80} width={80} />
      </div>
    </div>
  );
};

export default CustomPinwheel;
