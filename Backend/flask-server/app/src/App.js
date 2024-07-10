import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Landing from './Landing';
import Footer from './Footer';
import Dashboard from './Dashboard';
import RegistrationForm from './RegistrationForm';

function App() {
  return (
    <Router>
      <div className="w-full">
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<DashboardComponent />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

// Example of fetching data in Dashboard component
const DashboardComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from Flask backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        setData(response.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Invoke the fetchData function
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
