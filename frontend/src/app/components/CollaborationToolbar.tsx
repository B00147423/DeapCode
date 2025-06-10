import { 
  Users, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Crown, 
  Zap,
  Share,
  Lock,
  Unlock
} from 'lucide-react';

interface CollaborationToolbarProps {
  opponentCodeVisible: boolean;
  onToggleOpponentCode: () => void;
  gameMode: '1v1' | 'collaborative';
  canShare?: boolean;
  onShareCode?: () => void;
  isCodeLocked?: boolean;
  onToggleCodeLock?: () => void;
}

export default function CollaborationToolbar({
  opponentCodeVisible,
  onToggleOpponentCode,
  gameMode,
  canShare = false,
  onShareCode,
  isCodeLocked = false,
  onToggleCodeLock
}: CollaborationToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-1 text-xs">
          <Users className="w-3 h-3 text-blue-400" />
          <span className="text-gray-400">
            {gameMode === '1v1' ? 'Competitive' : 'Collaborative'}
          </span>
        </div>
        
        {gameMode === '1v1' && (
          <div className="flex items-center gap-1 text-xs text-orange-400">
            <Crown className="w-3 h-3" />
            <span>1v1 Match</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {gameMode === 'collaborative' && canShare && (
          <>
            <button
              onClick={onToggleCodeLock}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title={isCodeLocked ? "Unlock code editing" : "Lock code editing"}
            >
              {isCodeLocked ? (
                <Lock className="w-3 h-3 text-red-400" />
              ) : (
                <Unlock className="w-3 h-3 text-green-400" />
              )}
            </button>
            
            <button
              onClick={onShareCode}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Share code with partner"
            >
              <Share className="w-3 h-3 text-blue-400" />
            </button>
          </>
        )}
        
        <button
          onClick={onToggleOpponentCode}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          title={opponentCodeVisible ? "Hide opponent code" : "Show opponent code"}
        >
          {opponentCodeVisible ? (
            <EyeOff className="w-3 h-3 text-gray-400" />
          ) : (
            <Eye className="w-3 h-3 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
} 