import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Download, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Users, 
  CheckCircle2,
  ChevronDown,
  History,
  X,
  Trash
} from 'lucide-react';
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

interface DeletedRegistration extends Registration {
  deleted_at: string;
}

const ALL_DIVISIONS = ['A', 'B', 'C', 'D', 'E-Commerce', 'E-Arts'];

const AdminPanel = () => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Deletion History state (persisted in localStorage)
  const [deletedHistory, setDeletedHistory] = useState<DeletedRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('evs_admin_deletion_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');

  // Save deletion history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('evs_admin_deletion_history', JSON.stringify(deletedHistory));
    } catch (e) {
      console.error('Failed to save deletion history', e);
    }
  }, [deletedHistory]);

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
    const itemToDelete = registrations.find(r => r.id === id);
    if (!itemToDelete) return;

    if (!window.confirm(`Are you sure you want to delete registration for "${itemToDelete.name}" (${itemToDelete.topic})?`)) return;

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin }
      });
      if (response.ok) {
        const deletedRecord: DeletedRegistration = {
          ...itemToDelete,
          deleted_at: new Date().toISOString()
        };
        setDeletedHistory(prev => [deletedRecord, ...prev]);
        setRegistrations(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting registration.');
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear all deletion history log?')) {
      setDeletedHistory([]);
    }
  };

  const exportToExcel = () => {
    const headers = [
      'ID', 'Date Submitted', 'Division', 'Format', 'Roll Number 1', 'Student Name 1', 'Roll Number 2', 'Student Name 2', 'Topic Title', 'Uploaded Status', 'File Link'
    ];
    
    const rows = filteredRegistrations.map(r => [
      r.id,
      r.created_at ? new Date(r.created_at).toLocaleString() : 'N/A',
      r.division,
      r.member2_name ? 'Group' : 'Individual',
      r.roll_number,
      `"${r.name}"`,
      r.member2_roll_number || '',
      r.member2_name ? `"${r.member2_name}"` : '',
      `"${r.topic}"`,
      r.has_uploaded ? 'Uploaded' : 'Pending',
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

  // ---------------------------------------------------------
  // ANALYTICS COMPUTATIONS
  // ---------------------------------------------------------
  const analytics = useMemo(() => {
    const totalEntries = registrations.length;
    let individualCount = 0;
    let groupCount = 0;
    let totalStudents = 0;

    const divisionCounts: Record<string, number> = {};
    ALL_DIVISIONS.forEach(d => { divisionCounts[d] = 0; });

    registrations.forEach(r => {
      if (divisionCounts[r.division] !== undefined) {
        divisionCounts[r.division] += 1;
      } else {
        divisionCounts[r.division] = 1;
      }

      if (r.member2_name || r.member2_roll_number) {
        groupCount += 1;
        totalStudents += 2;
      } else {
        individualCount += 1;
        totalStudents += 1;
      }
    });

    let topDivision = 'N/A';
    let maxRegs = 0;
    Object.entries(divisionCounts).forEach(([div, count]) => {
      if (count > maxRegs) {
        maxRegs = count;
        topDivision = `DIV ${div}`;
      }
    });

    return {
      totalEntries,
      totalStudents,
      individualCount,
      groupCount,
      topDivision: maxRegs > 0 ? topDivision : 'N/A',
      maxRegs,
      divisionCounts,
    };
  }, [registrations]);

  const maxDivisionCount = Math.max(...Object.values(analytics.divisionCounts), 1);

  const handleBarClick = (div: string) => {
    if (selectedDivision === div) {
      setSelectedDivision('ALL');
    } else {
      setSelectedDivision(div);
    }
    const tableSection = document.getElementById('all-entries-section');
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ---------------------------------------------------------
  // FILTERING & SORTING LOGIC
  // ---------------------------------------------------------
  const filteredRegistrations = useMemo(() => {
    const list = registrations.filter(reg => {
      if (selectedDivision !== 'ALL' && reg.division !== selectedDivision) {
        return false;
      }

      if (selectedFormat === 'INDIVIDUAL' && (reg.member2_name || reg.member2_roll_number)) {
        return false;
      }
      if (selectedFormat === 'GROUP' && !reg.member2_name && !reg.member2_roll_number) {
        return false;
      }
      if (selectedFormat === 'UPLOADED' && !reg.has_uploaded) {
        return false;
      }
      if (selectedFormat === 'PENDING' && reg.has_uploaded) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName1 = reg.name.toLowerCase().includes(q);
        const matchName2 = reg.member2_name ? reg.member2_name.toLowerCase().includes(q) : false;
        const matchRoll1 = String(reg.roll_number).includes(q);
        const matchRoll2 = reg.member2_roll_number ? String(reg.member2_roll_number).includes(q) : false;
        const matchTopic = reg.topic.toLowerCase().includes(q);
        const matchDiv = reg.division.toLowerCase().includes(q);

        if (!matchName1 && !matchName2 && !matchRoll1 && !matchRoll2 && !matchTopic && !matchDiv) {
          return false;
        }
      }

      return true;
    });

    // Sort entries by roll_number ascending
    return list.sort((a, b) => a.roll_number - b.roll_number);
  }, [registrations, selectedDivision, selectedFormat, searchQuery]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-md text-center">
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
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin h-5 w-5 text-white" />
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
      className="w-full max-w-6xl mx-auto px-4 py-4 space-y-8"
    >
      {/* ---------------------------------------------------------
          TOP HEADER SECTION
         --------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <KineticHeading text="Admin Dashboard" className="text-3xl sm:text-4xl font-heading font-semibold text-ink" glowSweep />
          <p className="text-ink-light text-xs sm:text-sm font-medium mt-1">
            Grade 12 · Environmental Studies · All Registrations
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* History Button (Opens Deletion History Modal) */}
          <button 
            onClick={() => setShowHistoryModal(true)} 
            className="editorial-button-secondary !w-auto !mt-0 !py-2.5 !px-4 flex items-center gap-2 text-xs font-semibold border border-border hover:bg-surface"
          >
            <History className="w-4 h-4 text-accent" />
            <span>History</span>
            {deletedHistory.length > 0 && (
              <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                {deletedHistory.length}
              </span>
            )}
          </button>

          {/* Export Excel Button */}
          <button 
            onClick={exportToExcel} 
            className="editorial-button-primary !w-auto !mt-0 !py-2.5 !px-4 flex items-center gap-2 text-xs font-semibold shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------
          ANALYTICS STAT CARDS GRID (4 Full-Width Grid Cards)
         --------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {/* Card 1: Total Students */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between w-full"
        >
          <span className="text-[11px] font-bold text-ink-light uppercase tracking-wider">
            TOTAL STUDENTS
          </span>
          <div className="my-3">
            <span className="text-4xl sm:text-5xl font-heading font-bold text-ink tracking-tight">
              {analytics.totalStudents}
            </span>
          </div>
          <span className="text-xs text-ink-light font-medium">
            students registered
          </span>
        </motion.div>

        {/* Card 2: Individual */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between w-full"
        >
          <span className="text-[11px] font-bold text-ink-light uppercase tracking-wider">
            INDIVIDUAL
          </span>
          <div className="my-3">
            <span className="text-4xl sm:text-5xl font-heading font-bold text-ink tracking-tight">
              {analytics.individualCount}
            </span>
          </div>
          <span className="text-xs text-ink-light font-medium">
            solo presentations
          </span>
        </motion.div>

        {/* Card 3: Group */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between w-full"
        >
          <span className="text-[11px] font-bold text-ink-light uppercase tracking-wider">
            GROUP
          </span>
          <div className="my-3">
            <span className="text-4xl sm:text-5xl font-heading font-bold text-ink tracking-tight">
              {analytics.groupCount}
            </span>
          </div>
          <span className="text-xs text-ink-light font-medium">
            group presentations
          </span>
        </motion.div>

        {/* Card 4: Top Division */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between w-full"
        >
          <span className="text-[11px] font-bold text-ink-light uppercase tracking-wider">
            {analytics.topDivision}
          </span>
          <div className="my-3">
            <span className="text-4xl sm:text-5xl font-heading font-bold text-ink tracking-tight">
              {analytics.maxRegs}
            </span>
          </div>
          <span className="text-xs text-ink-light font-medium">
            most registrations
          </span>
        </motion.div>
      </div>

      {/* ---------------------------------------------------------
          REGISTRATIONS BY DIVISION BAR CHART (FULL WIDTH CONTAINER)
         --------------------------------------------------------- */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm w-full"
      >
        <h3 className="text-sm font-semibold text-ink mb-6">
          Registrations by Division
        </h3>

        <div className="h-44 sm:h-52 flex items-end justify-around gap-3 sm:gap-8 pt-6 pb-2 border-b border-border/40 w-full">
          {ALL_DIVISIONS.map((division) => {
            const count = analytics.divisionCounts[division] || 0;
            const percentage = Math.max((count / maxDivisionCount) * 100, 4);
            const isSelected = selectedDivision === division;

            return (
              <div 
                key={division} 
                onClick={() => handleBarClick(division)}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                title={`Click to ${isSelected ? 'clear filter' : `filter Division ${division}`}`}
              >
                {/* Count Badge */}
                <div className={`text-[11px] font-bold mb-1.5 transition-all ${
                  isSelected ? 'text-accent font-extrabold scale-110' : 'text-ink opacity-90'
                }`}>
                  {count > 0 ? count : ''}
                </div>

                {/* Animated Column Bar */}
                <div className={`w-full max-w-[64px] rounded-t-lg overflow-hidden h-full flex items-end transition-all ${
                  isSelected ? 'bg-accent/20 ring-2 ring-accent/60 shadow-sm' : 'bg-border/20 group-hover:bg-border/40'
                }`}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full rounded-t-lg transition-all ${
                      isSelected ? 'bg-accent shadow-glow' : 'bg-accent/30 group-hover:bg-accent/60'
                    }`}
                  />
                </div>

                {/* Division X-Axis Label */}
                <span className={`text-[11px] font-semibold mt-3 transition-all ${
                  isSelected ? 'text-accent font-bold scale-105' : 'text-ink-light group-hover:text-ink'
                }`}>
                  {division}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ---------------------------------------------------------
          ALL ENTRIES & FILTERS SECTION
         --------------------------------------------------------- */}
      <div id="all-entries-section" className="space-y-4 w-full pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-heading font-semibold text-ink">
            All Entries
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-ink-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface border border-border text-ink focus:outline-none focus:border-accent transition-colors shadow-sm"
              />
            </div>

            {/* Division Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl bg-surface border border-border text-ink focus:outline-none focus:border-accent cursor-pointer transition-colors shadow-sm"
              >
                <option value="ALL">Division: All</option>
                {ALL_DIVISIONS.map(d => (
                  <option key={d} value={d}>Div {d}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-ink-light absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Format / Status Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl bg-surface border border-border text-ink focus:outline-none focus:border-accent cursor-pointer transition-colors shadow-sm"
              >
                <option value="ALL">Format: All</option>
                <option value="INDIVIDUAL">Individual Only</option>
                <option value="GROUP">Group Only</option>
                <option value="UPLOADED">Uploaded Files</option>
                <option value="PENDING">Pending Files</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-ink-light absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------
            REDESIGNED REGISTRATIONS TABLE
           --------------------------------------------------------- */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-ink-light bg-background/50">
                  <th className="py-3.5 px-5 whitespace-nowrap">DIVISION</th>
                  <th className="py-3.5 px-5 whitespace-nowrap">FORMAT</th>
                  <th className="py-3.5 px-5 whitespace-nowrap">ROLL NUMBER(S)</th>
                  <th className="py-3.5 px-5 min-w-[220px]">TOPIC</th>
                  <th className="py-3.5 px-5 whitespace-nowrap">SUBMITTED</th>
                  <th className="py-3.5 px-5 text-right whitespace-nowrap">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center text-ink-light space-y-2">
                        <Users className="w-10 h-10 opacity-30" />
                        <p className="text-sm font-semibold text-ink">No entries found</p>
                        <p className="text-xs">Try clearing search or changing active filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => {
                    const isGroup = Boolean(reg.member2_name || reg.member2_roll_number);

                    return (
                      <tr 
                        key={reg.id} 
                        className="hover:bg-ink/[0.02] transition-colors group"
                      >
                        {/* Division Badge */}
                        <td className="py-4 px-5 align-middle whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-background border border-border text-ink">
                            Div {reg.division}
                          </span>
                        </td>

                        {/* Format Badge */}
                        <td className="py-4 px-5 align-middle whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            isGroup 
                              ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20' 
                              : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                          }`}>
                            {isGroup ? 'Group' : 'Individual'}
                          </span>
                        </td>

                        {/* Roll Number(s) */}
                        <td className="py-4 px-5 align-middle whitespace-nowrap font-mono font-medium text-ink">
                          {reg.roll_number}
                          {reg.member2_roll_number && (
                            <span className="text-ink-light font-normal">, {reg.member2_roll_number}</span>
                          )}
                        </td>

                        {/* Name(s) & Topic */}
                        <td className="py-4 px-5 align-middle">
                          <p className="font-semibold text-ink leading-snug">
                            {reg.topic}
                          </p>
                          <p className="text-[11px] text-ink-light mt-0.5">
                            {reg.name}
                            {reg.member2_name && ` & ${reg.member2_name}`}
                          </p>
                        </td>

                        {/* Submitted Date / Upload Status */}
                        <td className="py-4 px-5 align-middle whitespace-nowrap text-ink-light font-sans">
                          {formatDate(reg.created_at)}
                          {reg.has_uploaded && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Uploaded
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 align-middle text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {reg.file_link && (
                              <a
                                href={reg.file_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                                title="View Presentation File"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleDelete(reg.id)}
                              className="px-2.5 py-1 text-xs text-red-600 hover:text-red-700 bg-red-500/5 hover:bg-red-500/15 border border-red-500/20 rounded-lg transition-colors font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------
          DELETION HISTORY MODAL
         --------------------------------------------------------- */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-background/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                    <Trash className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base text-ink">
                      Deletion History Log
                    </h3>
                    <p className="text-xs text-ink-light">
                      Records of deleted student registrations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {deletedHistory.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-600 hover:underline font-medium px-2 py-1"
                    >
                      Clear Log
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-1.5 rounded-lg text-ink-light hover:text-ink hover:bg-ink/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body / History List */}
              <div className="p-5 overflow-y-auto space-y-3 flex-1">
                {deletedHistory.length === 0 ? (
                  <div className="py-12 text-center text-ink-light">
                    <Trash2 className="w-10 h-10 opacity-30 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-ink">No deleted registrations</p>
                    <p className="text-xs mt-1">Deleted registration entries will be logged here.</p>
                  </div>
                ) : (
                  deletedHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-background border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold px-2 py-0.5 rounded bg-surface border border-border text-[11px]">
                            Div {item.division} - Roll {item.roll_number}
                          </span>
                          {item.member2_roll_number && (
                            <span className="text-ink-light text-[11px]">
                              & Roll {item.member2_roll_number}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-ink text-sm">
                          {item.name} {item.member2_name ? `& ${item.member2_name}` : ''}
                        </p>
                        <p className="text-ink-light text-xs">
                          Topic: <span className="text-ink font-medium">{item.topic}</span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                        <span className="text-[10px] font-semibold uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded block sm:inline-block mb-1">
                          Deleted
                        </span>
                        <p className="text-[11px] text-ink-light">
                          {formatDate(item.deleted_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-background/50 text-right">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="editorial-button-secondary !w-auto !mt-0 !py-2 !px-4 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPanel;
