import React, { useState } from 'react';

const UpdateItem = () => {
  const [itemNumber, setItemNumber] = useState('');
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decisionModel, setDecisionModel] = useState('');
  const [claimApprovalModel, setClaimApprovalModel] = useState('');
  const [specialCases, setSpecialCases] = useState(''); // State for special cases
  const [tags, setTags] = useState([]); // Set default tags
  const [newTag, setNewTag] = useState(''); // State for new tag input
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setItemDetails(null);
    setDecisionModel('');
    setClaimApprovalModel('');
    setSpecialCases(''); // Reset special cases on new search
    setTags([]); // Reset tags on new search

    try {
      const response = await fetch(`http://localhost:5001/api/get-item-details?itemNumber=${itemNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const data = await response.json();
      const { status, data: itemData } = data;
      if (status === 'success') {
        setItemDetails(itemData);
        setDecisionModel(itemData.decisionModel);
        setClaimApprovalModel(itemData.claimApprovalModel);
        setSpecialCases(itemData.special_cases || ''); // Set special cases from response
        setTags(itemData.tags || []); // Set tags from response
      } else {
        throw new Error('Failed to fetch item details');
      }
    } catch (err) {
      setError('Error fetching item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionModelSubmit = async () => {
    setSubmitLoading(true);
    setError('');
    setSubmitMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/update-decision-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemNumber, decisionModel, claimApprovalModel, specialCases, tags }), // Include special cases in the submission
      });

      if (!response.ok) {
        throw new Error('Failed to update decision model');
      }

      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error('Failed to update decision model');
      }

      setSubmitMessage('Decision model updated successfully!');
    } catch (err) {
      setError('Error updating decision model. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col items-center mt-10 p-8 bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Update Item</h1>
      <p className="text-lg text-gray-600 mb-6">Enter the item number to fetch details.</p>
      <div className="flex items-center mb-4">
        <input 
          type="text" 
          placeholder="Enter SKU ID" 
          value={itemNumber} 
          onChange={(e) => setItemNumber(e.target.value)} 
          className="p-3 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-md"
        />
        <button 
          onClick={handleSearch} 
          className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Search
        </button>
      </div>
      {loading && <div className="mt-4 text-gray-500">Loading...</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {itemDetails && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white text-center">
          <h2 className="text-xl font-semibold mb-2">Item Details:</h2>
          <p className="text-gray-700">SKU ID: <span className="font-bold">{itemDetails.itemNumber}</span></p>
          <p className="text-gray-700">Description: {itemDetails.description}</p>
          {itemDetails.image && (
            <img src={`data:image/jpeg;base64,${itemDetails.image}`} alt={itemDetails.image_filename} className="mt-2 w-100 h-64 object-cover rounded-lg shadow-sm mx-auto" />
          )}
          <div className="mt-4">
            <label className="text-gray-700 font-bold">Sorting Decision Model:</label>
            <textarea 
              value={claimApprovalModel} 
              onChange={(e) => setClaimApprovalModel(e.target.value)} 
              className="mt-2 p-4 border border-gray-300 rounded-lg w-full h-96 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-md bg-yellow-50 resize-none transition duration-200 ease-in-out transform hover:scale-105"
              style={{ fontSize: '18px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', color: '#333' }}
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-700 font-bold">Checklist:</label>
            <textarea 
              value={decisionModel} 
              onChange={(e) => setDecisionModel(e.target.value)} 
              className="mt-2 p-4 border border-gray-300 rounded-lg w-full h-96 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-md bg-yellow-50 resize-none transition duration-200 ease-in-out transform hover:scale-105"
              style={{ fontSize: '18px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', color: '#333' }}
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-700 font-bold">Special Cases:</label>
            <textarea 
              value={specialCases} 
              onChange={(e) => setSpecialCases(e.target.value)} 
              className="mt-2 p-4 border border-gray-300 rounded-lg w-full h-96 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-md bg-yellow-50 resize-none transition duration-200 ease-in-out transform hover:scale-105"
              style={{ fontSize: '18px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', color: '#333' }}
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-700 font-bold">Tags:</label>
            <div className="flex flex-col mt-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-300 rounded-lg mb-2">
                  <span className="text-gray-800">{tag}</span>
                  <button 
                    onClick={() => handleRemoveTag(tag)} 
                    className="ml-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-4">
              <input 
                type="text" 
                placeholder="Add new tag" 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                className="p-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-md"
              />
              <button 
                onClick={handleAddTag} 
                className="ml-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Add
              </button>
            </div>
          </div>
          <button 
            onClick={handleDecisionModelSubmit} 
            className="mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
          >
            {submitLoading ? 'Updating...' : 'Update SKU'}
          </button>
          {submitLoading && <div className="mt-2 text-gray-500">Submitting...</div>}
          {submitMessage && <div className="mt-2 text-green-500">{submitMessage}</div>}
        </div>
      )}
    </div>
  );
};

export default UpdateItem;