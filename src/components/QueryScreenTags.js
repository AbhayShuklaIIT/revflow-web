import React, { useState } from 'react';

const QueryScreenTags = () => {
  const [itemNumber, setItemNumber] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  const handleTagSearch = async () => {
    setLoading(true);
    setError('');
    setTags([]);

    try {
      const response = await fetch(`http://localhost:5001/api/get-item-tags?itemNumber=${itemNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setTags(data.tags); // Assuming the API returns an array of tags
      } else {
        throw new Error('API returned unsuccessful status');
      }
    } catch (err) {
      setError('Error fetching tags. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByTags = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('http://localhost:5001/api/get-similar-item-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: selectedTags }),
      });

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

  const handleTagChange = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag); // Deselect the tag
      } else {
        return [...prev, tag]; // Select the tag
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f3ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <input 
            type="text" 
            placeholder="Enter item number" 
            value={itemNumber} 
            onChange={(e) => setItemNumber(e.target.value)} 
            className="p-4 border-2 border-[#434de7] rounded-l-lg w-96 focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:border-transparent"
          />
          <button 
            onClick={handleTagSearch} 
            className="px-6 py-4 bg-[#434de7] text-white rounded-r-lg hover:bg-[#3038a0] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:ring-offset-2"
          >
            Get Tags
          </button>
        </div>
        {loading && <div className="text-black text-center text-lg">Loading...</div>}
        {error && <div className="text-red-600 mb-6 text-center text-lg">{error}</div>}
        {tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Select Tags:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200">
                  <input 
                    type="checkbox" 
                    checked={selectedTags.includes(tag)} 
                    onChange={() => handleTagChange(tag)} 
                    className="mr-2"
                  />
                  <label className="text-gray-800">{tag}</label>
                </div>
              ))}
            </div>
            <button 
              onClick={handleSearchByTags} 
              className="mt-4 px-6 py-3 bg-[#434de7] text-white rounded-lg hover:bg-[#3038a0] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:ring-offset-2"
            >
              Search by Selected Tags
            </button>
          </div>
        )}
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
      </div>
    </div>
  );
};

export default QueryScreenTags;
