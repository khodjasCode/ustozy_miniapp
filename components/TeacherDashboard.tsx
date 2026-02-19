
import React, { useState } from 'react';
import { Group, Lesson, GlobalDB } from '../types';
import { Plus, Users, ChevronRight, FileText, Sparkles, UserPlus, X, AtSign } from 'lucide-react';
import { generateHomework } from '../services/geminiService';

interface TeacherDashboardProps {
  groups: Group[];
  onGroupSelect: () => void;
  userNickname: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ groups, onGroupSelect, userNickname }) => {
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newLessonTopic, setNewLessonTopic] = useState('');
  const [newStudentNick, setNewStudentNick] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getDB = (): GlobalDB => {
    try {
      return JSON.parse(localStorage.getItem('ustozy_global_db') || '{"users":[],"groups":[]}');
    } catch (e) {
      return { users: [], groups: [] };
    }
  };
  const saveDB = (db: GlobalDB) => localStorage.setItem('ustozy_global_db', JSON.stringify(db));

  const handleAddLesson = async () => {
    if (!selectedGroupId || !newLessonTopic) return;
    setIsGenerating(true);
    try {
      const generatedTasks = await generateHomework(newLessonTopic, '');
      const db = getDB();
      const newLesson: Lesson = {
        id: Math.random().toString(36).substr(2, 9),
        topic: newLessonTopic,
        description: '',
        files: [],
        createdAt: Date.now(),
        homework: { id: 'hw-' + Date.now(), title: newLessonTopic, tasks: generatedTasks, attempts: 0 }
      };
      
      const gIndex = db.groups.findIndex(g => g.id === selectedGroupId);
      if (gIndex !== -1) {
        db.groups[gIndex].lessons = db.groups[gIndex].lessons || [];
        db.groups[gIndex].lessons.unshift(newLesson);
        saveDB(db);
        onGroupSelect();
      }
      setIsCreatingLesson(false);
      setNewLessonTopic('');
    } catch (e) { 
      console.error(e);
      alert("Generation failed."); 
    }
    finally { setIsGenerating(false); }
  };

  const handleAddStudent = () => {
    const db = getDB();
    const cleanNick = newStudentNick.replace('@', '').toLowerCase().trim();
    const student = db.users.find(u => u.nickname === cleanNick);
    
    if (!student) {
      alert("Student not found! Make sure they have onboarded.");
      return;
    }

    const gIndex = db.groups.findIndex(g => g.id === selectedGroupId);
    if (gIndex !== -1) {
      db.groups[gIndex].studentNicknames = db.groups[gIndex].studentNicknames || [];
      if (db.groups[gIndex].studentNicknames.includes(cleanNick)) {
        alert("Student already in group.");
        return;
      }
      db.groups[gIndex].studentNicknames.push(cleanNick);
      saveDB(db);
      onGroupSelect();
      setIsAddingStudent(false);
      setNewStudentNick('');
    }
  };

  return (
    <div className="p-5 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Total Groups</p>
          <h3 className="text-2xl font-black text-blue-900">{groups?.length || 0}</h3>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
          <p className="text-purple-600 text-[10px] font-bold uppercase tracking-widest">Students Reached</p>
          <h3 className="text-2xl font-black text-purple-900">
            {new Set(groups?.flatMap(g => g.studentNicknames || []) || []).size}
          </h3>
        </div>
      </div>

      <h3 className="text-lg font-black text-gray-900">Manage Classes</h3>

      <div className="space-y-4">
        {groups?.map(group => (
          <div key={group.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{group.name}</h4>
                <p className="text-xs text-gray-400 font-medium">{group.studentNicknames?.length || 0} students enrolled</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedGroupId(group.id); setIsAddingStudent(true); }}
                  className="bg-gray-100 p-2 rounded-xl text-gray-600"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setSelectedGroupId(group.id); setIsCreatingLesson(true); }}
                  className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {group.lessons?.map(lesson => (
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-gray-700">{lesson.topic}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))}
              {(group.lessons?.length || 0) === 0 && <p className="text-center text-xs text-gray-300 py-2">No lessons yet.</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {isAddingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[2rem] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-black">Add Student</h4>
              <button onClick={() => setIsAddingStudent(false)}><X className="text-gray-400" /></button>
            </div>
            <div className="relative">
              <AtSign className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input 
                type="text" placeholder="student_nickname"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500"
                value={newStudentNick}
                onChange={e => setNewStudentNick(e.target.value)}
              />
            </div>
            <button onClick={handleAddStudent} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl">Add to Group</button>
          </div>
        </div>
      )}

      {/* Create Lesson Modal */}
      {isCreatingLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[2rem] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-black">Generate Lesson</h4>
              <button onClick={() => setIsCreatingLesson(false)}><X className="text-gray-400" /></button>
            </div>
            <input 
              type="text" placeholder="e.g. Present Continuous"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 outline-none focus:border-blue-500"
              value={newLessonTopic}
              onChange={e => setNewLessonTopic(e.target.value)}
            />
            <button 
              disabled={isGenerating}
              onClick={handleAddLesson} 
              className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 ${isGenerating ? 'bg-gray-400' : 'bg-blue-600 shadow-xl shadow-blue-100'}`}
            >
              <Sparkles className="w-5 h-5" /> {isGenerating ? 'Generating HW...' : 'Create with AI HW'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
