import React, { useState, useEffect } from 'react';
import { bikeAPI, dockAPI } from '../services/api';
import { Bike, Dock, CreateBikeRequest } from '../types';

const BikePage: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [docks, setDocks] = useState<Dock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateBikeRequest>({
    dock_id: 0,
    battery_level: 100,
    status: 'available',
    charging_status: 'not_charging',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [bikesData, docksData] = await Promise.all([
        bikeAPI.getAll(),
        dockAPI.getAll(),
      ]);
      setBikes(bikesData);
      setDocks(docksData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bikeAPI.create(formData);
      setFormData({
        dock_id: 0,
        battery_level: 100,
        status: 'available',
        charging_status: 'not_charging',
      });
      setShowForm(false);
      loadData();
    } catch (err) {
      setError('Failed to create bike');
      console.error('Error creating bike:', err);
    }
  };

  const handleStatusUpdate = async (bikeId: number, newStatus: string) => {
    try {
      await bikeAPI.updateStatus(bikeId, { status: newStatus as any });
      loadData();
    } catch (err) {
      setError('Failed to update bike status');
      console.error('Error updating bike status:', err);
    }
  };

  const handleChargingUpdate = async (bikeId: number, newChargingStatus: string) => {
    try {
      await bikeAPI.updateCharging(bikeId, { charging_status: newChargingStatus as any });
      loadData();
    } catch (err) {
      setError('Failed to update charging status');
      console.error('Error updating charging status:', err);
    }
  };

  const handleBatteryUpdate = async (bikeId: number, newBatteryLevel: number) => {
    try {
      await bikeAPI.updateBattery(bikeId, { battery_level: newBatteryLevel });
      loadData();
    } catch (err) {
      setError('Failed to update battery level');
      console.error('Error updating battery level:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      try {
        await bikeAPI.delete(id);
        loadData();
      } catch (err) {
        setError('Failed to delete bike');
        console.error('Error deleting bike:', err);
      }
    }
  };

  const getDockName = (dockId: number) => {
    const dock = docks.find(d => d.id === dockId);
    return dock ? dock.name : `Dock ${dockId}`;
  };

  if (loading) {
    return <div className="loading">Loading bikes...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bikes</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Bike'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Add New Bike</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Dock *
              </label>
              <select
                value={formData.dock_id}
                onChange={(e) => setFormData({ ...formData, dock_id: parseInt(e.target.value) })}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
              >
                <option value={0}>Select a dock</option>
                {docks.map((dock) => (
                  <option key={dock.id} value={dock.id}>
                    {dock.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Battery Level (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.battery_level}
                onChange={(e) => setFormData({ ...formData, battery_level: parseInt(e.target.value) })}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">
                Create Bike
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="btn btn-danger"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {bikes.map((bike) => (
          <div key={bike.id} className="card">
            <div className="card-header">
              <h3 className="card-title">Bike #{bike.id}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className={`status-badge status-${bike.status}`}>
                  {bike.status}
                </span>
                <button 
                  onClick={() => handleDelete(bike.id)} 
                  className="btn btn-danger"
                  style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div>
              <p><strong>Dock:</strong> {getDockName(bike.dock_id)}</p>
              
              <div className="battery-level" style={{ marginBottom: '1rem' }}>
                <span><strong>Battery:</strong> {bike.battery_level}%</span>
                <div className="battery-bar">
                  <div 
                    className={`battery-fill ${
                      bike.battery_level > 60 ? 'battery-high' : 
                      bike.battery_level > 30 ? 'battery-medium' : 'battery-low'
                    }`}
                    style={{ width: `${bike.battery_level}%` }}
                  ></div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Status:</strong>
                <select
                  value={bike.status}
                  onChange={(e) => handleStatusUpdate(bike.id, e.target.value)}
                  style={{ 
                    marginLeft: '0.5rem',
                    padding: '0.25rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px' 
                  }}
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="charging">Charging</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Charging:</strong>
                <select
                  value={bike.charging_status}
                  onChange={(e) => handleChargingUpdate(bike.id, e.target.value)}
                  style={{ 
                    marginLeft: '0.5rem',
                    padding: '0.25rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px' 
                  }}
                >
                  <option value="not_charging">Not Charging</option>
                  <option value="charging">Charging</option>
                  <option value="fully_charged">Fully Charged</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Battery Level:</strong>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bike.battery_level}
                  onChange={(e) => handleBatteryUpdate(bike.id, parseInt(e.target.value))}
                  style={{ 
                    marginLeft: '0.5rem',
                    width: '100px'
                  }}
                />
                <span style={{ marginLeft: '0.5rem' }}>{bike.battery_level}%</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#7f8c8d', margin: 0 }}>
                <strong>Last Updated:</strong> {new Date(bike.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {bikes.length === 0 && !loading && (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d', margin: 0 }}>
            No bikes found. Add your first bike to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default BikePage;