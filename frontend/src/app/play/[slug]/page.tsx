'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  LogOut,
  Minimize2,
  Maximize2,
  Eye,
  EyeOff,
  Crown,
  Target,
  Zap,
  Share,
  Copy,
  Check,
  X
} from 'lucide-react';
import Editor from '../../components/editor/Editor';
import RunButton from '../../components/editor/RunButton';
import ConsoleOutput from '../../components/editor/ConsoleOutput';
import PlayHeader from '../../components/PlayHeader';

type Problem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  tags?: string[];
  estimatedTimeMinutes?: number;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
};

type ChatMessage = {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system';
};
  
export default function PlayRoomPage() {
  const params = useParams();
  const problemSlug = params.slug as string;
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const username = session?.user?.name || session?.user?.email?.split('@')[0] || 'You';
  
  // Debug authentication
  console.log("PlayRoomPage loaded:", {
    session,
    status,
    userId,
    username,
    problemSlug
  });
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log("User not authenticated, redirecting to login...");
      window.location.href = `/auth?mode=login&redirect=/play/${problemSlug}`;
    }
  }, [status, problemSlug]);
  
  // Layout states
  const [problemVisible, setProblemVisible] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);
  const [opponentCodeVisible, setOpponentCodeVisible] = useState(true);
  
  // Code and execution states
  const [myCode, setMyCode] = useState(`class Solution {
public:
    // Write your solution here
    
};`);
  const [opponentCode, setOpponentCode] = useState(`class Solution {
public:
    // Opponent's code will appear here
    
};`);
  const [myOutput, setMyOutput] = useState('');
  const [opponentOutput, setOpponentOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  // Problem and match states
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchTime, setMatchTime] = useState('15:00');
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState('Waiting for opponent...');
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', message: 'Match started! Good luck!', timestamp: new Date(), type: 'system' },
    { id: '2', user: 'Opponent', message: 'Good luck!', timestamp: new Date(), type: 'message' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Invite states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState<string[]>([username]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Generate unique room ID for this match
  const generateRoomId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${problemSlug}-${timestamp}-${random}`;
  };

  // Generate short room code (6 characters)
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Force re-generation of room ID and code when component mounts or problemSlug changes
  const [roomId, setRoomId] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');

  // Initialize room ID and code properly on mount and when problemSlug changes
  useEffect(() => {
    if (!problemSlug) return;

    console.log("🏠 Initializing room for problem:", problemSlug);

    // FORCE CLEANUP any existing WebSocket connections first
    if (ws.current) {
      console.log("🧹 FORCE CLEANUP: Closing existing WebSocket before creating new room");
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 1, // LEAVE
          userId,
          username,
          roomId,
          content: ""
        }));
      }
      ws.current.close();
      ws.current = null;
    }

    // Try to get room ID from URL params first (for invited users)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRoomId = urlParams.get('room');
      const urlRoomCode = urlParams.get('code');
      
      if (urlRoomId) {
        console.log("📥 Joining existing room from URL:", urlRoomId);
        setRoomId(urlRoomId);
        // Try to extract code from room ID if it's code-based
        if (urlRoomId.includes('-code-')) {
          setRoomCode(urlRoomId.split('-code-')[1]);
        } else {
          setRoomCode(generateRoomCode());
        }
        return;
      } else if (urlRoomCode) {
        console.log("📥 Joining room by code from URL:", urlRoomCode);
        // Convert room code to room ID format
        setRoomId(`${problemSlug}-code-${urlRoomCode}`);
        setRoomCode(urlRoomCode);
        return;
      }
    }
    
    // Generate new room ID and code for host (THIS WILL ALWAYS CREATE NEW ROOM)
    const newRoomId = generateRoomId();
    const newRoomCode = generateRoomCode();
    
    console.log("🆕 Creating BRAND NEW room:", {
      problemSlug,
      newRoomId,
      newRoomCode,
      timestamp: Date.now(),
      userId,
      username
    });
    
    setRoomId(newRoomId);
    setRoomCode(newRoomCode);
  }, [problemSlug]); // Re-run when problemSlug changes

  // Reset opponent state when roomId changes (new room)
  useEffect(() => {
    if (roomId) {
      console.log("🔄 Room ID changed, resetting opponent state:", roomId);
      setOpponentName('Waiting for opponent...');
      setParticipants([username]);
      setOpponentCode(`class Solution {
public:
    // Opponent's code will appear here
    
};`);
      setOpponentOutput('');
    }
  }, [roomId, username]);

  // Fetch problem data when component mounts
  useEffect(() => {
    if (problemSlug) {
      setLoading(true);
      fetch(`http://localhost:8000/problems/${problemSlug}`)
        .then(res => res.json())
        .then(data => {
          console.log("Problem data:", data);
          setProblem(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching problem:", err);
          setLoading(false);
        });
    }
  }, [problemSlug]);
  const ws = useRef<WebSocket | null>(null); // define this at top of the component

