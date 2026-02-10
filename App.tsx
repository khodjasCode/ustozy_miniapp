
import React, { useState, useEffect } from 'react';
import { UserRole, Group, UserState } from './types';
import { MOCK_GROUPS } from './constants';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { GraduationCap, BookOpen, Users, User, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'lesson-details' | 'homework-game'>('landing');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Initial load simulation
  useEffect(() => {
    const saved = localStorage.getItem('ustozy_user');
    if (saved) {
      setUserState(JSON.parse(saved));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    const newState: UserState = {
      role,
      name: role === UserRole.TEACHER ? 'Mr. Anderson' : 'Alice Smith',
      groups: MOCK_GROUPS
    };
    setUserState(newState);
    localStorage.setItem('ustozy_user', JSON.stringify(newState));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('ustozy_user');
    setUserState(null);
    setCurrentView('landing');
  };

  if (currentView === 'landing' || !userState) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl rotate-3">
          <GraduationCap className="text-white w-14 h-14" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ustozy</h1>
        <p className="text-gray-500 mb-12 max-w-xs">Your personal educational hub for interactive learning.</p>
        
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={() => handleLogin(UserRole.TEACHER)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-3">
              <Users className="w-6 h-6" /> I'm a Teacher
            </span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">→</div>
          </button>
          
          <button 
            onClick={() => handleLogin(UserRole.STUDENT)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" /> I'm a Student
            </span>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">→</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-2xl">
      {/* App Header */}
      <header className="bg-white px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
        <div className="flex items-center gap-3">
          {currentView !== 'dashboard' && (
            <button onClick={() => setCurrentView('dashboard')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ustozy</h2>
            <p className="text-xs text-blue-500 font-medium tracking-wide uppercase">{userState.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
          <User className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {userState.role === UserRole.TEACHER ? (
          <TeacherDashboard 
            groups={userState.groups} 
            onGroupSelect={(g) => { setSelectedGroup(g); }} 
          />
        ) : (
          <StudentDashboard groups={userState.groups} />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-3 flex justify-between items-center max-w-md mx-auto z-40">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <GraduationCap className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-medium">Groups</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
