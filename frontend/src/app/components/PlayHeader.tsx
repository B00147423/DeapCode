import { 
  Code2,
  Home,
  BookOpen,
  Trophy,
  MessageSquare,
  Clock,
  LogOut
} from 'lucide-react';

interface PlayHeaderProps {
  roomId: string;
  onLeave?: () => void;
}

export default function PlayHeader({ roomId, onLeave }: PlayHeaderProps) {
  return (
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
        <button 
          onClick={onLeave}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Leave
        </button>
      </div>
    </header>
  );
} 