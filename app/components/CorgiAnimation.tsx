// import { useState, useEffect, useRef } from 'react';

// interface CorgiProps {
//   score: number;
// }

// export default function Corgi({ score }: CorgiProps) {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [corgiImage, setCorgiImage] = useState<HTMLImageElement | null>(null);
//   const isAnimatingRef = useRef(false);

//   useEffect(() => {
//     const img = new Image();
//     img.src = '/killa.png';
//     img.onload = () => setCorgiImage(img);
//   }, []);

//   const launchCorgiConfetti = () => {
//     if (!canvasRef.current || !corgiImage || isAnimatingRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const particles = Array.from({ length: 50 }).map(() => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height - canvas.height,
//       size: 30 + Math.random() * 200,
//       speed: Math.random() * 2 + 5,
//       rotation: Math.random() * 360,
//       rotationSpeed: Math.random() * 4,
//     }));

//     isAnimatingRef.current = true;

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       let isParticlesActive = false;
//       particles.forEach((p) => {
//         p.y += p.speed;
//         p.rotation += p.rotationSpeed;

//         if (p.y < canvas.height) isParticlesActive = true;

//         ctx.save();
//         ctx.translate(p.x, p.y);
//         ctx.rotate((p.rotation * Math.PI) / 180);
//         ctx.drawImage(corgiImage, -p.size / 2, -p.size / 2, p.size, p.size);
//         ctx.restore();
//       });

//       if (isParticlesActive) {
//         requestAnimationFrame(animate);
//       } else {
//         isAnimatingRef.current = false;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//       }
//     };

//     animate();
//   };

//   useEffect(() => {
//     if (score > 0) launchCorgiConfetti();
//   }, [score]);


//   return (
//     <div className="relative">
//       <canvas
//         ref={canvasRef}
//         width={350}
//         height={800}
//         className="absolute top-0 left-0 pointer-events-none"
//       />
//     </div>
//   );
// }

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CorgiProps {
  score: number;
}

export default function Corgi({ score }: CorgiProps) {

  const handleCorrectAnswer = () => {
    launchCorgiConfetti();
  };

  const launchCorgiConfetti = () => {
    const count = 300;
    const defaults = {
      particleCount: 1,
      spread: 55,
      origin: { y: 0.6 }
    };

    for (let i = 0; i < count; i++) {
      confetti({
        ...defaults,
        particleCount: 1,
        // shapes: ['image'],
        scalar: 1,
        // image: {
        //   src: '/killa.png',
        //   width: 40,  // Adjust the width of each piece
        //   height: 40  // Adjust the height of each piece
        // },
        angle: Math.random() * 360, // Random angle for each piece
      });
    }
  };

  useEffect(() => {
    if (score > 0) handleCorrectAnswer();
  }, [score]);

  return (
    <div>

    </div>
  );
}
