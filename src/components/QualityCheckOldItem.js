import React, { useState } from 'react';

const Dashboard = () => {
  const [itemNumber, setItemNumber] = useState('');
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [responseData, setResponseData] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setItemDetails(null);

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/get-item-details?itemNumber=${itemNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const data = await response.json();
      const { status, data: itemData } = data;
      if (status === 'success') {
        setItemDetails(itemData);
      } else {
        throw new Error('Failed to fetch item details');
      }
    } catch (err) {
      setError('Error fetching item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const convertedImages = await Promise.all(files.map(async (file) => {
      const imageBlob = await convertToPng(file);
      return imageBlob;
    }));
    setImages(prevImages => [...prevImages, ...convertedImages]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleImageUpload({ target: { files } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const convertToPng = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.png', { type: 'image/png' }));
          }, 'image/png');
        };
        img.onerror = (err) => reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setError('');
    setResponseData(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('itemNumber', itemNumber);
    images.forEach((image) => {
      formData.append('images', image);
    });

    // Simulate a loading bar for 30 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / 30); // Increment progress
      });
    }, 1000);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/sortv2', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit images');
      }

      setResponseData(result);
    } catch (err) {
      setError('Error submitting images. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 p-8 bg-gradient-to-r from-gray-50 to-white shadow-lg rounded-lg">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Quality Check Dashboard</h1>
      <p className="text-lg text-gray-600 mb-6">Upload images for quality assessment.</p>
      <div className="flex items-center mb-4">
        <input 
          type="text" 
          placeholder="Enter item number" 
          value={itemNumber} 
          onChange={(e) => setItemNumber(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Enable enter key for search
          className="p-3 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-md"
        />
        <button 
          onClick={handleSearch} 
          className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Search
        </button>
      </div>
      {loading && <div className="mt-4 text-gray-500 animate-pulse">Loading...</div>}
      {error && <div className="mt-4 text-red-500 font-semibold">{error}</div>}
      {itemDetails && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white text-center">
          <h2 className="text-2xl font-semibold mb-2">Item Details:</h2>
          <p className="text-gray-700">Description: {itemDetails.description}</p>
          {itemDetails.image && (
            <img src={`data:image/jpeg;base64,${itemDetails.image}`} alt={itemDetails.image_filename} className="mt-2 w-full h-auto object-contain rounded-lg shadow-sm mx-auto" />
          )}
        </div>
      )}
      <div 
        className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg w-80 bg-gray-100 hover:bg-gray-200 transition duration-200 cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.querySelector('input[type="file"]').click()} // Added click functionality
      >
        <p className="text-center text-gray-600">Drag and drop images here or click to upload</p>
        <input 
          type="file" 
          multiple 
          onChange={handleImageUpload} 
          className="hidden"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Uploaded Images:</h2>
        <div className="flex flex-wrap justify-center">
          {images.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} className="w-28 h-28 object-cover m-2 border rounded-lg shadow transition-transform transform hover:scale-105" />
          ))}
        </div>
      </div>
      <div className="mt-2">
        <button 
          onClick={handleSubmit} 
          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
        >
          {submitLoading ? 'Submitting...' : 'Check Quality'}
        </button>
        {submitLoading && (
          <div className="mt-2">
            <div className="h-2 bg-gray-300 rounded-full">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${progress}%`, transition: 'width 1s' }}></div>
            </div>
            <div className="mt-1 text-gray-500">{Math.round(progress)}%</div>
          </div>
        )}
      </div>
      {responseData && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold">Response Summary:</h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {responseData.grading_reason.map((reason, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg shadow bg-gradient-to-r from-blue-100 to-blue-200 hover:shadow-lg transition duration-200">
                <h4 className="font-semibold text-md">{Object.keys(reason)[0]}</h4>
                <p className="text-gray-700">{Object.values(reason)[0]}</p>
              </div>
            ))}
          </div>
          <h3 className="font-bold mt-2">Grading Summary:</h3>
          <p className="text-gray-700">{responseData.grading_reason_summary}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;