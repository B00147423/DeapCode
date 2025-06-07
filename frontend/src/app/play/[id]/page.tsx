'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Code2,    
  Play, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  Home,
  BookOpen,
  MessageSquare,
  Trophy,
  Settings,
  LogOut
} from 'lucide-react';
import Editor from '../../components/editor/Editor';
import RunButton from '../../components/editor/RunButton';
import ConsoleOutput from '../../components/editor/ConsoleOutput';

export default function PlayRoomPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [code, setCode] = useState(`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`);
  const [output, setOutput] = useState('');
  const [editorHeight, setEditorHeight] = useState(400);
  const [isRunning, setIsRunning] = useState(false);
  const dragging = useRef(false);
  const minEditorHeight = 200;
  const maxEditorHeight = 600;

  const roomId = 'test-session';
  const participants = ['You', 'Opponent'];
  
  const problem = {
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ]
  };

  const onMouseDown = () => {
    dragging.current = true;
    document.body.style.cursor = 'row-resize';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    const container = document.getElementById('editor-console-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const clampedHeight = Math.max(minEditorHeight, Math.min(y, maxEditorHeight));
    setEditorHeight(clampedHeight);
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = '';
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    setTimeout(() => {
      setOutput(`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Expected: [0,1]

✅ Test case 1 passed
✅ Test case 2 passed
✅ Test case 3 passed

Runtime: 4 ms, faster than 85.23% of C++ online submissions.
Memory Usage: 11.2 MB, less than 55.12% of C++ online submissions.`);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    setOutput('Submitting solution...\n');
    setTimeout(() => {
      setOutput(`✅ Accepted

Runtime: 4 ms, faster than 85.23% of C++ online submissions.
Memory Usage: 11.2 MB, less than 55.12% of C++ online submissions.

Your solution has been accepted!`);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-xl">CodeQuest</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Home className="w-4 h-4" />
              Home
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <BookOpen className="w-4 h-4" />
              Problems
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Trophy className="w-4 h-4" />
              Contest
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Discuss
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            <span>12:34</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Room: <span className="text-orange-400 font-medium">{roomId}</span></span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Leave
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem Sidebar */}
        <aside className={`transition-all duration-300 bg-gray-800 border-r border-gray-700 flex flex-col ${
          sidebarOpen ? 'w-96 min-w-[384px]' : 'w-0 min-w-0'
        } overflow-hidden`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-lg">{problem.title}</h2>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              onClick={() => setSidebarOpen(false)}
              title="Hide problem"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="font-medium text-gray-300 mb-2">Description</h3>
              <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                {problem.description}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-300 mb-3">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((example, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                    <div className="text-sm">
                      <div className="text-gray-300 font-medium mb-1">Example {i + 1}:</div>
                      <div className="text-gray-400 mb-1">
                        <span className="text-gray-300">Input:</span> {example.input}
                      </div>
                      <div className="text-gray-400 mb-1">
                        <span className="text-gray-300">Output:</span> {example.output}
                      </div>
                      <div className="text-gray-400 text-xs">
                        <span className="text-gray-300">Explanation:</span> {example.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <h3 className="font-medium text-sm text-gray-300">Participants</h3>
            </div>
            <div className="space-y-1">
              {participants.map((participant, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {participant}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative">
          {!sidebarOpen && (
            <button
              className="absolute top-4 left-4 z-20 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              onClick={() => setSidebarOpen(true)}
              title="Show problem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex-1 flex flex-col p-4" id="editor-console-container">
            {/* Editor */}
            <div className="bg-gray-800 rounded-t-lg border border-gray-700 overflow-hidden" 
                 style={{ height: `${editorHeight}px`, minHeight: '200px' }}>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Code2 className="w-4 h-4" />
                  <span>C++</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="h-full">
                <Editor code={code} setCode={setCode} />
              </div>
            </div>

            {/* Resize Handle */}
            <div
              className="h-2 bg-gray-700 cursor-row-resize hover:bg-gray-600 transition-colors flex items-center justify-center"
              onMouseDown={onMouseDown}
            >
              <div className="w-8 h-1 bg-gray-500 rounded"></div>
            </div>

            {/* Console */}
            <div className="bg-gray-800 rounded-b-lg border border-gray-700 border-t-0 flex-1 min-h-[200px] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Console</span>
                </div>
              </div>
              <div className="h-full p-4">
                <ConsoleOutput output={output} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <RunButton onClick={handleRunCode} loading={isRunning} />
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}