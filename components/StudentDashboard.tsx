
import React, { useState } from 'react';
import { Group, Homework, Task } from '../types';
import { BookOpen, Trophy, Play, CheckCircle, Clock, Star, Zap } from 'lucide-react';
import HomeworkGame from './HomeworkGame';

interface StudentDashboardProps {
  groups: Group[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ groups }) => {
  const [activeGame, setActiveGame] = useState<Homework | null>(null);

  if (activeGame) {
    return <HomeworkGame homework={activeGame} onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="p-5 space-y-6">
      {/* Welcome Banner */}
      <div className="game-gradient p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Hi, Alice! 👋</h2>
          <p className="text-blue-100 text-sm mb-4">You have 2 new homework assignments to complete.</p>
          <div className="flex gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold">1,240 XP</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 fill-orange-400 text-orange-400" />
              <span className="text-xs font-bold">5 Day Streak</span>
            </div>
          </div>
        </div>
        <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
      </div>

      <h3 className="text-lg font-bold">Your Subjects</h3>
      
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h4 className="font-bold text-gray-800">{group.name}</h4>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">My Teacher: Mr. Anderson</span>
            </div>
            
            <div className="p-4 space-y-3">
              {group.lessons.length > 0 ? (
                group.lessons.map(lesson => (
                  <div key={lesson.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 leading-tight">{lesson.topic}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-400">Published 2h ago</span>
                        </div>
                      </div>
                    </div>
                    
                    {lesson.homework && (
                      <button 
                        onClick={() => setActiveGame(lesson.homework!)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" /> Start
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No active lessons in this group</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
