import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import UserPage from './pages/UserPage';
import DockPage from './pages/DockPage';
import BikePage from './pages/BikePage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">BikeshareApp</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/users" className="nav-link">Users</Link>
              <Link to="/docks" className="nav-link">Docks</Link>
              <Link to="/bikes" className="nav-link">Bikes</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/docks" element={<DockPage />} />
            <Route path="/bikes" element={<BikePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
