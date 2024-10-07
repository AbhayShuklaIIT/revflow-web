import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 fixed shadow-lg rounded-lg overflow-y-auto">
      <h2 className="text-4xl font-bold mb-8 text-center">App Menu</h2>
      <ul className="space-y-6">
        <div className="border-t border-gray-600 my-4"></div>
        <li className="font-semibold text-lg">Management</li>
        <li>
          <Link to="/onboard" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200 transform hover:scale-105">Onboard New Item</Link>
        </li>
        <li>
          <Link to="/update" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200 transform hover:scale-105">Update Item</Link>
        </li>
        <div className="border-t border-gray-600 my-4"></div>
        <li className="font-semibold text-lg">Queries</li>
        <li>
          <Link to="/query" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Query Screen</Link>
        </li>
        <li>
          <Link to="/query-tags" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Query Tags</Link>
        </li>
        <div className="border-t border-gray-600 my-4"></div>
        <li className="font-semibold text-lg">Quality Control</li>
        <li>
          <Link to="/quality-check" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Quality Check</Link>
        </li>
        <li>
          <Link to="/claims" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Claims</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
