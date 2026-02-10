
import React, { useState } from 'react';
import { Group, Lesson, Homework } from '../types';
import { Plus, Users, ChevronRight, FileText, Sparkles, Send, Trash2, CheckCircle } from 'lucide-react';
import { generateHomework } from '../services/geminiService';

interface TeacherDashboardProps {
  groups: Group[];
  onGroupSelect: (group: Group) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ groups, onGroupSelect }) => {
  const [localGroups, setLocalGroups] = useState<Group[]>(groups);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newLessonTopic, setNewLessonTopic] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'groups' | 'insights'>('groups');

  const handleAddLesson = async () => {
    if (!selectedGroupId || !newLessonTopic) return;
    
    setIsGenerating(true);
    try {
      const generatedTasks = await generateHomework(newLessonTopic, newLessonDesc);
      
      const newLesson: Lesson = {
        id: Math.random().toString(36).substr(2, 9),
        topic: newLessonTopic,
        description: newLessonDesc,
        files: [],
        createdAt: Date.now(),
        homework: {
          id: 'hw-' + Date.now(),
          title: `Homework: ${newLessonTopic}`,
          tasks: generatedTasks,
          attempts: 0
        }
      };

      setLocalGroups(prev => prev.map(g => 
        g.id === selectedGroupId 
          ? { ...g, lessons: [newLesson, ...g.lessons] } 
          : g
      ));

      setIsCreatingLesson(false);
      setNewLessonTopic('');
      setNewLessonDesc('');
    } catch (error) {
      alert("Failed to generate homework via AI. Using manual creation...");
      // Fallback or error handling
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-blue-600 text-xs font-semibold mb-1">TOTAL STUDENTS</p>
          <h3 className="text-2xl font-bold text-blue-900">48</h3>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
          <p className="text-purple-600 text-xs font-semibold mb-1">COMPLETED TASKS</p>
          <h3 className="text-2xl font-bold text-purple-900">124</h3>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">My Groups</h3>
        <button className="text-blue-600 text-sm font-semibold flex items-center gap-1">
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      <div className="space-y-3">
        {localGroups.map(group => (
          <div key={group.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-900">{group.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{group.studentsCount} students</span>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedGroupId(group.id); setIsCreatingLesson(true); }}
                className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Lessons</p>
              {group.lessons.length > 0 ? (
                group.lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{lesson.topic}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No lessons yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Lesson Modal */}
      {isCreatingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-[100] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold">New Lesson</h4>
              <button onClick={() => setIsCreatingLesson(false)} className="text-gray-400">✕</button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">TOPIC</label>
                <input 
                  value={newLessonTopic}
                  onChange={e => setNewLessonTopic(e.target.value)}
                  placeholder="e.g. Present Continuous" 
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">DESCRIPTION (OPTIONAL)</label>
                <textarea 
                  value={newLessonDesc}
                  onChange={e => setNewLessonDesc(e.target.value)}
                  placeholder="Focus on the 'ing' forms and common mistakes." 
                  rows={3}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors">
                <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500 font-medium">Upload materials (PDF, JPG)</p>
              </div>
            </div>

            <button 
              disabled={isGenerating || !newLessonTopic}
              onClick={handleAddLesson}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all shadow-lg shadow-blue-200/50 ${isGenerating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isGenerating ? (
                <>Generating AI Homework...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Create with AI Homework</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
