"use client";
import { useEffect } from 'react';

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="p-4 text-red-500">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
    </div>
  );
}