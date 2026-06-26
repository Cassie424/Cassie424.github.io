import React, { useState } from 'react';
import { Profile } from '../types';
import { Shield, Mail, Github, Linkedin, Globe, Edit2, Check, X, Terminal } from 'lucide-react';

interface ProfileSectionProps {
  profile: Profile;
  onUpdate: (updated: Profile) => void;
  isAuthenticated?: boolean;
}

export default function ProfileSection({ profile, onUpdate, isAuthenticated = false }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<Profile>({ ...profile });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(edited);
    setIsEditing(false);
  };

  return (
    <div id="profile-container" className="border border-zinc-800 bg-zinc-900/10 p-6 relative overflow-hidden">
      {/* Aesthetic matrix grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a08_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                  SYSTEM ACTIVE
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  ID: SEC-NODE-01
                </span>
              </div>
              <h1 className="text-2xl font-bold font-mono text-white tracking-tight mt-1">{profile.name}</h1>
              <p className="text-zinc-400 font-medium font-sans text-sm">{profile.title}</p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  id="edit-profile-btn"
                  onClick={() => { setEdited({ ...profile }); setIsEditing(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 border border-zinc-800 transition font-mono text-xs cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  EDIT_PROFILE
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    id="cancel-profile-btn"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 py-1.5 px-3 bg-red-950/20 text-red-400 border border-red-900/40 hover:bg-red-900/40 rounded font-mono text-xs transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> CANCEL
                  </button>
                  <button
                    id="save-profile-btn"
                    onClick={handleSave}
                    className="flex items-center gap-1 py-1.5 px-3 bg-cyan-950/20 text-cyan-400 border border-cyan-900/40 hover:bg-cyan-900/40 rounded font-mono text-xs transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> SAVE_CHANGES
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing && isAuthenticated ? (
          <form onSubmit={handleSave} className="space-y-4 bg-[#09090b]/80 p-4 rounded border border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">NAME</label>
                <input
                  type="text"
                  value={edited.name}
                  onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                  required
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">PROFESSIONAL TITLE</label>
                <input
                  type="text"
                  value={edited.title}
                  onChange={(e) => setEdited({ ...edited, title: e.target.value })}
                  required
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">BIOGRAPHY</label>
              <textarea
                value={edited.bio}
                onChange={(e) => setEdited({ ...edited, bio: e.target.value })}
                required
                rows={3}
                className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-sans text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">EMAIL CONTACT</label>
                <input
                  type="email"
                  value={edited.email}
                  onChange={(e) => setEdited({ ...edited, email: e.target.value })}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">PERSONAL WEBSITE</label>
                <input
                  type="url"
                  value={edited.website}
                  onChange={(e) => setEdited({ ...edited, website: e.target.value })}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">GITHUB PROFILE</label>
                <input
                  type="url"
                  value={edited.github}
                  onChange={(e) => setEdited({ ...edited, github: e.target.value })}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">LINKEDIN URL</label>
                <input
                  type="url"
                  value={edited.linkedin}
                  onChange={(e) => setEdited({ ...edited, linkedin: e.target.value })}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">CURRENT STATUS LOG</label>
              <input
                type="text"
                value={edited.statusText}
                onChange={(e) => setEdited({ ...edited, statusText: e.target.value })}
                placeholder="What are you currently reading or hacking?"
                className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">SYS_OVERVIEW</h3>
                <p className="text-zinc-300 leading-relaxed text-sm font-sans">{profile.bio}</p>
              </div>

              {profile.statusText && (
                <div className="bg-[#09090b]/40 border border-zinc-800 p-3 flex items-start gap-2.5">
                  <Terminal className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">CURRENT_FOCUS_LOG</span>
                    <p className="text-xs font-mono text-cyan-400">{profile.statusText}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 lg:border-l lg:border-zinc-800 lg:pl-6">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">COMM_CHANNELS</h3>
              <div className="space-y-2.5 font-mono text-xs text-zinc-400">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 hover:text-cyan-400 transition group p-1.5 rounded hover:bg-[#09090b]/80"
                  >
                    <Mail className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-cyan-400 transition group p-1.5 rounded hover:bg-[#09090b]/80"
                  >
                    <Github className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                    <span className="truncate">GitHub Profile</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-cyan-400 transition group p-1.5 rounded hover:bg-[#09090b]/80"
                  >
                    <Linkedin className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                    <span className="truncate">LinkedIn Profile</span>
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-cyan-400 transition group p-1.5 rounded hover:bg-[#09090b]/80"
                  >
                    <Globe className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                    <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

