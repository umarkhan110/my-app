import { useState, useEffect, useRef } from 'react';

interface CorgiProps {
  score: number;
}

export default function Corgi({ score }: CorgiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [corgiImage, setCorgiImage] = useState<HTMLImageElement | null>(null);
  const isAnimatingRef = useRef(false);

  // Load the corgi image only once
  useEffect(() => {
    const img = new Image();
    img.src = '/killa.png';
    img.onload = () => setCorgiImage(img);
  }, []);

  // Custom confetti launcher
  const launchCorgiConfetti = () => {
    if (!canvasRef.current || !corgiImage || isAnimatingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 30 + Math.random() * 200,
      speed: Math.random() * 2 + 5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4,
    }));

    isAnimatingRef.current = true;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let isParticlesActive = false;
      particles.forEach((p) => {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;

        if (p.y < canvas.height) isParticlesActive = true; // Check if any particle is still in view

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.drawImage(corgiImage, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (isParticlesActive) {
        requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false; // Stop the animation once particles are out of view
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      }
    };

    animate();
  };

  useEffect(() => {
    if (score > 0) launchCorgiConfetti();
  }, [score]);

  const canvasWidth = typeof window !== 'undefined' ? window.innerWidth : 800; // Fallback width
  const canvasHeight = typeof window !== 'undefined' ? window.innerHeight : 600; // Fallback height

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
    width={canvasWidth}
        height={canvasHeight}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </div>
  );
}
