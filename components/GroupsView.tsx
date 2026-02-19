
import React, { useState } from 'react';
import { Group, UserRole, GlobalDB } from '../types';
import { Users, Plus, ChevronRight, X } from 'lucide-react';

interface GroupsViewProps {
  groups: Group[];
  role?: UserRole;
  onUpdate: () => void;
  teacherNickname?: string;
}

const GroupsView: React.FC<GroupsViewProps> = ({ groups, role, onUpdate, teacherNickname }) => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const canAddGroups = role === UserRole.TEACHER;

  const handleCreateGroup = () => {
    if (!newGroupName || !teacherNickname) return;
    
    try {
      const db: GlobalDB = JSON.parse(localStorage.getItem('ustozy_global_db') || '{"users":[],"groups":[]}');
      const newGroup: Group = {
        id: 'g-' + Math.random().toString(36).substr(2, 9),
        name: newGroupName,
        teacherNickname,
        studentNicknames: [],
        lessons: []
      };
      
      db.groups = db.groups || [];
      db.groups.push(newGroup);
      localStorage.setItem('ustozy_global_db', JSON.stringify(db));
      onUpdate();
      setIsCreatingGroup(false);
      setNewGroupName('');
    } catch (e) {
      console.error(e);
      alert("Failed to create group.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-gray-900">Your Hub</h3>
        {canAddGroups && (
          <button 
            onClick={() => setIsCreatingGroup(true)}
            className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-100"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {groups?.map(group => (
          <div key={group.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 font-black text-xl">
                {group.name?.charAt(0) || '?'}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{group.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{group.studentNicknames?.length || 0} Students</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 w-5 h-5 group-hover:text-blue-500" />
          </div>
        ))}
        {(!groups || groups.length === 0) && (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400 font-medium">No groups found here.</p>
          </div>
        )}
      </div>

      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[2rem] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-black">New Group</h4>
              <button onClick={() => setIsCreatingGroup(false)}><X className="text-gray-400" /></button>
            </div>
            <input 
              type="text" placeholder="Group Name (e.g. Class 10A)"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 outline-none focus:border-blue-500"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
            />
            <button onClick={handleCreateGroup} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100">Create Group</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsView;
