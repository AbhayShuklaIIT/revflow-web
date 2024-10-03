import React, { useState } from 'react';

const QueryScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('http://127.0.0.1:5001//api/get-similar-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.similar_items);
      } else {
        throw new Error('API returned unsuccessful status');
      }
    } catch (err) {
      setError('Error fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-10 p-6">
      <h1 className="text-4xl font-bold mb-6">Query Screen</h1>
      <div className="flex justify-center mb-6">
        <input 
          type="text" 
          placeholder="Enter your query" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="p-3 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSearch} 
          className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Search
        </button>
      </div>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item, index) => {
            const result = JSON.parse(item.result);
            return (
              <div key={index} className="border rounded-lg p-4 shadow-md bg-white transition-transform transform hover:scale-105">
                <img src={`data:image/jpeg;base64,${item.image}`} alt="Item" className="w-full h-48 object-cover mb-2 rounded" />
                <p className="text-left text-sm mb-2">{result.grading_reason_summary}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueryScreen;
