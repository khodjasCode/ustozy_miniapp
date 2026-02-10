
import React, { useState, useEffect } from 'react';
import { Homework, Task } from '../types';
import { X, CheckCircle, ArrowRight, Star, RefreshCw, Trophy } from 'lucide-react';

interface HomeworkGameProps {
  homework: Homework;
  onBack: () => void;
}

const HomeworkGame: React.FC<HomeworkGameProps> = ({ homework, onBack }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userAnswer, setUserAnswer] = useState<any>(null);

  const currentTask = tasks[currentTaskIndex];

  useEffect(() => {
    // Shuffle tasks on start
    setTasks([...homework.tasks].sort(() => Math.random() - 0.5));
  }, [homework.tasks]);

  const handleCheck = () => {
    const isCorrect = userAnswer === currentTask.correctAnswer;
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);
    setGameState('feedback');
  };

  const nextTask = () => {
    if (currentTaskIndex + 1 < tasks.length) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setUserAnswer(null);
      setGameState('playing');
    } else {
      setGameState('finished');
    }
  };

  const restart = () => {
    setCurrentTaskIndex(0);
    setScore(0);
    setGameState('playing');
    setTasks([...tasks].sort(() => Math.random() - 0.5));
  };

  if (tasks.length === 0) return null;

  if (gameState === 'finished') {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Well Done!</h2>
        <p className="text-gray-500 mb-8">You finished "{homework.title}" with a great score!</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-10">
          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-[10px] font-bold text-gray-400 uppercase">SCORE</p>
            <p className="text-2xl font-black text-gray-800">{score}/{tasks.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-[10px] font-bold text-gray-400 uppercase">XP EARNED</p>
            <p className="text-2xl font-black text-blue-600">+{score * 20}</p>
          </div>
        </div>

        <div className="space-y-3 w-full max-w-xs">
          <button 
            onClick={onBack}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={restart}
            className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 z-[200] flex flex-col max-w-md mx-auto">
      {/* Game Header */}
      <div className="p-5 flex items-center justify-between bg-white border-b">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400"><X /></button>
        <div className="flex-1 px-6">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${((currentTaskIndex) / tasks.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1 font-bold text-gray-600">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span>{score}</span>
        </div>
      </div>

      {/* Task Content */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="mb-10 text-center">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">{currentTask.type.replace('-', ' ')}</p>
          <h2 className="text-2xl font-bold text-gray-900">{currentTask.question}</h2>
        </div>

        {/* Task UI specific to type */}
        <div className="flex-1">
          {currentTask.type === 'fill-blanks' && (
            <div className="space-y-8">
              <p className="text-xl text-center leading-loose">
                {currentTask.data.text.split('[___]').map((part: string, idx: number, arr: any) => (
                  <React.Fragment key={idx}>
                    {part}
                    {idx < arr.length - 1 && (
                      <span className="inline-block px-3 py-1 bg-white border-b-2 border-blue-500 min-w-[80px] text-center mx-1 rounded-md text-blue-600 font-bold">
                        {userAnswer || '?'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {currentTask.data.options.map((opt: string) => (
                  <button 
                    key={opt}
                    onClick={() => setUserAnswer(opt)}
                    className={`p-4 rounded-2xl border-2 font-bold transition-all ${userAnswer === opt ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-100 text-gray-600 shadow-sm'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentTask.type === 'multiple-choice' && (
             <div className="space-y-3">
               {currentTask.data.options.map((opt: string) => (
                  <button 
                    key={opt}
                    onClick={() => setUserAnswer(opt)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${userAnswer === opt ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-100 text-gray-600 shadow-sm'}`}
                  >
                    {opt}
                    {userAnswer === opt && <CheckCircle className="w-5 h-5" />}
                  </button>
                ))}
             </div>
          )}

          {/* Fallback for complex types in this prototype */}
          {(currentTask.type === 'word-order' || currentTask.type === 'matching') && (
            <div className="text-center py-10 bg-white border rounded-3xl p-6">
              <p className="text-gray-400 italic mb-4">Task type: {currentTask.type} logic integrated in production.</p>
              <button 
                onClick={() => setUserAnswer(currentTask.correctAnswer)}
                className="bg-blue-100 text-blue-600 px-6 py-3 rounded-2xl font-bold"
              >
                Auto-fill Answer (Demo)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className={`p-6 border-t ${gameState === 'feedback' ? (lastAnswerCorrect ? 'bg-green-50' : 'bg-red-50') : 'bg-white'}`}>
        {gameState === 'playing' ? (
          <button 
            disabled={!userAnswer}
            onClick={handleCheck}
            className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all ${userAnswer ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-gray-200 text-gray-400 shadow-none'}`}
          >
            Check Answer
          </button>
        ) : (
          <div className="animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {lastAnswerCorrect ? <CheckCircle className="text-white" /> : <X className="text-white" />}
              </div>
              <div>
                <h4 className={`text-xl font-bold ${lastAnswerCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {lastAnswerCorrect ? 'Excellent!' : 'Correct answer: ' + currentTask.correctAnswer}
                </h4>
                <p className={`text-sm ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {lastAnswerCorrect ? 'You earned +20 XP' : 'Keep practicing, you got this!'}
                </p>
              </div>
            </div>
            <button 
              onClick={nextTask}
              className={`w-full py-5 rounded-2xl font-bold text-lg text-white shadow-xl flex items-center justify-center gap-2 ${lastAnswerCorrect ? 'bg-green-600 shadow-green-100' : 'bg-red-600 shadow-red-100'}`}
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeworkGame;
