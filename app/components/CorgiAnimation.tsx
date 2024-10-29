import { useState, useEffect } from 'react';

interface CorgiProps {
  score: number;
}

export default function Corgi({ score }: CorgiProps) {
  const [corgiSize, setCorgiSize] = useState(100);
  const [corgiEating, setCorgiEating] = useState(false);

  const handleCorrectAnswer = () => {
    setCorgiSize((prevSize) => prevSize + 10);
    setCorgiEating(true);
    setTimeout(() => setCorgiEating(false), 1000);
  };

  useEffect(() => {
    if (score > 0) handleCorrectAnswer();
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <img
          src="/killa.png"
          alt="Corgi"
          className={`transition-transform duration-500 ${corgiEating ? 'scale-110' : ''}`}
          style={{ width: `${corgiSize}px`, height: `${corgiSize}px` }}
        />
        {corgiEating && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded-lg animate-bounce">
            Yum!
          </div>
        )}
      </div>
    </div>
  );
}
