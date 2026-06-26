import React, { useState, useEffect } from 'react';
import { PortfolioData, Profile, Project, Certification } from './types';
import { DEFAULT_PORTFOLIO_DATA } from './data';
import ProfileSection from './components/ProfileSection';
import ProjectsSection from './components/ProjectsSection';
import CertificationsSection from './components/CertificationsSection';
import { Shield, FolderCode, Award, Terminal, RefreshCw, Lock, Unlock, Eye } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'cyber_portfolio_data_v1';
const AUTH_STORAGE_KEY = 'cyber_portfolio_auth_v1';

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'certs' | 'projects'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Load from LocalStorage or Fallback to defaults
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile && parsed.projects && parsed.certifications) {
          setData(parsed);
        } else {
          setData({ ...DEFAULT_PORTFOLIO_DATA });
        }
      } catch (e) {
        console.error("Failed to parse saved portfolio data", e);
        setData({ ...DEFAULT_PORTFOLIO_DATA });
      }
    } else {
      setData({ ...DEFAULT_PORTFOLIO_DATA });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    }

    // Check session authentication status
    const authStatus = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state to local storage helper
  const saveToStorage = (updatedData: PortfolioData) => {
    setData(updatedData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  };

  // State update handlers
  const handleUpdateProfile = (newProfile: Profile) => {
    if (!data) return;
    const updated = { ...data, profile: newProfile };
    saveToStorage(updated);
  };

  const handleAddProject = (newProject: Project) => {
    if (!data) return;
    const updated = {
      ...data,
      projects: [newProject, ...data.projects]
    };
    saveToStorage(updated);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    if (!data) return;
    const updated = {
      ...data,
      projects: data.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    };
    saveToStorage(updated);
  };

  const handleDeleteProject = (projectId: string) => {
    if (!data) return;
    const updated = {
      ...data,
      projects: data.projects.filter(p => p.id !== projectId)
    };
    saveToStorage(updated);
  };

  const handleAddCert = (newCert: Certification) => {
    if (!data) return;
    const updated = {
      ...data,
      certifications: [newCert, ...data.certifications]
    };
    saveToStorage(updated);
  };

  const handleUpdateCert = (updatedCert: Certification) => {
    if (!data) return;
    const updated = {
      ...data,
      certifications: data.certifications.map(c => c.id === updatedCert.id ? updatedCert : c)
    };
    saveToStorage(updated);
  };

  const handleDeleteCert = (certId: string) => {
    if (!data) return;
    const updated = {
      ...data,
      certifications: data.certifications.filter(c => c.id !== certId)
    };
    saveToStorage(updated);
  };

  const handleImportBackup = (newData: PortfolioData) => {
    saveToStorage(newData);
  };

  const handleResetData = () => {
    if (confirm("Restore factory defaults? This will erase all your custom portfolio modifications!")) {
      saveToStorage({ ...DEFAULT_PORTFOLIO_DATA });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsLoginModalOpen(false);
      setPassphrase('');
      setLoginError('');
    } else {
      setLoginError('ACCESS_DENIED: INVALID_PASSPHRASE');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const handleExportJson = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'cyber_portfolio_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportDataTs = () => {
    if (!data) return;
    const fileContent = `import { PortfolioData } from './types';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = ${JSON.stringify(data, null, 2)};
`;
    const dataUri = `data:text/typescript;charset=utf-8,${encodeURIComponent(fileContent)}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataUri);
    downloadAnchor.setAttribute('download', 'data.ts');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.projects && parsed.certifications) {
            saveToStorage(parsed);
            alert("PORTFOLIO_RESTORE_SUCCESSFUL: NEW_STATE_LOADED");
          } else {
            alert("RESTORE_FAILED: INVALID_DATA_SCHEMA");
          }
        } catch (error) {
          alert("RESTORE_FAILED: ERROR_PARSING_JSON");
        }
      };
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>DECRYPTING_SECURE_VAULT...</span>
        </div>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalProjects = data.projects.length;
  const completedProjects = data.projects.filter(p => p.status === 'Completed').length;
  const activeCerts = data.certifications.filter(c => c.status === 'Active').length;
  const totalCerts = data.certifications.length;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 flex flex-col font-mono selection:bg-cyan-500/20 selection:text-cyan-300 p-4 sm:p-8 md:p-10 max-w-[1200px] mx-auto">
      
      {/* Elegant Dark Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-zinc-800 pb-6 mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tighter uppercase flex items-center gap-2">
            {data.profile.name.replace(/\s+/g, '_')}<span className="text-cyan-500">.sh</span>
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            {data.profile.title} // SECURITY VAULT
          </p>
        </div>
        <div className="text-left sm:text-right space-y-0.5">
          <p className="text-xs text-zinc-600 font-mono">LOCAL_IP: 192.168.1.42</p>
          <div className="flex items-center sm:justify-end gap-3 text-xs">
            <span className="text-zinc-600 uppercase tracking-widest">
              Status: <span className={isAuthenticated ? "text-cyan-400 font-bold" : "text-emerald-500"}>{isAuthenticated ? "EDIT_MODE" : "READ_ONLY"}</span>
            </span>
            <span className="text-zinc-800">|</span>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                  title="Lock administration session"
                >
                  <Unlock className="w-3 h-3 text-cyan-500 animate-pulse" /> [LOGOUT]
                </button>
                <button
                  id="reset-factory-data-btn"
                  onClick={handleResetData}
                  className="flex items-center gap-1 text-zinc-600 hover:text-red-400 transition cursor-pointer"
                  title="Reset portfolio to initial values"
                >
                  <RefreshCw className="w-3 h-3" /> [RESET]
                </button>
              </>
            ) : (
              <button
                onClick={() => { setLoginError(''); setIsLoginModalOpen(true); }}
                className="flex items-center gap-1 text-cyan-500 hover:text-cyan-400 transition cursor-pointer font-bold"
                title="Unlock administrative edit capability"
              >
                <Lock className="w-3 h-3" /> [LOGIN_TO_EDIT]
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Core View Area */}
      <main className="flex-1 flex flex-col space-y-8">
        
        {/* Administrative Quick Actions Bar */}
        {isAuthenticated && (
          <div className="border border-cyan-800/40 bg-cyan-950/5 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>ADMIN_CONSOLE // SNAPSHOT_CONTROL_PANEL</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportDataTs}
                className="px-2.5 py-1 bg-cyan-950/20 hover:bg-cyan-900/20 text-cyan-400 border border-cyan-800/60 hover:border-cyan-600 rounded transition cursor-pointer"
                title="Download data.ts to replace /src/data.ts for permanent GitHub Pages default"
              >
                [DOWNLOAD_DATA.TS_FOR_GITHUB_PAGES]
              </button>
              <button
                onClick={handleExportJson}
                className="px-2.5 py-1 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded transition cursor-pointer"
                title="Download current state as JSON backup"
              >
                [BACKUP_JSON]
              </button>
              <label className="px-2.5 py-1 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded transition cursor-pointer flex items-center gap-1">
                <span>[RESTORE_JSON]</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
        
        {/* Primary View Switching Tabs */}
        <section className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
          <button
            id="view-dashboard-btn"
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 border text-xs font-mono tracking-wider uppercase transition cursor-pointer ${
              activeView === 'dashboard' 
                ? 'bg-zinc-900/80 text-cyan-400 border-zinc-700' 
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            [01_About]
          </button>

          <button
            id="view-certs-btn"
            onClick={() => setActiveView('certs')}
            className={`px-4 py-2 border text-xs font-mono tracking-wider uppercase transition cursor-pointer ${
              activeView === 'certs' 
                ? 'bg-zinc-900/80 text-cyan-400 border-zinc-700' 
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            [02_Credentials] ({totalCerts})
          </button>

          <button
            id="view-projects-btn"
            onClick={() => setActiveView('projects')}
            className={`px-4 py-2 border text-xs font-mono tracking-wider uppercase transition cursor-pointer ${
              activeView === 'projects' 
                ? 'bg-zinc-900/80 text-cyan-400 border-zinc-700' 
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            [03_Previous_Projects] ({totalProjects})
          </button>
        </section>

        {/* View Routing / Display Pane */}
        <section className="transition-all duration-300 flex-1">
          {activeView === 'dashboard' && (
            <div className="space-y-10">
              {/* Profile Card */}
              <ProfileSection 
                profile={data.profile} 
                onUpdate={handleUpdateProfile} 
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}

          {activeView === 'projects' && (
            <ProjectsSection
              projects={data.projects}
              onAdd={handleAddProject}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              isAuthenticated={isAuthenticated}
            />
          )}

          {activeView === 'certs' && (
            <CertificationsSection
              certifications={data.certifications}
              onAdd={handleAddCert}
              onUpdate={handleUpdateCert}
              onDelete={handleDeleteCert}
              isAuthenticated={isAuthenticated}
            />
          )}
        </section>

      </main>

      {/* Elegant Dark Status Bar Footer */}
      <footer className="mt-12 pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-zinc-600 gap-4">
        <div className="flex gap-6">
          <a href={data.profile.github || "#"} target="_blank" rel="noreferrer" className="hover:text-cyan-500 transition">GitHub</a>
          <a href={data.profile.linkedin || "#"} target="_blank" rel="noreferrer" className="hover:text-cyan-500 transition">LinkedIn</a>
          <span className="text-zinc-800">//</span>
          <span>NODE: SEC-VAULT-ACTIVE</span>
        </div>
        <div>
          Copyright (c) 2026 {data.profile.name} // Built_on_Terminal_v2.5
        </div>
      </footer>

      {/* Terminal Style Login Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md border border-zinc-800 bg-[#0a0a0a] p-6 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Lock className="w-4 h-4" />
                <span className="font-mono text-sm font-semibold tracking-wider">CREDENTIAL_AUTHENTICATION_REQUIRED</span>
              </div>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Enter the vault decryption passcode to enable editing capabilities.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">DECRYPTION PASSCODE</label>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter passcode..."
                  />
                  <span className="text-[9px] font-mono text-zinc-600 mt-1 block">💡 Protip: Use default passcode "admin" to authenticate.</span>
                </div>

                {loginError && (
                  <div className="text-[11px] font-mono text-red-500 bg-red-950/20 border border-red-900/30 p-2 text-center">
                    {loginError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsLoginModalOpen(false); setPassphrase(''); setLoginError(''); }}
                    className="px-4 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs font-mono transition cursor-pointer"
                  >
                    [DISMISS]
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-cyan-950/20 text-cyan-400 border border-cyan-900/50 hover:bg-cyan-900/40 rounded text-xs font-mono transition cursor-pointer"
                  >
                    [ACCESS_GRANTED]
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

