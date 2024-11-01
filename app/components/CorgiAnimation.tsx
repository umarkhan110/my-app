import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
interface CorgiProps {
  score: number;
}
export default function Corgi({ score }: CorgiProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (score > 0) {
            setShowConfetti(true);
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [score]);

    return (
        <>
            {showConfetti && <Confetti />}
        </>
    );
};
