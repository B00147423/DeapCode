import React from 'react';
import { Play, Loader2 } from 'lucide-react';

export default function RunButton({ onClick, loading }: { onClick: () => void, loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors font-medium"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      {loading ? "Running..." : "Run Code"}
    </button>
  );
}