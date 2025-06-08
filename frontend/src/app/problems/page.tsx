'use client';
import { useState, useEffect } from 'react';

export type Problem = {
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
export default function ProblemsPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    useEffect(() => {
        fetch("http://localhost:8000/problems")
          .then(res => res.json())
          .then(data => {
            console.log("API response:", data); // ← Check if this is an array
            if (Array.isArray(data)) {
              setProblems(data);
            } else {
              console.error("Expected array but got:", data);
            }
          })
          .catch(err => console.error("Fetch error:", err));
      }, []);
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Problems</h1>
        {problems.map((problem, idx) => (
        <div key={idx} className="mb-6 border p-4 rounded-md">
            <h2 className="text-xl font-semibold">{problem.title}</h2>
            
            <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
            <span>{problem.difficulty}</span>
            {problem.estimatedTimeMinutes && (
                <span>⏱️ {problem.estimatedTimeMinutes} min</span>
            )}
            </div>

            <p className="mt-2">{problem.description}</p>

            {problem.examples.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
                <strong>Example:</strong>
                <pre className="bg-muted p-2 rounded mt-1 whitespace-pre-wrap">
        {`Input: ${problem.examples[0].input}
        Output: ${problem.examples[0].output}
        Explanation: ${problem.examples[0].explanation || "N/A"}`}
                </pre>
            </div>
            )}
        </div>
        ))}
      </div>
    );
  }