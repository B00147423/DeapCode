import React from 'react';

export default function ConsoleOutput({ output }: { output: string }) {
  return (
    <div className="bg-gray-900 text-gray-300 font-mono text-sm p-4 rounded h-full overflow-auto border border-gray-700">
      <pre className="whitespace-pre-wrap">{output || 'Click "Run Code" to see output here...'}</pre>
    </div>
  );
}