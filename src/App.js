import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import QueryScreen from './components/QueryScreen';
import OnboardNewItem from './components/OnboardNewItem';
import UpdateItem from './components/UpdateItem';
import QualityCheckOldItem from './components/QualityCheckOldItem';
import Claims from './components/Claims';
import AllData from './components/AllData';

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="ml-64 p-10 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/query" element={<QueryScreen />} />
            <Route path="/onboard" element={<OnboardNewItem />} />
            <Route path="/update" element={<UpdateItem />} />
            <Route path="/quality-check" element={<QualityCheckOldItem />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/all-data" element={<AllData />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
