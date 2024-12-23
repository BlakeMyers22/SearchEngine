// src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          AI Search
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your search query..."
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className="max-w-3xl mx-auto mt-8">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl text-blue-600 mb-2">{result.title}</h2>
              <p className="text-gray-600">{result.snippet}</p>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline"
              >
                {result.url}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

// netlify/functions/search.js
const { Configuration, OpenAIApi } = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { query } = JSON.parse(event.body);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // You'll need to adjust this based on which OpenAI capability you're using
    const completion = await openai.createChatCompletion({
      model: "gpt-4",  // or your preferred model
      messages: [
        {
          role: "system",
          content: "You are a helpful search assistant. Please provide relevant information for the query."
        },
        {
          role: "user",
          content: query
        }
      ],
    });

    // Process the response and format it as search results
    const response = completion.data.choices[0].message.content;
    
    // This is a simplified example - you'll want to format the results properly
    const results = [{
      title: "Search Result",
      snippet: response,
      url: "#"
    }];

    return {
      statusCode: 200,
      body: JSON.stringify({ results }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process search' }),
    };
  }
};

// package.json
{
  "name": "ai-search",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4",
    "openai": "^3.2.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}

// netlify.toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
