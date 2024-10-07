import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Pie } from 'react-chartjs-2'; // Importing Pie chart component from Chart.js
import { Chart, registerables } from 'chart.js'; // Importing Chart.js to register elements

Chart.register(...registerables); // Registering all necessary components

const QueryScreenTags = () => {
  const [itemNumber, setItemNumber] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tagDistribution, setTagDistribution] = useState({}); // State to hold tag distribution

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/get-categories');
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error('Fetched categories is not valid:', data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleTagSearch = async () => {
    setLoading(true);
    setError('');
    setTags([]);

    try {
      const response = await fetch(`http://localhost:5001/api/get-item-tags?itemNumber=${itemNumber}&itemCategory=${itemCategory}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setTags(data.tags);
        if (data.tag_distribution) {
          setTagDistribution(data.tag_distribution); // Set tag distribution for pie chart
        }
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
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleExportImages = () => {
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

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(results.map(item => ({
      'ID': item.id !== undefined ? item.id : 'N/A',
      'Grading Reason Summary': item.result,
    })));
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'results.xlsx');
  };

  // Prepare data for pie chart
  const pieChartData = {
    labels: Object.keys(tagDistribution),
    datasets: [{
      data: Object.values(tagDistribution),
      backgroundColor: Object.keys(tagDistribution).map((_, index) => 
        `hsl(${(index * 360 / Object.keys(tagDistribution).length)}, 70%, 50%)` // Dynamic colors
      ),
    }],
  };

  return (
    <div className="min-h-screen bg-[#f2f3ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <select 
            value={itemCategory} 
            onChange={(e) => setItemCategory(e.target.value)} 
            className="p-4 border-2 border-[#434de7] rounded-l-lg w-96 focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:border-transparent"
          >
            <option value="" disabled>Select item category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-center mb-8">
          <input 
            type="text" 
            placeholder="Enter item number" 
            value={itemNumber} 
            onChange={(e) => setItemNumber(e.target.value)} 
            className="p-4 border-2 border-[#434de7] rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:border-transparent"
          />
        </div>
        <div className="flex justify-center mb-8">
          <button 
            onClick={handleTagSearch} 
            className="px-6 py-4 bg-[#434de7] text-white rounded-lg hover:bg-[#3038a0] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#434de7] focus:ring-offset-2"
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
                <div key={index} className={`flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer transition duration-200 ${selectedTags.includes(tag) ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTagChange(tag)}>
                  <input 
                    type="checkbox" 
                    checked={selectedTags.includes(tag)} 
                    readOnly 
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
        {Object.keys(tagDistribution).length > 0 && Object.values(tagDistribution).some(value => value > 0) && ( // Check if there are valid values for the pie chart
          <div className="mt-10">
            <h2 className="text-center text-lg font-bold mb-4">Tag Distribution</h2>
            <div className="flex justify-center">
              <div style={{ width: '300px', height: '300px' }}> {/* Set a fixed size for the pie chart */}
                <Pie data={pieChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: 10,
                        padding: 15,
                      },
                    },
                  },
                }} />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleExportImages} 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-4"
          >
            Export Images
          </button>
          <button 
            onClick={handleExportExcel} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryScreenTags;
