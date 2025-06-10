'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Users, 
  ArrowRight, 
  Copy, 
  Check 
} from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    if (roomCode.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      // Simulate API call delay - in production you'd validate the room code
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, assume room exists and redirect
      // You would replace this with actual room lookup logic
      const problemSlug = 'two-sum'; // This would come from your room lookup API
      
      // Close modal and navigate
      onClose();
      router.push(`/play/${problemSlug}?code=${roomCode.toUpperCase()}`);
    } catch (err) {
      setError('Room not found. Please check the code and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleClose = () => {
    setRoomCode('');
    setError('');
    setIsJoining(false);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Join a Match</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                setRoomCode(value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="ABC123"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              maxLength={6}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the 6-character code shared by the host
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleJoinRoom}
              disabled={isJoining || roomCode.length !== 6}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors text-white font-medium"
            >
              {isJoining ? (
                'Joining...'
              ) : (
                <>
                  Join
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Ask your friend for their room code to join their coding match
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 