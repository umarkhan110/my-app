import React, { useRef, useEffect } from 'react';

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
}

const CustomPinwheel: React.FC<CustomPinwheelProps> = ({
  data,
  mustSpin,
  onStopSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spinDuration = 3000;
  const corgiImage = new Image();
  corgiImage.src = '/killa.png';

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

  const drawCorgi = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const corgiSize = 80;

    ctx.drawImage(
      corgiImage,
      centerX - corgiSize / 2,
      centerY - corgiSize / 2,
      corgiSize,
      corgiSize
    );
  };

  const drawStickyIndicator = (ctx: CanvasRenderingContext2D) => {
    const { width } = ctx.canvas;
    const indicatorHeight = 20;
    const centerX = width / 2;

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, 0); 
    ctx.lineTo(centerX + 10, 0);
    ctx.lineTo(centerX, -indicatorHeight); 
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawWheel(ctx);
        drawCorgi(ctx);
        drawStickyIndicator(ctx); 
      }
    }
  }, [data, corgiImage]);

  useEffect(() => {
    if (mustSpin) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const { width, height } = ctx.canvas;
          const centerX = width / 2;
          const centerY = height / 2;
          const startAngle = Math.random() * 2 * Math.PI; 
          let startTime: number | null = null;

          const spin = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const easeOut = (t: number) => t * (2 - t);
            const progress = Math.min(elapsed / spinDuration, 1);
            const easingProgress = easeOut(progress);
            const rotation = startAngle + (2 * Math.PI * 4 * easingProgress); 

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
            drawWheel(ctx);
            drawCorgi(ctx); 
            ctx.restore();

            drawStickyIndicator(ctx);

            if (progress < 1) {
              requestAnimationFrame(spin);
            } else {
              const finalAngle = rotation % (2 * Math.PI);
              const sectionIndex = Math.floor(data.length - (finalAngle / (2 * Math.PI)) * data.length) % data.length;
              onStopSpinning(data[sectionIndex].option);
            }
          };

          requestAnimationFrame(spin);
        }
      }
    }
  }, [mustSpin, onStopSpinning, data]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={400} height={400} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <svg width="20" height="20" style={{ marginBottom: '10px' }}>
          <polygon points="20,20 20,0 0,10" fill="#FFD700" />
        </svg>
      </div>
    </div>
  );
};

export default CustomPinwheel;
