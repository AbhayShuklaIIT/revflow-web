import React from 'react';
import { Link } from 'react-router-dom';
import revflowLogo from '../revflow.png'; // Import the logo

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-100 to-gray-300 text-gray-700 p-6 fixed shadow-lg rounded-lg overflow-y-auto">
      <img src={revflowLogo} alt="Revflow Logo" className="w-full h-auto mb-4" /> {/* Added logo */}
      {/* <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">App Menu</h2> */}
      <ul className="space-y-6">
        <div className="border-t border-gray-500 my-4"></div>
        <li className="font-semibold text-lg text-gray-800">Item Management</li>
        <li>
          <Link to="/onboard" className="block p-3 rounded-lg hover:bg-gray-400 transition duration-200">Onboard New Item</Link>
        </li>
        <li>
          <Link to="/update" className="block p-3 rounded-lg hover:bg-gray-400 transition duration-200">Update Item</Link>
        </li>
        <div className="border-t border-gray-500 my-4"></div>
        <li className="font-semibold text-lg text-gray-800">Queries</li>
        <li>
          <Link to="/query" className="block p-3 rounded-lg hover:bg-gray-400 transition duration-200">Query Screen</Link>
        </li>
        <li>
          <Link to="/query-tags" className="block p-3 rounded-lg hover:bg-gray-400 transition duration-200">Query Tags</Link>
        </li>
        <div className="border-t border-gray-500 my-4"></div>
        <li className="font-semibold text-lg text-gray-800">Quality Control</li>
        <li>
          <Link to="/quality-check" className="block p-3 rounded-lg hover:bg-gray-400 transition duration-200">Quality Check</Link>
        </li>
        <li>
          <Link to="/claims" className="block p-3 rounded-lg hover:bg-gray-400 transition duration-200">Claims</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
