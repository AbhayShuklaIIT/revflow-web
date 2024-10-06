import React, { useState, useEffect } from 'react';

const OnboardNewItem = () => {
  const [itemNumber, setItemNumber] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/get-categories');
        const data = await response.json();
        // Ensure data contains categories before setting it to categories
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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('itemNumber', itemNumber);
    formData.append('category', selectedCategory);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch('http://localhost:5001/api/onboard-item', {
        method: 'POST',
        body: formData,
      });

      const success = response.ok;

      if (success) {
        setMessage('Item successfully onboarded!');
      } else {
        setMessage('Error onboarding item. Please try again.');
      }
    } catch (error) {
      setMessage('Error onboarding item. Please try again.');
    } finally {
      setLoading(false);
      setItemNumber('');
      setSelectedCategory('');
      setImages([]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 p-6 bg-gradient-to-r from-blue-100 to-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Onboard New Item</h1>
      <p className="text-md text-gray-600 mb-6">Please provide the item number, select a category, and upload images for the new item.</p>
      <div className="relative w-80 mt-2">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 hover:shadow-md"
        >
          <option value="" disabled>Select Category</option>
          {Array.isArray(categories) && categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.5 8l4.5 4.5L15.5 8z"/></svg>
        </div>
      </div>
      <input 
        type="text" 
        placeholder="Enter SKU ID" 
        value={itemNumber} 
        onChange={(e) => setItemNumber(e.target.value)} 
        onKeyPress={handleKeyPress}
        className="mt-2 p-3 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 hover:shadow-md"
      />
      
      <input 
        type="file" 
        multiple 
        onChange={handleImageUpload} 
        className="mt-4 p-2 border border-gray-300 rounded-lg w-80 cursor-pointer hover:bg-gray-100 transition duration-200"
      />
      <div className="mt-4 flex flex-wrap justify-center">
        {images.map((image, index) => (
          <img key={index} src={URL.createObjectURL(image)} alt="" className="w-24 h-24 object-cover m-2 border rounded-lg shadow-md transition-transform transform hover:scale-105" />
        ))}
      </div>
      <button 
        onClick={handleSubmit} 
        className="mt-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {loading && <div className="mt-4 text-gray-500">Please wait...</div>}
      {message && <div className="mt-4 text-gray-700">{message}</div>}
    </div>
  );
};

export default OnboardNewItem;
