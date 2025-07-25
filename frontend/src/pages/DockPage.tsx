import React, { useState, useEffect } from 'react';
import { dockAPI } from '../services/api';
import { Dock, DockWithBikes, CreateDockRequest } from '../types';

const DockPage: React.FC = () => {
  const [docks, setDocks] = useState<Dock[]>([]);
  const [selectedDock, setSelectedDock] = useState<DockWithBikes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateDockRequest>({
    name: '',
    location_lat: 0,
    location_lng: 0,
    capacity: 10,
    status: 'active',
  });

  useEffect(() => {
    loadDocks();
  }, []);

  const loadDocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dockAPI.getAll();
      setDocks(data);
    } catch (err) {
      setError('Failed to load docks');
      console.error('Error loading docks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDockDetails = async (dockId: number) => {
    try {
      const dockWithBikes = await dockAPI.getWithBikes(dockId);
      setSelectedDock(dockWithBikes);
    } catch (err) {
      setError('Failed to load dock details');
      console.error('Error loading dock details:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dockAPI.create(formData);
      setFormData({
        name: '',
        location_lat: 0,
        location_lng: 0,
        capacity: 10,
        status: 'active',
      });
      setShowForm(false);
      loadDocks();
    } catch (err) {
      setError('Failed to create dock');
      console.error('Error creating dock:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dock?')) {
      try {
        await dockAPI.delete(id);
        if (selectedDock && selectedDock.id === id) {
          setSelectedDock(null);
        }
        loadDocks();
      } catch (err) {
        setError('Failed to delete dock');
        console.error('Error deleting dock:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading docks...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Docks</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Dock'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Add New Dock</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location_lat}
                  onChange={(e) => setFormData({ ...formData, location_lat: parseFloat(e.target.value) })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px' 
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location_lng}
                  onChange={(e) => setFormData({ ...formData, location_lng: parseFloat(e.target.value) })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px' 
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Capacity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
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
                Create Dock
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

      <div style={{ display: 'grid', gridTemplateColumns: selectedDock ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        <div>
          <h3>All Docks</h3>
          <div className="grid">
            {docks.map((dock) => (
              <div key={dock.id} className="card">
                <div className="card-header">
                  <h4 className="card-title">{dock.name}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => loadDockDetails(dock.id)} 
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDelete(dock.id)} 
                      className="btn btn-danger"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div>
                  <p><strong>Location:</strong> {dock.location_lat.toFixed(6)}, {dock.location_lng.toFixed(6)}</p>
                  <p><strong>Capacity:</strong> {dock.capacity} bikes</p>
                  <span className={`status-badge status-${dock.status}`}>
                    {dock.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedDock && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Dock Details: {selectedDock.name}</h3>
              <button 
                onClick={() => setSelectedDock(null)} 
                className="btn btn-danger"
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
              >
                Close
              </button>
            </div>
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Statistics</h4>
              </div>
              <div>
                <p><strong>Available Bikes:</strong> {selectedDock.availableBikes} / {selectedDock.totalBikes}</p>
                <p><strong>Capacity:</strong> {selectedDock.capacity}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge status-${selectedDock.status}`} style={{ marginLeft: '0.5rem' }}>
                    {selectedDock.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Bikes at this Dock</h4>
              </div>
              {selectedDock.bikes.length > 0 ? (
                <div className="grid">
                  {selectedDock.bikes.map((bike) => (
                    <div key={bike.id} style={{ 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      padding: '1rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Bike #{bike.id}</strong>
                        <span className={`status-badge status-${bike.status}`}>
                          {bike.status}
                        </span>
                      </div>
                      <div className="battery-level" style={{ marginTop: '0.5rem' }}>
                        <span>Battery: {bike.battery_level}%</span>
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
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                        Charging: <span className={`status-badge status-${bike.charging_status === 'charging' ? 'charging' : 'available'}`}>
                          {bike.charging_status.replace('_', ' ')}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#7f8c8d' }}>No bikes at this dock</p>
              )}
            </div>
          </div>
        )}
      </div>

      {docks.length === 0 && !loading && (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d', margin: 0 }}>
            No docks found. Add your first dock to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default DockPage;