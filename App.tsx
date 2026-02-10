
import React, { useState, useEffect } from 'react';
import { UserRole, UserState } from './types';
import { MOCK_GROUPS } from './constants';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ProfileView from './components/ProfileView';
import GroupsView from './components/GroupsView';
import { GraduationCap, BookOpen, Users, User, LogOut, Phone, Smartphone, Lock, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [view, setView] = useState<'login' | 'onboarding' | 'main'>('login');
  const [activeTab, setActiveTab] = useState<'home' | 'groups' | 'profile'>('home');
  
  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Onboarding form state
  const [onboardForm, setOnboardForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    const saved = localStorage.getItem('ustozy_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserState(parsed);
      setView(parsed.onboarded ? 'main' : 'onboarding');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    let role: UserRole | null = null;
    if (loginForm.username === 'admin' && loginForm.password === '456') {
      role = UserRole.TEACHER;
    } else if (loginForm.username === 'student' && loginForm.password === '777') {
      role = UserRole.STUDENT;
    }

    if (role) {
      const newState: UserState = {
        role,
        username: loginForm.username,
        onboarded: false,
        groups: MOCK_GROUPS
      };
      setUserState(newState);
      setView('onboarding');
      localStorage.setItem('ustozy_user', JSON.stringify(newState));
    } else {
      setLoginError('Invalid credentials. Hint: admin/456 or student/777');
    }
  };

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userState) return;

    const updatedState: UserState = {
      ...userState,
      name: onboardForm.name,
      phone: onboardForm.phone,
      onboarded: true
    };
    setUserState(updatedState);
    setView('main');
    localStorage.setItem('ustozy_user', JSON.stringify(updatedState));
  };

  const handleLogout = () => {
    localStorage.removeItem('ustozy_user');
    setUserState(null);
    setView('login');
    setActiveTab('home');
    setLoginForm({ username: '', password: '' });
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-blue-100 rotate-6">
          <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Ustozy</h1>
        <p className="text-gray-400 mb-8 text-center max-w-[240px]">Educational platform for the next generation.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <UserCircle className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Username"
              required
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white transition-all outline-none"
              value={loginForm.username}
              onChange={e => setLoginForm({...loginForm, username: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            <input 
              type="password"
              placeholder="Password"
              required
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white transition-all outline-none"
              value={loginForm.password}
              onChange={e => setLoginForm({...loginForm, password: e.target.value})}
            />
          </div>
          {loginError && <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
            Sign In
          </button>
        </form>
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col">
        <div className="mt-12 mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Complete Profile</h2>
          <p className="text-gray-500">We need a few more details to set up your account.</p>
        </div>

        <form onSubmit={handleOnboarding} className="space-y-5 flex-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-widest">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="John Doe"
                required
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white transition-all outline-none"
                value={onboardForm.name}
                onChange={e => setOnboardForm({...onboardForm, name: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-widest">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="tel"
                placeholder="+998 90 123 45 67"
                required
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:bg-white transition-all outline-none"
                value={onboardForm.phone}
                onChange={e => setOnboardForm({...onboardForm, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="pt-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3">
              Start Learning <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <header className="bg-white px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userState?.role === UserRole.TEACHER ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Ustozy</h2>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{activeTab}</p>
          </div>
        </div>
        <button onClick={() => setActiveTab('profile')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userState?.username}`} alt="avatar" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          userState?.role === UserRole.TEACHER ? (
            <TeacherDashboard groups={userState.groups} onGroupSelect={() => {}} />
          ) : (
            <StudentDashboard groups={userState.groups} />
          )
        )}
        {activeTab === 'groups' && <GroupsView groups={userState?.groups || []} />}
        {activeTab === 'profile' && <ProfileView user={userState!} onLogout={handleLogout} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center max-w-md mx-auto z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <GraduationCap className="w-6 h-6" fill={activeTab === 'home' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'groups' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Users className="w-6 h-6" fill={activeTab === 'groups' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold">Groups</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <User className="w-6 h-6" fill={activeTab === 'profile' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
