import React, { useState, useEffect } from 'react';
import { healthAPI, dockAPI, bikeAPI, userAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocks: 0,
    totalBikes: 0,
    availableBikes: 0,
    chargingBikes: 0,
    rentedBikes: 0,
  });
  const [healthStatus, setHealthStatus] = useState<string>('Checking...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load health status
      try {
        const health = await healthAPI.check();
        setHealthStatus(health.status);
      } catch (err) {
        setHealthStatus('Offline');
      }

      // Load all data
      const [users, docks, bikes] = await Promise.all([
        userAPI.getAll(),
        dockAPI.getAll(),
        bikeAPI.getAll(),
      ]);

      // Calculate statistics
      const availableBikes = bikes.filter(bike => bike.status === 'available').length;
      const chargingBikes = bikes.filter(bike => bike.status === 'charging').length;
      const rentedBikes = bikes.filter(bike => bike.status === 'rented').length;

      setStats({
        totalUsers: users.length,
        totalDocks: docks.length,
        totalBikes: bikes.length,
        availableBikes,
        chargingBikes,
        rentedBikes,
      });

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Refresh
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">System Status</h3>
            <span className={`status-badge ${healthStatus === 'OK' ? 'status-active' : 'status-offline'}`}>
              {healthStatus}
            </span>
          </div>
          <p>API connection and MQTT broker status</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Users</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
              {stats.totalUsers}
            </span>
          </div>
          <p>Registered users in the system</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Docks</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
              {stats.totalDocks}
            </span>
          </div>
          <p>Active docking stations</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Bikes</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
              {stats.totalBikes}
            </span>
          </div>
          <p>Bikes in the fleet</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Available Bikes</h3>
            <span className="status-badge status-available">
              {stats.availableBikes}
            </span>
          </div>
          <p>Ready for rental</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Charging Bikes</h3>
            <span className="status-badge status-charging">
              {stats.chargingBikes}
            </span>
          </div>
          <p>Currently charging</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Rented Bikes</h3>
            <span className="status-badge status-rented">
              {stats.rentedBikes}
            </span>
          </div>
          <p>Currently in use</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;