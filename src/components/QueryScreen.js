import React, { useState } from 'react';
import * as XLSX from 'xlsx';

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
      const response = await fetch('http://localhost:5001/api/get-similar-item-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.status === 404) {
        setError('No item found with this description.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.similar_items.map((item, index) => ({
          image: item.image,
          result: item.result,
          id: index
        })));
      } else {
        throw new Error('API returned unsuccessful status');
      }
    } catch (err) {
      setError('Error fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToXLSX = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(results.map(item => ({
      'ID': item.id !== undefined ? item.id : 'N/A',
      'Grading Reason Summary': item.result,
    })));
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'results.xlsx');

    results.forEach((item) => {
      const imageData = atob(item.image);
      const arrayBuffer = new ArrayBuffer(imageData.length);
      const uintArray = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < imageData.length; i++) {
        uintArray[i] = imageData.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `image_${item.id !== undefined ? item.id : 'unknown'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f3ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-5xl font-extrabold text-black mb-8 text-center">Query Screen</h1> */}
        <div className="flex justify-center mb-8">
          <input 
            type="text" 
            placeholder="Enter your query" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="p-4 border-2 border-[#434de7] rounded-l-lg w-96 focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:border-transparent"
          />
          <button 
            onClick={handleSearch} 
            className="px-6 py-4 bg-[#434de7] text-white rounded-r-lg hover:bg-[#3038a0] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:ring-offset-2"
          >
            Search
          </button>
        </div>
        {loading && <div className="text-black text-center text-lg">Loading...</div>}
        {error && <div className="text-red-600 mb-6 text-center text-lg">{error}</div>}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                <img src={`data:image/jpeg;base64,${item.image}`} alt="Item" className="w-full h-56 object-cover" />
                <div className="p-6">
                  <p className="text-black text-sm mb-2">ID: {item.id}</p>
                  <p className="text-black text-base">{item.result}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {results.length > 0 && (
          <div className="mt-10 text-center">
            <button 
              onClick={exportToXLSX} 
              className="px-6 py-3 bg-[#434de7] text-white rounded-lg hover:bg-[#3038a0] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:ring-offset-2"
            >
              Export to XLSX and PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryScreen;
