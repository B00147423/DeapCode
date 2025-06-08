'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    
    useEffect(() => {
        fetch("http://localhost:8000/problems")
          .then(res => res.json())
          .then(data => {
            console.log("API response:", data);
            if (Array.isArray(data)) {
              setProblems(data);
            } else {
              console.error("Expected array but got:", data);
            }
          })
          .catch(err => console.error("Fetch error:", err));
      }, []);

    const handleProblemClick = (problemId: string) => {
        router.push(`/play/${problemId}`);
    };
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Problems</h1>
        {problems.map((problem, idx) => (
        <div 
            key={idx} 
            className="mb-6 border p-4 rounded-md cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-200" 
            onClick={() => handleProblemClick(problem.id)}
        >
            <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">{problem.title}</h2>
            
            <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
                problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>{problem.difficulty}</span>
            {problem.estimatedTimeMinutes && (
                <span>⏱️ {problem.estimatedTimeMinutes} min</span>
            )}
            </div>

            <p className="mt-2 line-clamp-3">{problem.description}</p>

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
            
            <div className="mt-3 text-sm text-blue-600 font-medium">
                Click to start solving →
            </div>
        </div>
        ))}
      </div>
    );
  }