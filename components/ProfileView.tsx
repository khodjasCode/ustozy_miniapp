
import React from 'react';
import { UserState } from '../types';
import { LogOut, Phone, User, Shield, BadgeCheck, Mail } from 'lucide-react';

interface ProfileViewProps {
  user: UserState;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-[2rem] bg-gray-100 border-4 border-white shadow-lg overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
        </div>
        
        <h3 className="text-2xl font-black text-gray-900">{user.name || 'Anonymous User'}</h3>
        <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mt-1">{user.role}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Personal Info</h4>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 flex items-center gap-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
              <p className="text-sm font-bold text-gray-800">{user.phone || 'Not set'}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Username</p>
              <p className="text-sm font-bold text-gray-800">@{user.username}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Account Status</p>
              <div className="flex items-center gap-1 text-green-600">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-sm font-bold">Verified Educator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  );
};

export default ProfileView;
