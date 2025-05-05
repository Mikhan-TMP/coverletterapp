"use client";

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState("Write a professional cover letter for a Web Developer position.");
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    console.log('Hugging Face Response:', data);
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main className='p-20'>
      <h1>AI Cover Letter Generator</h1>
      <textarea
        placeholder="Enter job title, company, etc..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        cols={60}
      />
      <br />
      <button onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </button>
      <div style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}>{result}</div>
    </main>
  );
}
