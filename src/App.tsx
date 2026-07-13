import React, { useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import RegistrationForm from './components/RegistrationForm';
import UploadForm from './components/UploadForm';

function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'upload'>('register');

  return (
    <>
      <AnimatedBackground />
      
      <div className="app-container">
        <div className="header">
          <h1>Symbiosis EVS Portal</h1>
          <p>Grade 12 Presentation Topic Registration & Submission</p>
        </div>

        <div className="card-container">
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              1. Register Topic
            </div>
            <div 
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              2. Upload Presentation
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 20 }}>
            {activeTab === 'register' ? <RegistrationForm /> : <UploadForm />}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
