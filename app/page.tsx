"use client";
import { useState, useEffect } from 'react';
// import { Wheel } from 'react-custom-roulette';
import Corgi from './components/CorgiAnimation';
import CustomPinwheel from './components/CustomPinwheel';
interface OptionData {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
}

interface QuestionData {
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
}
const data:OptionData[] = [
  { option: 'audits', style: { backgroundColor: '#FF6B6B', textColor: 'white' } },
  { option: 'financial-reports', style: { backgroundColor: '#4ECDC4', textColor: 'white' } },
  { option: 'Data Sites', style: { backgroundColor: '#45B7D1', textColor: 'white' } },
  { option: 'Budget', style: { backgroundColor: '#FFA07A', textColor: 'white' } },
];

export default function Home() {
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(3);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [options, setOptions] = useState<Record<string, string>>({});
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setError('');
    }
  };

  const fetchQuestion = async (category: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/generate-question/${category}`);
      if (response.ok) {
        const result: QuestionData = await response.json();
        console.log(result);
        setCurrentQuestion(result.question);
        setOptions(result.options);
        setCorrectAnswer(result.correctAnswer);
      } else {
        setError(response.statusText);
        console.error("Failed to fetch question:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mustSpin) {
      const category = data[prizeNumber].option;
      setCurrentCategory(category);
      setUserAnswer("");
      setShowAnswer(false);
      fetchQuestion(category);
    }
  }, [mustSpin, prizeNumber]);

  const handleSubmit = () => {
    if (userAnswer === correctAnswer?.split(".")[0]) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="bg-gray-800 shadow-xl rounded-lg p-6 w-full max-w-lg text-[#41ffca]">
        <div className="text-3xl font-bold flex items-center justify-center mb-6">
          LA Controllers Trivia Challenge
        </div>
        <Corgi score={score}/>
        <div className="flex items-center justify-center mb-4">
          <div className="w-64 h-auto flex justify-center items-center">
            <CustomPinwheel
              mustSpin={mustSpin}
              data={data}
              onStopSpinning={() => setMustSpin(false)}
            />
          </div>
        </div>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold capitalize">{currentCategory.replace('-', ' ')}</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin w-8 h-8 border-4 border-[#41ffca] border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-red-500">
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <>
            <p className="text-lg text-center mb-4">{currentQuestion}</p>
              <div className="mb-4">
                {Object.entries(options).map(([key, option]) => (
                    <button
                    key={key}
                    onClick={() => setUserAnswer(key)}
                    className={`w-full p-2 text-left border mb-1 ${
                      userAnswer === key ? "bg-gray-400 text-[#41ffca]" : "bg-gray-800"
                    }`}
                  >
                    {key}. {option}
                  </button>
                ))}
              </div>
            <button onClick={handleSubmit} className="w-full bg-blue-500 text-black py-2 rounded mb-4">
              Submit Answer
            </button>
            {showAnswer && (
              <div className="text-center p-4 bg-gray-900 rounded-lg">
                <p className="font-semibold">Correct Answer: {correctAnswer}</p>
                <p className="text-xl mt-2">Your Score: {score}</p>
              </div>
            )}
          </>
        )}
        <button
          onClick={handleSpinClick}
          className="w-full bg-green-500 text-black py-2 rounded mt-6"
          disabled={loading}
        >
          Spin the Wheel
        </button>
      </div>
    </div>
  );
}
