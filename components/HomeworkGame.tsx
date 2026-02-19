
import React, { useState, useEffect } from 'react';
import { Homework, Task } from '../types';
import { X, CheckCircle, ArrowRight, Star, RefreshCw, Trophy } from 'lucide-react';

interface HomeworkGameProps {
  homework: Homework;
  onBack: () => void;
  onComplete: (id: string) => void;
}

const HomeworkGame: React.FC<HomeworkGameProps> = ({ homework, onBack, onComplete }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userAnswer, setUserAnswer] = useState<any>(null);

  const currentTask = tasks[currentTaskIndex];

  useEffect(() => {
    if (homework?.tasks) {
      setTasks([...homework.tasks].sort(() => Math.random() - 0.5));
    }
  }, [homework?.tasks]);

  const handleCheck = () => {
    if (!currentTask) return;
    const isCorrect = String(userAnswer).toLowerCase().trim() === String(currentTask.correctAnswer).toLowerCase().trim();
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
      onComplete(homework.id);
    }
  };

  const restart = () => {
    setCurrentTaskIndex(0);
    setScore(0);
    setGameState('playing');
    setTasks([...tasks].sort(() => Math.random() - 0.5));
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8">
        <p className="text-gray-400">Loading tasks...</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-gray-100 rounded-xl">Go Back</button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Отличная работа!</h2>
        <p className="text-gray-500 mb-8">Вы выполнили задание "{homework.title}"</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-10">
          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-[10px] font-bold text-gray-400 uppercase">СЧЕТ</p>
            <p className="text-2xl font-black text-gray-800">{score}/{tasks.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-[10px] font-bold text-gray-400 uppercase">ОПЫТ</p>
            <p className="text-2xl font-black text-blue-600">+{score * 20}</p>
          </div>
        </div>

        <button onClick={onBack} className="w-full max-w-xs py-5 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-100">
          Продолжить
        </button>
      </div>
    );
  }

  if (!currentTask) return null;

  const taskText = currentTask.data?.text || '';
  const parts = taskText.split(/\[___\]|___| _ /g);
  const options = currentTask.data?.options || [];

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col max-w-md mx-auto h-screen overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b bg-white z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400"><X /></button>
        <div className="flex-1 px-6">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${((currentTaskIndex + 1) / tasks.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1 font-bold text-gray-600">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span>{score}</span>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 pb-40">
        <div className="mt-4 mb-8 text-center">
          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3">
            {currentTask.type.replace('-', ' ')}
          </p>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            {currentTask.question}
          </h2>
        </div>

        <div className="flex flex-col justify-center min-h-[50%]">
          {currentTask.type === 'fill-blanks' ? (
            <div className="space-y-12">
              <p className="text-2xl text-center leading-relaxed font-medium text-gray-700">
                {parts.map((part, idx) => (
                  <React.Fragment key={idx}>
                    {part}
                    {idx < parts.length - 1 && (
                      <span className="inline-block px-4 py-1 mx-2 bg-blue-50 border-b-4 border-blue-500 min-w-[100px] text-center rounded-lg text-blue-600 font-black transition-all">
                        {userAnswer || '...'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          ) : (
             <div className="mb-4"></div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {options.map((opt: string) => (
              <button 
                key={opt}
                disabled={gameState === 'feedback'}
                onClick={() => setUserAnswer(opt)}
                className={`p-5 rounded-3xl border-2 font-bold text-lg transition-all ${
                  userAnswer === opt 
                    ? 'bg-blue-600 border-blue-600 text-white scale-[1.02] shadow-xl shadow-blue-100' 
                    : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'
                } ${gameState === 'feedback' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className={`p-6 border-t fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 ${gameState === 'feedback' ? (lastAnswerCorrect ? 'bg-green-50 shadow-[0_-10px_20px_rgba(34,197,94,0.1)]' : 'bg-red-50 shadow-[0_-10px_20px_rgba(239,68,68,0.1)]') : 'bg-white'}`}>
        {gameState === 'playing' ? (
          <button 
            disabled={!userAnswer}
            onClick={handleCheck}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${
              userAnswer ? 'bg-blue-600 text-white shadow-blue-100 active:scale-[0.98]' : 'bg-gray-100 text-gray-400 shadow-none'
            }`}
          >
            Проверить
          </button>
        ) : (
          <div className="animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${lastAnswerCorrect ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-red-500 shadow-lg shadow-red-200'}`}>
                {lastAnswerCorrect ? <CheckCircle className="text-white w-8 h-8" /> : <X className="text-white w-8 h-8" />}
              </div>
              <div className="flex-1">
                <h4 className={`text-xl font-black leading-tight ${lastAnswerCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {lastAnswerCorrect ? 'Великолепно!' : 'Почти получилось'}
                </h4>
                {!lastAnswerCorrect && (
                  <p className="text-red-600 font-bold text-sm">Правильный ответ: {currentTask.correctAnswer}</p>
                )}
                {lastAnswerCorrect && (
                  <p className="text-green-600 font-bold text-sm">+20 опыта получено</p>
                )}
              </div>
            </div>
            <button 
              onClick={nextTask}
              className={`w-full py-5 rounded-2xl font-black text-xl text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                lastAnswerCorrect ? 'bg-green-600 shadow-green-100' : 'bg-red-600 shadow-red-100'
              }`}
            >
              Следующий <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeworkGame;
