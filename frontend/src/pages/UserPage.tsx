import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { User, CreateUserRequest } from '../types';

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    name: '',
    phone: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.create(formData);
      setFormData({ email: '', name: '', phone: '' });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        loadUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Add New User</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
              />
            </div>
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                Create User
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
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{user.name}</h3>
              <button 
                onClick={() => handleDelete(user.id)} 
                className="btn btn-danger"
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
              >
                Delete
              </button>
            </div>
            <div>
              <p><strong>Email:</strong> {user.email}</p>
              {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
              <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d', margin: 0 }}>
            No users found. Add your first user to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPage;