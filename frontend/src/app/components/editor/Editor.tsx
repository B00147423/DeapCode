import React from 'react';
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }: { code: string, setCode: (code: string) => void }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="cpp"
      value={code}
      onChange={(value) => setCode(value || "")}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
      }}
    />
  );
}