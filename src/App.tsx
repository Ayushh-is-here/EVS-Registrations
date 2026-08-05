import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import RegistrationForm from './components/RegistrationForm';
import UploadForm from './components/UploadForm';
import Navbar from './components/Navbar';
import Guidelines from './components/Guidelines';
import ViewTopics from './components/ViewTopics';
import Assignments from './components/Assignments';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full flex flex-col items-center px-3 sm:px-6 overflow-x-hidden">
        <AnimatedBackground />
        
        {/* Global Navigation */}
        <Navbar />
        
        {/* Main Content Area adapted for mobile and desktop */}
        <main className="w-full relative z-10 flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-24 md:pb-12 flex-grow">
          <Routes>
            {/* Default to register */}
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/topics" element={<ViewTopics />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/admin" element={<AdminPanel />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
