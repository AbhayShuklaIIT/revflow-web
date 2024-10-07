import React, { useState, useCallback } from 'react';

const Claims = () => {
  const [itemNumber, setItemNumber] = useState('');
  const [claimDetails, setClaimDetails] = useState('');
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    setItemDetails(null);

    try {
      const response = await fetch(`http://localhost:5001/api/get-item-details?itemNumber=${itemNumber}`);
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
  }, [itemNumber]);

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setImages(prevImages => [...prevImages, ...files]);
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitLoading(true);
    setError('');
    setResponseData(null);

    const formData = new FormData();
    formData.append('itemNumber', itemNumber);
    formData.append('claimDetails', claimDetails);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch('http://localhost:5001/api/sortv2', {
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
  }, [itemNumber, claimDetails, images]);

  const handleKeyPress = useCallback((event, action) => {
    if (event.key === 'Enter') {
      action();
    }
  }, []);

  const clearImages = () => {
    setImages([]);
    // Reset the file input to allow new uploads
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Claims</h1>
      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          <input 
            type="text" 
            placeholder="Enter SKU ID" 
            value={itemNumber} 
            onChange={(e) => setItemNumber(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleSearch)}
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {itemDetails && (
          <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Item Details:</h2>
            <p className="text-gray-700 mb-2 text-center">Description: {itemDetails.description}</p>
            {itemDetails.image && (
              <div className="w-full h-96 overflow-hidden">
                <img src={`data:image/jpeg;base64,${itemDetails.image}`} alt={itemDetails.image_filename} className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        )}
        <input 
          type="text" 
          placeholder="Enter claim details"
          value={claimDetails} 
          onChange={(e) => setClaimDetails(e.target.value)}
          // onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-4">
          {images.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Uploaded Images:</h2>
              <div className="flex flex-wrap justify-center -mx-2">
                {images.map((image, index) => (
                  <div key={index} className="w-full h-96 overflow-hidden m-2">
                    <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} className="w-full h-full object-contain border rounded-lg shadow-sm" />
                  </div>
                ))}
              </div>
              <button 
                onClick={clearImages} 
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 focus:outline-none"
              >
                Clear Images
              </button>
            </div>
          )}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-100 hover:bg-gray-200 transition duration-200 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.querySelector('input[type="file"]').click()} // Added click functionality
          >
            <p className="text-gray-600">Drag and drop images here or click to upload</p>
            <input 
              type="file" 
              multiple 
              onChange={handleImageUpload} 
              className="hidden"
            />
          </div>
          <button 
            onClick={handleSubmit} 
            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {submitLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        {responseData && (
          <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Response Summary:</h2>
            <div>
              <h3 className="font-bold text-gray-700">Claim Validation Reasoning:</h3>
              <p className="text-gray-600">{responseData.claim_validation_reasoning}</p>
              <h3 className="font-bold text-gray-700">Repair Reasoning:</h3>
              <p className="text-gray-600">{responseData.repair_reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Claims;