
import React from 'react';
import { Group } from '../types';
import { Users, Search, ChevronRight, Plus } from 'lucide-react';

interface GroupsViewProps {
  groups: Group[];
}

const GroupsView: React.FC<GroupsViewProps> = ({ groups }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-gray-900">Your Groups</h3>
        <button className="bg-blue-600 text-white p-2 rounded-xl">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search groups..." 
          className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 shadow-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <span className="text-xl font-black">{group.name.charAt(0)}</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">{group.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + group.id}`} alt="avatar" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">+{group.studentsCount} members</span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-gray-300 w-5 h-5" />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-1">Discover more</h4>
        <p className="text-sm text-blue-700/70 mb-4">Browse public groups in your community and join them.</p>
        <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-sm border border-blue-100">
          Explore Directory
        </button>
      </div>
    </div>
  );
};

export default GroupsView;
