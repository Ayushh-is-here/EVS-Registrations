import { useState } from 'react';
import { motion } from 'framer-motion';
import KineticHeading from './KineticHeading';

interface Registration {
  id: number;
  created_at: string;
  division: string;
  roll_number: number;
  name: string;
  topic: string;
  has_uploaded: boolean;
  file_id: string | null;
  file_link: string | null;
  member2_roll_number: number | null;
  member2_name: string | null;
}

const AdminPanel = () => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Authenticate PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      if (response.ok) {
        setIsAuthenticated(true);
        fetchRegistrations(pin);
      } else {
        setError('Incorrect PIN. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (currentPin: string) => {
    try {
      const response = await fetch('/api/admin/registrations', {
        headers: { 'x-admin-pin': currentPin }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Failed to fetch registrations');
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin }
      });
      if (response.ok) {
        setRegistrations(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting registration.');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Date', 'Division', 'Roll Number 1', 'Name 1', 'Roll Number 2', 'Name 2', 'Topic', 'Uploaded', 'File Link'
    ];
    
    const rows = registrations.map(r => [
      r.id,
      new Date(r.created_at).toLocaleDateString(),
      r.division,
      r.roll_number,
      `"${r.name}"`, // Quote strings to prevent CSV breaking on commas
      r.member2_roll_number || '',
      r.member2_name ? `"${r.member2_name}"` : '',
      `"${r.topic}"`,
      r.has_uploaded ? 'Yes' : 'No',
      r.file_link ? `"${r.file_link}"` : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EVS_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="editorial-card text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <KineticHeading text="Admin Access" className="text-2xl font-heading mb-2 text-ink" />
          <p className="text-ink-light mb-6 text-sm">Enter your 4-digit PIN to access the dashboard.</p>
          
          <form onSubmit={handlePinSubmit}>
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              placeholder="••••"
              className="editorial-input text-center text-2xl tracking-[0.5em] mb-4 font-mono"
              autoFocus
            />
            {error && <p className="text-error text-sm mb-4">{error}</p>}
            <button type="submit" className="editorial-button-primary" disabled={loading || pin.length !== 4}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <KineticHeading text="Admin Dashboard" className="text-3xl font-heading text-ink" />
          <p className="text-ink-light mt-1">Total Registrations: {registrations.length}</p>
        </div>
        <button onClick={exportToCSV} className="editorial-button-secondary !w-auto !mt-0 !py-2.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export to CSV
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse block md:table">
          <thead className="hidden md:table-header-group">
            <tr className="bg-background/50 border-b border-border text-sm text-ink-light">
              <th className="p-4 font-semibold whitespace-nowrap">Div & Roll</th>
              <th className="p-4 font-semibold">Name(s)</th>
              <th className="p-4 font-semibold min-w-[200px]">Topic</th>
              <th className="p-4 font-semibold text-center">Uploaded</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {registrations.length === 0 ? (
              <tr className="block md:table-row">
                <td colSpan={5} className="block md:table-cell p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-ink-light">
                    <svg className="w-12 h-12 mb-4 text-ink-light/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg font-medium text-ink">No Registrations Yet</p>
                    <p className="text-sm mt-1">When students register, they will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="block md:table-row border-b border-border/50 hover:bg-ink/5 transition-colors group p-5 md:p-0 relative">
                  
                  <td className="block md:table-cell md:p-4 align-top whitespace-nowrap mb-3 md:mb-0">
                    <div className="md:hidden text-[10px] text-ink-light uppercase tracking-wider mb-1 font-bold">Div & Roll</div>
                    <span className="font-medium text-ink">{reg.division} - {reg.roll_number}</span>
                    {reg.member2_roll_number && (
                      <div className="text-sm text-ink-light mt-0.5">{reg.division} - {reg.member2_roll_number}</div>
                    )}
                  </td>
                  
                  <td className="block md:table-cell md:p-4 align-top mb-4 md:mb-0">
                    <div className="md:hidden text-[10px] text-ink-light uppercase tracking-wider mb-1 font-bold">Name(s)</div>
                    <div className="text-ink font-medium">{reg.name}</div>
                    {reg.member2_name && (
                      <div className="text-sm text-ink-light mt-0.5">{reg.member2_name}</div>
                    )}
                  </td>
                  
                  <td className="block md:table-cell md:p-4 align-top text-ink mb-4 md:mb-0">
                    <div className="md:hidden text-[10px] text-ink-light uppercase tracking-wider mb-1 font-bold">Topic</div>
                    {reg.topic}
                  </td>
                  
                  <td className="block md:table-cell md:p-4 align-top md:text-center absolute top-5 right-5 md:relative md:top-auto md:right-auto">
                    {reg.has_uploaded ? (
                      <span className="inline-flex items-center justify-center bg-success/10 text-success rounded-full p-1.5" title="Uploaded">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center bg-error/10 text-error rounded-full p-1.5" title="Not Uploaded">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    )}
                  </td>
                  
                  <td className="block md:table-cell md:p-4 align-top md:text-right whitespace-nowrap mt-2 md:mt-0 pt-4 md:pt-0 border-t border-border/30 md:border-t-0 flex justify-end gap-2">
                    {reg.file_link && (
                      <a href={reg.file_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 p-2 text-accent hover:bg-accent/10 bg-accent/5 md:bg-transparent rounded-lg transition-colors text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="md:hidden">View File</span>
                      </a>
                    )}
                    <button onClick={() => handleDelete(reg.id)} className="flex items-center gap-1.5 p-2 text-error hover:bg-error/10 bg-error/5 md:bg-transparent rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100 text-sm font-medium">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="md:hidden">Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
