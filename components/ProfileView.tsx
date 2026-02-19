
import React from 'react';
import { UserState } from '../types';
import { LogOut, Phone, User, Shield, BadgeCheck, AtSign, Globe } from 'lucide-react';

interface ProfileViewProps {
  user: UserState;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <BadgeCheck className="w-6 h-6 text-blue-500" />
        </div>
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-[2rem] bg-gray-50 border-4 border-white shadow-xl overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white animate-pulse"></div>
        </div>
        
        <h3 className="text-2xl font-black text-gray-900">{user.name}</h3>
        <p className="text-sm font-bold text-blue-500 flex items-center justify-center gap-1 mt-1">
          <AtSign className="w-3.5 h-3.5" />{user.nickname}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Personal Identity</h4>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Full Name</p>
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Mobile</p>
              <p className="text-sm font-bold text-gray-800">{user.phone}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Account Type</p>
              <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all active:scale-[0.98]"
      >
        <LogOut className="w-5 h-5" /> Log Out Securely
      </button>
    </div>
  );
};

export default ProfileView;