useEffect(() => {
  if (!problemSlug || !userId || status === 'loading' || !roomId) return;

  console.log("🔌 Establishing WebSocket connection for room:", roomId);
  console.log("👤 Current user details:", { userId, username });

  // Clean up any existing connection first
  if (ws.current) {
    console.log("🧹 Cleaning up existing WebSocket connection");
    ws.current.close();
    ws.current = null;
  }

  const socket = new WebSocket("ws://localhost:9001");
  ws.current = socket;

  socket.onopen = () => {
    console.log("✅ WebSocket connected. Sending JOIN message:", {
      type: 0,
      userId,
      username,
      roomId,
      content: ""
    });
    
    socket.send(JSON.stringify({
      type: 0, // JOIN
      userId,
      username,
      roomId,
      content: ""
    }));
  };

  socket.onmessage = (event) => {
    try {
      console.log("📨 Raw WebSocket message received:", event.data);
      console.log("👤 My userId:", userId, "My username:", username);
      
      // Try to parse as JSON first
      let msg;
      try {
        msg = JSON.parse(event.data);
        console.log("📋 Parsed JSON message:", msg);
      } catch (parseError) {
        // If it's not JSON, treat it as a simple string broadcast
        console.log("💬 String message from server:", event.data);
        
        // Handle simple string messages from C++ server
        if (event.data.includes("joined the room")) {
          const extractedUsername = event.data.split(" joined the room")[0];
          console.log("🔍 Extracted username from join message:", extractedUsername);
          console.log("🤔 Is this me?", extractedUsername === userId || extractedUsername === username);
          
          if (extractedUsername !== userId && extractedUsername !== username) {
            console.log("✅ Setting opponent name to:", extractedUsername);
            setOpponentName(extractedUsername);
            setParticipants(prev => {
              console.log("📝 Previous participants:", prev);
              const newParticipants = [...prev.filter(p => p !== extractedUsername), extractedUsername];
              console.log("📝 New participants:", newParticipants);
              return newParticipants;
            });
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              user: 'System',
              message: `${extractedUsername} joined the match!`,
              timestamp: new Date(),
              type: 'system'
            }]);
          } else {
            console.log("⚠️ IGNORING own join message - this should not create opponent");
          }
        } else if (event.data.includes("left the room")) {
          const extractedUsername = event.data.split(" left the room")[0];
          console.log("🔍 Extracted username from leave message:", extractedUsername);
          if (extractedUsername !== userId && extractedUsername !== username) {
            console.log("👋 Removing opponent:", extractedUsername);
            setParticipants(prev => prev.filter(p => p !== extractedUsername));
            setOpponentName('Waiting for opponent...');
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              user: 'System',
              message: `${extractedUsername} left the match.`,
              timestamp: new Date(),
              type: 'system'
            }]);
          } else {
            console.log("⚠️ IGNORING own leave message");
          }
        } else if (event.data.includes(": ")) {
          // Handle chat/code messages: "username: content"
          const [sender, content] = event.data.split(": ", 2);
          console.log("💬 Chat message from:", sender, "Content:", content);
          if (sender !== userId && sender !== username) {
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              user: sender,
              message: content,
              timestamp: new Date(),
              type: 'message'
            }]);
          }
        }
        return;
      }

      // Handle structured JSON messages (if your server sends them)
      console.log("🏗️ Processing structured JSON message:", msg);
      switch (msg.type) {
        case 0: // USER_JOINED
          console.log("👋 USER_JOINED message:", msg);
          if (msg.userId !== userId && msg.username !== username) {
            console.log("✅ New opponent joined:", msg.username || msg.userId);
            setOpponentName(msg.username || msg.userId || 'Opponent');
            setParticipants(prev => [...prev.filter(p => p !== (msg.username || msg.userId)), msg.username || msg.userId || 'Opponent']);
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              user: 'System',
              message: `${msg.username || msg.userId || 'Opponent'} joined the match!`,
              timestamp: new Date(),
              type: 'system'
            }]);
          } else {
            console.log("⚠️ IGNORING own USER_JOINED message");
          }
          break;
        case 1: // USER_LEFT
          console.log("👋 USER_LEFT message:", msg);
          if (msg.userId !== userId && msg.username !== username) {
            console.log("👋 Opponent left:", msg.username || msg.userId);
            setParticipants(prev => prev.filter(p => p !== (msg.username || msg.userId)));
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              user: 'System',
              message: `${msg.username || msg.userId || 'Opponent'} left the match.`,
              timestamp: new Date(),
              type: 'system'
            }]);
            setOpponentName('Waiting for opponent...');
          } else {
            console.log("⚠️ IGNORING own USER_LEFT message");
          }
          break;
        case 2: // CHAT_MESSAGE
          console.log("💬 CHAT_MESSAGE:", msg);
          if (msg.userId !== userId && msg.username !== username) {
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              user: msg.username || msg.userId || 'Opponent',
              message: msg.content,
              timestamp: new Date(),
              type: 'message'
            }]);
          } else {
            console.log("⚠️ IGNORING own CHAT_MESSAGE");
          }
          break;
        case 3: // CODE_UPDATE or CHAT from server
          console.log("🔧 CODE_UPDATE/CHAT message:", msg);
          
          // Handle system messages (like join/leave notifications)
          if (msg.userId === "System" && msg.content) {
            console.log("🔔 System message:", msg.content);
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              user: 'System',
              message: msg.content,
              timestamp: new Date(),
              type: 'system'
            }]);
          } else if (msg.userId !== userId && msg.username !== username) {
            // Handle opponent code updates
            if (msg.content.includes('class Solution')) {
              console.log("💻 Opponent code update received");
              setOpponentCode(msg.content);
            } else {
              // Handle chat messages
              setChatMessages(prev => [...prev, {
                id: Date.now().toString(),
                user: msg.username || msg.userId || 'Opponent',
                message: msg.content,
                timestamp: new Date(),
                type: 'message'
              }]);
            }
          } else {
            console.log("⚠️ IGNORING own CODE_UPDATE/CHAT message");
          }
          break;
        default:
          console.log("❓ Unknown message type:", msg.type);
      }
    } catch (error) {
      console.error("❌ Error parsing WebSocket message:", error);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return () => {
    if (socket.readyState === WebSocket.OPEN && userId) {
      socket.send(JSON.stringify({
        type: 1, // LEAVE
        userId,
        username,
        roomId,
        content: ""
      }));
    }
    socket.close();
  };
}, [roomId, userId, status]);


  const handleRunCode = () => {
    setIsRunning(true);
    setMyOutput('Running code...\n');
    
    setTimeout(() => {
      const firstExample = problem?.examples?.[0];
      setMyOutput(`Input: ${firstExample?.input || 'No input available'}
          Output: ${firstExample?.output || 'No output available'}
          Expected: ${firstExample?.output || 'No expected output available'}

            Test case 1 passed
            Test case 2 passed
            Test case 3 passed

            Runtime: 4 ms, faster than 85.23% of C++ online submissions.
            Memory Usage: 11.2 MB, less than 55.12% of C++ online submissions.`);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    setMyOutput('Submitting solution...\n');
    setTimeout(() => {
      setMyOutput(`✅ Accepted

Runtime: 4 ms, faster than 85.23% of C++ online submissions.
Memory Usage: 11.2 MB, less than 55.12% of C++ online submissions.

Your solution has been accepted!`);
      setMyScore(prev => prev + 100);
    }, 1500);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: username,
        message: newMessage,
        timestamp: new Date(),
        type: 'message'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Send message through WebSocket
      if (ws.current && userId) {
        ws.current.send(JSON.stringify({
          type: 2, // CHAT_MESSAGE
          userId,
          username,
          roomId,
          content: newMessage
        }));
      }
    }
  };

  // Handle code updates with debouncing
  const sendCodeUpdate = (code: string) => {
    if (ws.current && userId) {
      ws.current.send(JSON.stringify({
        type: 3, // CODE_UPDATE
        userId,
        username,
        roomId,
        content: code
      }));
    }
  };

  // Debounce code updates to avoid spamming the WebSocket
  useEffect(() => {
    const timer = setTimeout(() => {
      sendCodeUpdate(myCode);
    }, 1000); // Send code update after 1 second of no changes

    return () => clearTimeout(timer);
  }, [myCode, userId, roomId, username]);

  // Handle page visibility changes and cleanup
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (ws.current && userId && roomId) {
        console.log("🌐 Page unloading, sending LEAVE message");
        ws.current.send(JSON.stringify({
          type: 1, // LEAVE
          userId,
          username,
          roomId,
          content: ""
        }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && ws.current && userId && roomId) {
        console.log("👁️ Page hidden, sending LEAVE message");
        ws.current.send(JSON.stringify({
          type: 1, // LEAVE
          userId,
          username,
          roomId,
          content: ""
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, username, roomId]);

  // Invite functionality
  const getInviteLink = () => {
    return `${window.location.origin}/play/${problemSlug}?room=${roomId}`;
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleInvite = () => {
    setShowInviteModal(true);
  };

  const handleLeave = () => {
    setShowLeaveModal(true);
  };

  const confirmLeave = () => {
    console.log("🚪 User confirming leave for room:", roomId);
    
    // Send leave message via WebSocket
    if (ws.current && userId) {
      console.log("📤 Sending LEAVE message via WebSocket");
      ws.current.send(JSON.stringify({
        type: 1, // LEAVE
        userId,
        username,
        roomId,
        content: ""
      }));
      
      // Close WebSocket connection
      setTimeout(() => {
        if (ws.current) {
          ws.current.close();
          ws.current = null;
        }
      }, 100);
    }
    
    // Force a complete page reload to clear all React state
    console.log("🔄 Force reloading to clear all state");
    window.location.href = '/dashboard';
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-lg text-red-400 mb-4">You need to be logged in to join this match</div>
          <button 
            onClick={() => window.location.href = `/auth?mode=login&redirect=/play/${problemSlug}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Login to Join Match
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-lg">Loading match...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-lg text-red-400">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <PlayHeader 
        roomId={roomId} 
        onLeave={handleLeave}
        onInvite={handleInvite}
        matchTime={matchTime}
        player1Name={username}
        player2Name={opponentName}
        player1Score={myScore}
        player2Score={opponentScore}
        gameMode="1v1"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - My Code */}
        <div className="flex-1 flex flex-col border-r border-gray-700">
          <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-400">Your Code</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Code2 className="w-4 h-4" />
              <span>C++</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 min-h-0">
              <Editor code={myCode} setCode={setMyCode} />
            </div>
            
            <div className="h-32 bg-gray-800 border-t border-gray-700">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
                <span className="text-sm text-gray-400">Console</span>
                <div className="flex items-center gap-2">
                  <RunButton onClick={handleRunCode} loading={isRunning} />
                  <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Submit
                  </button>
                </div>
              </div>
              <div className="h-full p-3 overflow-y-auto">
                <ConsoleOutput output={myOutput} />
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Problem & Chat */}
        <div className="w-80 flex flex-col border-r border-gray-700 bg-gray-800">
          {/* Problem Section */}
          <div className={`${problemVisible ? 'flex-1' : 'h-12'} flex flex-col border-b border-gray-700 transition-all duration-300`}>
            <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-sm">Problem</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <button
                onClick={() => setProblemVisible(!problemVisible)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {problemVisible ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            
            {problemVisible && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">{problem.title}</h3>
                  <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </div>
                </div>
                
                {problem.examples && problem.examples.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-300 mb-2">Examples</h4>
                    <div className="space-y-2">
                      {problem.examples.map((example, i) => (
                        <div key={i} className="bg-gray-900 rounded p-2 border border-gray-700 text-xs">
                          <div className="text-gray-300 mb-1">Example {i + 1}:</div>
                          <div className="text-gray-400 mb-1">Input: {example.input}</div>
                          <div className="text-gray-400 mb-1">Output: {example.output}</div>
                          {example.explanation && (
                            <div className="text-gray-500 text-xs">Explanation: {example.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className={`${chatVisible ? 'flex-1' : 'h-12'} flex flex-col transition-all duration-300`}>
            <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400" />
                <span className="font-medium text-sm">Chat</span>
              </div>
              <button
                onClick={() => setChatVisible(!chatVisible)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {chatVisible ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            
            {chatVisible && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`text-xs ${msg.type === 'system' ? 'text-gray-500 italic' : ''}`}>
                      <span className={`font-medium ${
                        msg.user === username ? 'text-blue-400' : 
                        msg.user === 'System' ? 'text-gray-500' : 'text-red-400'
                      }`}>
                        {msg.user === username ? 'You' : msg.user}:
                      </span>
                      <span className="ml-1 text-gray-300">{msg.message}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:border-gray-600"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Opponent's Code */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-400">Opponent's Code</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpponentCodeVisible(!opponentCodeVisible)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title={opponentCodeVisible ? "Hide opponent code" : "Show opponent code"}
              >
                {opponentCodeVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Code2 className="w-4 h-4" />
                <span>C++</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 min-h-0 relative">
              {opponentCodeVisible ? (
                <>
                  <Editor code={opponentCode} setCode={() => {}} />
                  <div className="absolute inset-0 bg-transparent pointer-events-none border-2 border-red-500/20 rounded"></div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-900 text-gray-500">
                  <div className="text-center">
                    <EyeOff className="w-8 h-8 mx-auto mb-2" />
                    <p>Opponent's code is hidden</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-32 bg-gray-800 border-t border-gray-700">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
                <span className="text-sm text-gray-400">Opponent Console</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Crown className="w-3 h-3" />
                  <span>Score: {opponentScore}</span>
                </div>
              </div>
              <div className="h-full p-3 overflow-y-auto">
                <ConsoleOutput output={opponentOutput} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Invite Players</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Current Participants */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Current Players ({participants.length}/2)
                </h4>
                <div className="space-y-1">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        participant === username ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-gray-300">
                        {participant === username ? `${participant} (You)` : participant}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite Link */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Room Code</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomCode}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-lg font-mono text-center text-gray-300 focus:outline-none tracking-widest"
                  />
                  <button
                    onClick={copyRoomCode}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Share this code with others so they can join your match
                </p>
              </div>

              {/* Room Info */}
              <div className="bg-gray-900 rounded p-3 border border-gray-700">
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Room ID: <span className="text-orange-400">{roomId}</span></div>
                  <div>Problem: <span className="text-gray-300">{problem?.title || 'Loading...'}</span></div>
                  <div>Mode: <span className="text-purple-400">1v1 Competitive</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Leave Match?</h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-300">
                <p className="mb-2">Are you sure you want to leave this match?</p>
                <div className="bg-yellow-900 border border-yellow-700 rounded p-3">
                  <p className="text-yellow-300 text-xs">
                    ⚠️ <strong>Warning:</strong> You won't be able to return to this specific match. 
                    If you want to continue solving this problem, you'll need to start a new match.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  Stay in Match
                </button>
                <button
                  onClick={confirmLeave}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Leave Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}