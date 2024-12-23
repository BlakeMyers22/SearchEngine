import React, { useState } from 'react';
import './App.css';

const PrismLogo = () => (
  <svg viewBox="0 0 100 100" width="50" height="50" className="mb-4">
    <polygon
      points="50,10 90,90 10,90"
      fill="none"
      stroke="url(#gradient)"
      strokeWidth="2"
      className="shine"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#4ECDC4" />
        <stop offset="100%" stopColor="#45B7D1" />
      </linearGradient>
    </defs>
  </svg>
);

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center mb-12">
          <PrismLogo />
          <h1 className="text-5xl font-bold rainbow-text mb-4">
            Prism
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Illuminate Your Search
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
          <div className="prism-gradient p-1 rounded-full">
            <div className="flex gap-2 bg-black rounded-full p-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-6 py-3 bg-transparent border-none focus:outline-none text-white placeholder-gray-500"
                placeholder="What would you like to know?"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Searching
                  </span>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="results-grid">
          {results.map((result, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-3 rainbow-text">
                {result.title}
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {result.snippet}
              </p>
              {result.url !== "#" && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
