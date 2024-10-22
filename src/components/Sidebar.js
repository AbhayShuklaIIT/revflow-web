import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import revflowLogo from '../revflow.png'; // Import the logo

const Sidebar = () => {
  const [itemManagementOpen, setItemManagementOpen] = useState(false);
  const [queriesOpen, setQueriesOpen] = useState(false);
  const [qualityControlOpen, setQualityControlOpen] = useState(false);

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-100 to-gray-300 text-gray-700 p-6 fixed shadow-lg rounded-lg overflow-y-auto">
      <img src={revflowLogo} alt="Revflow Logo" className="w-full h-auto mb-4" /> {/* Added logo */}
      <ul className="space-y-2"> {/* Reduced space between elements */}
        
        <li className="font-semibold text-base text-gray-800 cursor-pointer flex justify-between items-center" onClick={() => setItemManagementOpen(!itemManagementOpen)}>
          Item Management
          <span className={`transform transition-transform duration-300 ${itemManagementOpen ? 'rotate-180' : 'rotate-0'}`}>&#9654;</span> {/* Futuristic arrow button */}
        </li>
        {itemManagementOpen && (
          <ul className="pl-4 space-y-1">
            <li>
              <Link to="/onboard" className="block p-1 rounded-lg hover:bg-gray-400 transition duration-200 text-base">Onboard New Item</Link> {/* Reduced padding */}
            </li>
            <li>
              <Link to="/update" className="block p-1 rounded-lg hover:bg-gray-400 transition duration-200 text-base">Update Item</Link> {/* Reduced padding */}
            </li>
          </ul>
        )}

        <li className="font-semibold text-base text-gray-800 cursor-pointer flex justify-between items-center" onClick={() => setQueriesOpen(!queriesOpen)}>
          Queries
          <span className={`transform transition-transform duration-300 ${queriesOpen ? 'rotate-180' : 'rotate-0'}`}>&#9654;</span> {/* Futuristic arrow button */}
        </li>
        {queriesOpen && (
          <ul className="pl-4 space-y-1">
            <li>
              <Link to="/query" className="block p-1 rounded-lg hover:bg-gray-400 transition duration-200 text-base">Query Screen</Link> {/* Reduced padding */}
            </li>
            <li>
              <Link to="/query-tags" className="block p-1 rounded-lg hover:bg-gray-400 transition duration-200 text-base">Query Tags</Link> {/* Reduced padding */}
            </li>
          </ul>
        )}

        <li className="font-semibold text-base text-gray-800 cursor-pointer flex justify-between items-center" onClick={() => setQualityControlOpen(!qualityControlOpen)}>
          Quality Control
          <span className={`transform transition-transform duration-300 ${qualityControlOpen ? 'rotate-180' : 'rotate-0'}`}>&#9654;</span> {/* Futuristic arrow button */}
        </li>
        {qualityControlOpen && (
          <ul className="pl-4 space-y-1">
            <li>
              <Link to="/quality-check" className="block p-1 rounded-lg hover:bg-gray-400 transition duration-200 text-base">Quality Check</Link> {/* Reduced padding */}
            </li>
            <li>
              <Link to="/claims" className="block p-1 rounded-lg hover:bg-gray-400 transition duration-200 text-base">Claims</Link> {/* Reduced padding */}
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
