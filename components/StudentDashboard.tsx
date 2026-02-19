
import React, { useState } from 'react';
import { Group, Homework } from '../types';
import { BookOpen, Trophy, Play, CheckCircle, Clock, Star, Zap } from 'lucide-react';
import HomeworkGame from './HomeworkGame';

interface StudentDashboardProps {
  groups: Group[];
  userName: string;
  completedIds: string[];
  onComplete: (id: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ groups, userName, completedIds, onComplete }) => {
  const [activeGame, setActiveGame] = useState<Homework | null>(null);

  if (activeGame) {
    return (
      <HomeworkGame 
        homework={activeGame} 
        onBack={() => setActiveGame(null)} 
        onComplete={(id) => {
          onComplete(id);
        }} 
      />
    );
  }

  const totalDone = completedIds.length;

  return (
    <div className="p-5 space-y-6">
      {/* Welcome Banner */}
      <div className="game-gradient p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Привет, {userName}! 👋</h2>
          <p className="text-blue-100 text-sm mb-4">Твой прогресс в обучении растет каждый день.</p>
          <div className="flex gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold">{totalDone * 20} XP</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-300" />
              <span className="text-xs font-bold">{totalDone} Сделано</span>
            </div>
          </div>
        </div>
        <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Всего заданий выполнено</p>
          <h4 className="text-xl font-black text-gray-900">{totalDone}</h4>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Zap className="w-6 h-6 fill-current" />
        </div>
      </div>

      <h3 className="text-lg font-bold">Твои Предметы</h3>
      
      <div className="space-y-4">
        {groups?.map(group => (
          <div key={group.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h4 className="font-bold text-gray-800">{group.name}</h4>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Учитель: @{group.teacherNickname}</span>
            </div>
            
            <div className="p-4 space-y-3">
              {(group.lessons?.length || 0) > 0 ? (
                group.lessons?.map(lesson => {
                  const isDone = lesson.homework && completedIds.includes(lesson.homework.id);
                  return (
                    <div key={lesson.id} className={`p-4 rounded-2xl flex items-center justify-between transition-all border ${isDone ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDone ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {isDone ? <CheckCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                        </div>
                        <div>
                          <h5 className={`font-bold leading-tight ${isDone ? 'text-green-900' : 'text-gray-900'}`}>{lesson.topic}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className={`w-3 h-3 ${isDone ? 'text-green-400' : 'text-gray-400'}`} />
                            <span className={`text-[10px] ${isDone ? 'text-green-600' : 'text-gray-400'}`}>
                              {isDone ? 'Завершено' : 'Домашнее задание'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {lesson.homework && (
                        isDone ? (
                          <div className="bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1">
                             Готово
                          </div>
                        ) : (
                          <button 
                            onClick={() => setActiveGame(lesson.homework!)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
                          >
                            <Play className="w-4 h-4 fill-current" /> Начать
                          </button>
                        )
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">В этой группе пока нет уроков</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {(!groups || groups.length === 0) && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
             <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-2" />
             <p className="text-gray-400 text-sm">Вас еще не добавили ни в одну группу.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
