'use client';
import { useState } from 'react';

export default function CreateProblemPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [starterCode, setStarterCode] = useState('');
  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }]);
  const [message, setMessage] = useState('');

  const handleExampleChange = (index: number, field: string, value: string) => {
    const updated = [...examples];
    updated[index][field as keyof typeof updated[number]] = value;
    setExamples(updated);
  };

  const addExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }]);
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const problem = {
      title,
      description,
      difficulty,
      starter_code: starterCode,
      examples: examples.filter(e => e.input && e.output)  // only valid examples
    };

    const res = await fetch('http://localhost:8000/problems/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem)
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`Problem created: /play/${data.slug}`);
    } else {
      setMessage(`Error: ${data.detail || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Problem</h2>

      <input
        className="block w-full mb-2 p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="block w-full mb-2 p-2 border rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        className="block w-full mb-2 p-2 border rounded font-mono"
        placeholder="Starter Code"
        value={starterCode}
        onChange={(e) => setStarterCode(e.target.value)}
        rows={6}
      />
      <select
        className="block w-full mb-4 p-2 border rounded"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <h3 className="text-lg font-semibold mb-2">Examples</h3>
      {examples.map((example, i) => (
        <div key={i} className="mb-4 border p-3 rounded-md">
          <input
            className="w-full mb-1 p-2 border rounded"
            placeholder="Input"
            value={example.input}
            onChange={(e) => handleExampleChange(i, 'input', e.target.value)}
          />
          <input
            className="w-full mb-1 p-2 border rounded"
            placeholder="Output"
            value={example.output}
            onChange={(e) => handleExampleChange(i, 'output', e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Explanation (optional)"
            value={example.explanation}
            onChange={(e) => handleExampleChange(i, 'explanation', e.target.value)}
          />
          {examples.length > 1 && (
            <button
              onClick={() => removeExample(i)}
              className="text-red-600 text-sm mt-1"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addExample}
        className="mb-4 px-3 py-1 border rounded text-sm"
      >
        + Add Example
      </button>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
