
import React, { useState, useEffect } from 'react';
import { UserRole, UserState, Group, GlobalDB } from './types';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ProfileView from './components/ProfileView';
import GroupsView from './components/GroupsView';
import { GraduationCap, Users, User, Phone, Lock, AtSign, ChevronRight, LogIn, UserPlus } from 'lucide-react';

const DB_KEY = 'ustozy_global_db';
const SESSION_KEY = 'ustozy_session';

const getDB = (): GlobalDB => {
  try {
    const data = localStorage.getItem(DB_KEY);
    const parsed = data ? JSON.parse(data) : { users: [], groups: [] };
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
  const [view, setView] = useState<'role-selection' | 'teacher-auth' | 'auth-form' | 'main'>('role-selection');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'groups' | 'profile'>('home');
  const [globalGroups, setGlobalGroups] = useState<Group[]>([]);
  
  // Form states
  const [teacherPass, setTeacherPass] = useState('');
  const [authForm, setAuthForm] = useState({ nickname: '', name: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    const db = getDB();
    if (session) {
      const parsed = JSON.parse(session);
      // Re-sync with DB to get latest completed stats
      const dbUser = db.users.find(u => u.nickname === parsed.nickname);
      setUserState(dbUser || parsed);
      setView('main');
    }
    setGlobalGroups(db.groups || []);
  }, []);

  const refreshData = () => {
    const db = getDB();
    setGlobalGroups(db.groups || []);
    if (userState) {
      const updatedUser = db.users.find(u => u.nickname === userState.nickname);
      if (updatedUser) setUserState(updatedUser);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === UserRole.TEACHER) {
      setView('teacher-auth');
    } else {
      setView('auth-form');
    }
    setError('');
  };

  const handleTeacherPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherPass === '456') {
      setView('auth-form');
      setError('');
    } else {
      setError('Неверный код доступа');
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const db = getDB();
    const cleanNick = authForm.nickname.toLowerCase().trim().replace('@', '');

    if (!cleanNick) {
      setError('Введите никнейм');
      return;
    }

    if (authMode === 'login') {
      const user = db.users.find(u => u.nickname === cleanNick);
      if (user) {
        if (user.role !== selectedRole) {
          setError(`Этот аккаунт зарегистрирован как ${user.role === UserRole.TEACHER ? 'Учитель' : 'Ученик'}`);
          return;
        }
        setUserState(user);
        setView('main');
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        setError('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
      }
    } else {
      // Registration logic
      if (db.users.some(u => u.nickname === cleanNick)) {
        setError('Этот никнейм уже занят');
        return;
      }
      if (!authForm.name || !authForm.phone) {
        setError('Заполните все поля');
        return;
      }

      const newUser: UserState = {
        role: selectedRole!,
        username: cleanNick,
        nickname: cleanNick,
        name: authForm.name,
        phone: authForm.phone,
        onboarded: true,
        completedHomeworkIds: []
      };

      db.users.push(newUser);
      saveDB(db);
      setUserState(newUser);
      setView('main');
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    }
  };

  const handleHomeworkComplete = (homeworkId: string) => {
    if (!userState) return;
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.nickname === userState.nickname);
    if (userIndex !== -1) {
      const user = db.users[userIndex];
      const completed = user.completedHomeworkIds || [];
      if (!completed.includes(homeworkId)) {
        user.completedHomeworkIds = [...completed, homeworkId];
        db.users[userIndex] = user;
        saveDB(db);
        setUserState({ ...user });
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUserState(null);
    setView('role-selection');
    setActiveTab('home');
    setAuthForm({ nickname: '', name: '', phone: '' });
    setTeacherPass('');
    setError('');
  };

  const myGroups = (globalGroups || []).filter(g => 
    userState?.role === UserRole.TEACHER 
      ? g.teacherNickname === userState.nickname 
      : (g.studentNicknames || []).includes(userState?.nickname || '')
  );

  if (view === 'role-selection') {
    return (
      <div className="min-h-screen bg-white flex flex-col p-8 justify-center">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl rotate-6 mx-auto">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Ustozy</h1>
          <p className="text-gray-500 font-medium">Добро пожаловать в будущее обучения</p>
        </div>
        
        <div className="space-y-4">
          <button onClick={() => handleRoleSelect(UserRole.TEACHER)} className="w-full bg-blue-50 p-6 rounded-3xl border-2 border-transparent hover:border-blue-500 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Lock className="w-6 h-6" /></div>
              <div className="text-left">
                <span className="block text-lg font-black text-blue-900">Я Учитель</span>
                <span className="text-xs text-blue-400 font-medium">Создавайте уроки и группы</span>
              </div>
            </div>
            <ChevronRight className="text-blue-300 group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => handleRoleSelect(UserRole.STUDENT)} className="w-full bg-purple-50 p-6 rounded-3xl border-2 border-transparent hover:border-purple-500 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white"><User className="w-6 h-6" /></div>
              <div className="text-left">
                <span className="block text-lg font-black text-purple-900">Я Ученик</span>
                <span className="text-xs text-purple-400 font-medium">Выполняйте задания и учитесь</span>
              </div>
            </div>
            <ChevronRight className="text-purple-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'teacher-auth') {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col justify-center">
        <button onClick={() => setView('role-selection')} className="absolute top-8 left-8 text-blue-600 font-bold">← Назад</button>
        <h2 className="text-3xl font-black mb-2">Доступ для учителей</h2>
        <p className="text-gray-500 mb-8">Введите секретный код для подтверждения роли учителя.</p>
        <form onSubmit={handleTeacherPass} className="space-y-4">
          <input type="password" placeholder="Код доступа" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 px-6 outline-none focus:border-blue-500 text-center text-2xl tracking-[1em]" value={teacherPass} onChange={e => setTeacherPass(e.target.value)} />
          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl">Подтвердить</button>
        </form>
      </div>
    );
  }

  if (view === 'auth-form') {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col">
        <button onClick={() => setView('role-selection')} className="self-start text-blue-600 font-bold mb-8">← Сменить роль</button>
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${authMode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><LogIn className="w-4 h-4" /> Вход</button>
          <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${authMode === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><UserPlus className="w-4 h-4" /> Регистрация</button>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">{authMode === 'login' ? 'С возвращением!' : 'Давайте знакомиться'}</h2>
        <p className="text-gray-500 mb-8">{authMode === 'login' ? 'Введите ваш никнейм для входа' : 'Заполните данные для создания профиля'}</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <AtSign className="absolute left-5 top-5 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="ваш_никнейм" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:border-blue-500 outline-none font-bold" value={authForm.nickname} onChange={e => setAuthForm({...authForm, nickname: e.target.value})} />
          </div>
          {authMode === 'register' && (
            <>
              <div className="relative"><User className="absolute left-5 top-5 text-gray-400 w-5 h-5" /><input type="text" placeholder="Имя и Фамилия" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:border-blue-500 outline-none font-bold" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} /></div>
              <div className="relative"><Phone className="absolute left-5 top-5 text-gray-400 w-5 h-5" /><input type="tel" placeholder="Номер телефона" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:border-blue-500 outline-none font-bold" value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} /></div>
            </>
          )}
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
          <button className={`w-full text-white font-black py-5 rounded-2xl shadow-xl mt-4 ${selectedRole === UserRole.TEACHER ? 'bg-blue-600 shadow-blue-100' : 'bg-purple-600 shadow-purple-100'}`}>
            {authMode === 'login' ? 'Войти в аккаунт' : 'Создать профиль'}
          </button>
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
            <StudentDashboard 
              groups={myGroups} 
              userName={userState?.name || userState?.nickname || 'Student'} 
              completedIds={userState?.completedHomeworkIds || []}
              onComplete={handleHomeworkComplete}
            />
          )
        )}
        {activeTab === 'groups' && <GroupsView groups={myGroups} role={userState?.role} onUpdate={refreshData} teacherNickname={userState?.nickname} />}
        {activeTab === 'profile' && <ProfileView user={userState!} onLogout={handleLogout} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center max-w-md mx-auto z-40">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
          <GraduationCap className="w-6 h-6" fill={activeTab === 'home' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold">Главная</span>
        </button>
        <button onClick={() => setActiveTab('groups')} className={`flex flex-col items-center gap-1 ${activeTab === 'groups' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Users className="w-6 h-6" fill={activeTab === 'groups' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold">Группы</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <User className="w-6 h-6" fill={activeTab === 'profile' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold">Профиль</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
