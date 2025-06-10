import { 
  Code2,
  Home,
  BookOpen,
  Trophy,
  MessageSquare,
  Clock,
  LogOut,
  Users,
  Zap,
  Crown,
  Timer,
  Share
} from 'lucide-react';

interface PlayHeaderProps {
  roomId: string;
  matchTime?: string;
  player1Name?: string;
  player2Name?: string;
  player1Score?: number;
  player2Score?: number;
  gameMode?: '1v1' | 'collaborative';
  onLeave?: () => void;
  onInvite?: () => void;
}

export default function PlayHeader({ 
  roomId, 
  matchTime = "12:34",
  player1Name = "You",
  player2Name = "Opponent", 
  player1Score = 0,
  player2Score = 0,
  gameMode = "1v1",
  onLeave,
  onInvite
}: PlayHeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-xl">CodeQuest</span>
            <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">
              {gameMode === '1v1' ? '1v1' : 'COLLAB'}
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Home className="w-4 h-4" />
              Home
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Trophy className="w-4 h-4" />
              Matches
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Users className="w-4 h-4" />
              Find Opponent
            </button>
          </nav>
        </div>
        
        {/* Center: Match Info */}
        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg">
            <Timer className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono text-lg font-bold">{matchTime}</span>
          </div>
          
          {/* Players Score */}
          <div className="flex items-center gap-4 bg-gray-900 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-400 font-medium">{player1Name}</span>
              <span className="text-white font-bold">{player1Score}</span>
            </div>
            <div className="text-gray-500">vs</div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{player2Score}</span>
              <span className="text-red-400 font-medium">{player2Name}</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
          
          {/* Room ID */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Room: <span className="text-orange-400 font-medium">{roomId}</span></span>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm">
            <Zap className="w-4 h-4" />
            Quick Match
          </button>
          <button 
            onClick={onInvite}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
          >
            <Share className="w-4 h-4" />
            Invite
          </button>
          <button 
            onClick={onLeave}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Leave
          </button>
        </div>
      </div>
    </header>
  );
} 