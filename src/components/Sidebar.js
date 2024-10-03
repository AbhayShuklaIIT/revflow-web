import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 fixed shadow-lg rounded-lg">
      <h2 className="text-4xl font-bold mb-8 text-center">App Menu</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Dashboard</Link>
        </li>
        <li>
          <Link to="/query" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Query Screen</Link>
        </li>
        <li>
          <Link to="/onboard" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Onboard New Item</Link>
        </li>
        <li>
          <Link to="/update" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Update Item</Link>
        </li>
        <li>
          <Link to="/quality-check" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Quality Check Old Item</Link>
        </li>
        <li>
          <Link to="/claims" className="block p-3 rounded-lg hover:bg-gray-700 transition duration-200">Claims</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
