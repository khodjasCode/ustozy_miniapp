
import React, { useState, useEffect } from 'react';
import { UserRole, UserState, Group, GlobalDB } from './types';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ProfileView from './components/ProfileView';
import GroupsView from './components/GroupsView';
import { GraduationCap, BookOpen, Users, User, Phone, Lock, UserCircle, AtSign } from 'lucide-react';

const DB_KEY = 'ustozy_global_db';
const SESSION_KEY = 'ustozy_session';

const getDB = (): GlobalDB => {
  try {
    const data = localStorage.getItem(DB_KEY);
    const parsed = data ? JSON.parse(data) : { users: [], groups: [] };
    // Ensure properties exist
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      groups: Array.isArray(parsed.groups) ? parsed.groups : []
    };
  } catch (e) {
    return { users: [], groups: [] };
  }
};

const saveDB = (db: GlobalDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [view, setView] = useState<'login' | 'onboarding' | 'main'>('login');
  const [activeTab, setActiveTab] = useState<'home' | 'groups' | 'profile'>('home');
  const [globalGroups, setGlobalGroups] = useState<Group[]>([]);
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [onboardForm, setOnboardForm] = useState({ nickname: '', name: '', phone: '' });

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    const db = getDB();
    if (session) {
      const parsed = JSON.parse(session);
      setUserState(parsed);
      setView('main');
    }
    setGlobalGroups(db.groups || []);
  }, []);

  const refreshData = () => {
    const db = getDB();
    setGlobalGroups(db.groups || []);
  };

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
      const db = getDB();
      const existingUser = db.users.find(u => u.username === loginForm.username);
      
      if (existingUser) {
        setUserState(existingUser);
        setView('main');
        localStorage.setItem(SESSION_KEY, JSON.stringify(existingUser));
      } else {
        setView('onboarding');
      }
    } else {
      setLoginError('Try admin/456 or student/777');
    }
  };

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const db = getDB();
    const nickname = onboardForm.nickname.toLowerCase().trim().replace('@', '');

    if (!nickname) {
      alert("Nickname cannot be empty");
      return;
    }

    if (db.users.some(u => u.nickname === nickname)) {
      alert("This nickname is already taken!");
      return;
    }

    const newUser: UserState = {
      role: loginForm.username === 'admin' ? UserRole.TEACHER : UserRole.STUDENT,
      username: loginForm.username,
      nickname,
      name: onboardForm.name,
      phone: onboardForm.phone,
      onboarded: true
    };

    db.users.push(newUser);
    saveDB(db);
    setUserState(newUser);
    setView('main');
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUserState(null);
    setView('login');
    setActiveTab('home');
    setLoginForm({ username: '', password: '' });
  };

  const myGroups = (globalGroups || []).filter(g => 
    userState?.role === UserRole.TEACHER 
      ? g.teacherNickname === userState.nickname 
      : (g.studentNicknames || []).includes(userState?.nickname || '')
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {view === 'login' ? (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl rotate-6">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Ustozy</h1>
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 mt-4">
            <div className="relative">
              <UserCircle className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="text" placeholder="Username" required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="password" placeholder="Password" required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            {loginError && <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>}
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg">Sign In</button>
          </form>
        </div>
      ) : view === 'onboarding' ? (
        <div className="min-h-screen bg-white p-8 flex flex-col">
          <h2 className="text-3xl font-black text-gray-900 mt-12 mb-2">Create Profile</h2>
          <p className="text-gray-500 mb-8">Choose your unique nickname.</p>
          <form onSubmit={handleOnboarding} className="space-y-4">
            <div className="relative">
              <AtSign className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="text" placeholder="nickname" required
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none"
                value={onboardForm.nickname}
                onChange={e => setOnboardForm({...onboardForm, nickname: e.target.value})}
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="text" placeholder="Full Name" required
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none"
                value={onboardForm.name}
                onChange={e => setOnboardForm({...onboardForm, name: e.target.value})}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="tel" placeholder="Phone Number" required
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none"
                value={onboardForm.phone}
                onChange={e => setOnboardForm({...onboardForm, phone: e.target.value})}
              />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-xl mt-4">Get Started</button>
          </form>
        </div>
      ) : (
        <>
          <header className="bg-white px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userState?.role === UserRole.TEACHER ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Ustozy</h2>
            </div>
            <button onClick={() => setActiveTab('profile')} className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userState?.nickname}`} alt="avatar" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto pb-24">
            {activeTab === 'home' && (
              userState?.role === UserRole.TEACHER ? (
                <TeacherDashboard groups={myGroups} onGroupSelect={refreshData} userNickname={userState.nickname} />
              ) : (
                <StudentDashboard groups={myGroups} userName={userState?.name || userState?.nickname || 'Student'} />
              )
            )}
            {activeTab === 'groups' && <GroupsView groups={myGroups} role={userState?.role} onUpdate={refreshData} teacherNickname={userState?.nickname} />}
            {activeTab === 'profile' && <ProfileView user={userState!} onLogout={handleLogout} />}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center max-w-md mx-auto z-40">
            <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
              <GraduationCap className="w-6 h-6" fill={activeTab === 'home' ? 'currentColor' : 'none'} />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button onClick={() => setActiveTab('groups')} className={`flex flex-col items-center gap-1 ${activeTab === 'groups' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Users className="w-6 h-6" fill={activeTab === 'groups' ? 'currentColor' : 'none'} />
              <span className="text-[10px] font-bold">Groups</span>
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
              <User className="w-6 h-6" fill={activeTab === 'profile' ? 'currentColor' : 'none'} />
              <span className="text-[10px] font-bold">Profile</span>
            </button>
          </nav>
        </>
      )}
    </div>
  );
};

export default App;
