import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const UploadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    division: '',
    rollNumber: '',
    pin: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a presentation file.");
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const data = new FormData();
      data.append('division', formData.division);
      data.append('rollNumber', formData.rollNumber);
      data.append('pin', formData.pin);
      data.append('presentation', file);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload presentation');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <CheckCircle size={64} color="#a855f7" style={{ margin: '0 auto', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Upload Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your presentation has been submitted successfully to Google Drive.
        </p>
        <button className="glass-button secondary" onClick={() => {
          setIsSuccess(false);
          setFile(null);
          setFormData({ division: '', rollNumber: '', pin: '' });
        }}>
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Upload Presentation
      </h2>
      
      {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Division</label>
            <select 
              name="division" 
              value={formData.division} 
              onChange={handleChange} 
              className="glass-input" 
              required
            >
              <option value="" disabled>Select</option>
              <option value="A">Div A</option>
              <option value="B">Div B</option>
              <option value="C">Div C</option>
              <option value="D">Div D</option>
              <option value="E-Commerce">Div E (Com)</option>
              <option value="E-Arts">Div E (Art)</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
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
        </div>

        <div className="form-group">
          <label className="form-label">4-Digit PIN</label>
          <input 
            type="password" 
            name="pin" 
            value={formData.pin} 
            onChange={handleChange} 
            placeholder="••••" 
            maxLength={4}
            pattern="\d{4}"
            className="glass-input" 
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label">Presentation File (.ppt, .pptx, .pdf)</label>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary-glow)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".ppt,.pptx,.pdf"
            />
            
            {file ? (
              <>
                <FileText size={40} color="#a855f7" />
                <div>
                  <p style={{ fontWeight: '500', color: 'white' }}>{file.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload size={40} color="var(--text-secondary)" />
                <div>
                  <p style={{ color: 'white', fontWeight: '500' }}>Click to upload or drag and drop</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>PPT, PPTX, or PDF (MAX. 50MB)</p>
                </div>
              </>
            )}
          </div>
        </div>

        <button type="submit" className="glass-button" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Submit Presentation'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
