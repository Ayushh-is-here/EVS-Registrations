import React, { useState } from 'react';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    division: '',
    rollNumber: '',
    name: '',
    topic: '',
    pin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      alert('Registration successful! Remember your 4-digit PIN for uploading your PPT later.');
      setFormData({ division: '', rollNumber: '', name: '', topic: '', pin: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Register Your Topic
      </h2>
      
      {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Division</label>
          <select 
            name="division" 
            value={formData.division} 
            onChange={handleChange} 
            className="glass-input" 
            required
          >
            <option value="" disabled>Select Division</option>
            <option value="A">Division A</option>
            <option value="B">Division B</option>
            <option value="C">Division C</option>
            <option value="D">Division D</option>
            <option value="E-Commerce">Division E - Commerce</option>
            <option value="E-Arts">Division E - Arts</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Roll Number</label>
          <input 
            type="number" 
            name="rollNumber" 
            value={formData.rollNumber} 
            onChange={handleChange} 
            placeholder="e.g., 101" 
            className="glass-input" 
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="John Doe" 
            className="glass-input" 
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">EVS Presentation Topic</label>
          <input 
            type="text" 
            name="topic" 
            value={formData.topic} 
            onChange={handleChange} 
            placeholder="e.g., Renewable Energy Sources" 
            className="glass-input" 
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label">Create a 4-Digit PIN (for uploading PPT later)</label>
          <input 
            type="password" 
            name="pin" 
            value={formData.pin} 
            onChange={handleChange} 
            placeholder="••••" 
            maxLength={4}
            pattern="\d{4}"
            title="Please enter a 4-digit number"
            className="glass-input" 
            required
          />
        </div>

        <button type="submit" className="glass-button" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register Topic'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
