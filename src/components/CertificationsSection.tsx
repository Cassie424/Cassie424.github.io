import React, { useState } from 'react';
import { Certification } from '../types';
import { Plus, Trash2, Edit, ExternalLink, Award, Calendar, CheckCircle, ShieldAlert, Check, X } from 'lucide-react';

interface CertificationsSectionProps {
  certifications: Certification[];
  onAdd: (cert: Certification) => void;
  onUpdate: (cert: Certification) => void;
  onDelete: (id: string) => void;
  isAuthenticated?: boolean;
}

export default function CertificationsSection({ certifications, onAdd, onUpdate, onDelete, isAuthenticated = false }: CertificationsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [verificationLink, setVerificationLink] = useState('');
  const [status, setStatus] = useState<'Active' | 'In Progress' | 'Planned'>('Active');

  const resetForm = () => {
    setName('');
    setIssuer('');
    setIssueDate('');
    setExpiryDate('');
    setCredentialId('');
    setVerificationLink('');
    setStatus('Active');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim()) return;

    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      expiryDate: expiryDate.trim() || undefined,
      credentialId: credentialId.trim() || undefined,
      verificationLink: verificationLink.trim() || undefined,
      status
    };

    onAdd(newCert);
    resetForm();
  };

  const handleStartEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setName(cert.name);
    setIssuer(cert.issuer);
    setIssueDate(cert.issueDate);
    setExpiryDate(cert.expiryDate || '');
    setCredentialId(cert.credentialId || '');
    setVerificationLink(cert.verificationLink || '');
    setStatus(cert.status);
    setIsAdding(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !name.trim() || !issuer.trim()) return;

    const updatedCert: Certification = {
      id: editingId,
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      expiryDate: expiryDate.trim() || undefined,
      credentialId: credentialId.trim() || undefined,
      verificationLink: verificationLink.trim() || undefined,
      status
    };

    onUpdate(updatedCert);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header with control */}
      <div className="border border-zinc-800 bg-zinc-900/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-sm font-semibold text-zinc-200">VERIFIED_SECURITY_CREDENTIALS</h3>
          <p className="text-xs text-zinc-500 font-sans">Formal certifications, security accreditations, and continuing cyber education.</p>
        </div>

        {isAuthenticated && (
          <button
            id="toggle-add-cert-btn"
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-950/20 hover:bg-cyan-900/20 text-cyan-400 border border-cyan-900/50 hover:border-cyan-700/80 rounded font-mono text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            ADD_CREDENTIAL
          </button>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {isAuthenticated && (isAdding || editingId) && (
        <div className="border border-cyan-500/20 bg-zinc-900/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
          <h4 className="font-mono text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span>{isAdding ? 'ADD_NEW_CREDENTIAL_RECORD' : 'EDIT_CREDENTIAL_RECORD'}</span>
          </h4>

          <form onSubmit={isAdding ? handleAddSubmit : handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">CERTIFICATION NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Information Systems Auditor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-sans text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">ISSUING AUTHORITY</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISACA, CompTIA, OffSec"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-sans text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">STATUS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">ISSUE DATE (OR ESTIMATE)</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">EXPIRY DATE (OPTIONAL)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">LICENSE / CREDENTIAL ID (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. SEC-829184"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">VERIFICATION URL (OPTIONAL)</label>
                <input
                  type="url"
                  placeholder="https://verify.org/id/..."
                  value={verificationLink}
                  onChange={(e) => setVerificationLink(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs font-mono transition"
              >
                DISMISS
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-950/20 text-cyan-400 border border-cyan-900/40 hover:bg-cyan-900/40 rounded text-xs font-mono transition"
              >
                {isAdding ? 'SAVE_CREDENTIAL' : 'APPLY_RECONFIG'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certifications Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="border border-zinc-800 bg-zinc-900/30 p-5 hover:border-zinc-700 transition duration-300 flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="p-2.5 bg-[#050505] rounded border border-zinc-800 text-cyan-400">
                  <Award className="w-5 h-5" />
                </div>

                <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
                  cert.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : cert.status === 'In Progress'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {cert.status.toUpperCase()}
                </span>
              </div>

              <h4 className="text-sm font-bold text-zinc-200 font-mono tracking-tight leading-snug">
                {cert.name}
              </h4>
              <p className="text-xs text-cyan-400 font-mono mt-1">{cert.issuer}</p>

              <div className="space-y-1.5 mt-4 pt-4 border-t border-zinc-800/60 font-mono text-[10px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    DATE: {cert.issueDate}
                    {cert.expiryDate ? ` - EXP: ${cert.expiryDate}` : ' (No Expiration)'}
                  </span>
                </div>
                {cert.credentialId && (
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500">
                    <span>LICENSE: {cert.credentialId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-800/40">
              {cert.verificationLink ? (
                <a
                  href={cert.verificationLink}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition"
                >
                  <ExternalLink className="w-3 h-3" /> VERIFY_CREDENTIAL
                </a>
              ) : (
                <span className="text-[10px] font-mono text-zinc-600">NO_VERIFY_LINK</span>
              )}

              {isAuthenticated && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(cert)}
                    className="p-1 hover:bg-[#1a1a1a] rounded border border-zinc-800 text-zinc-500 hover:text-amber-400 transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete credential record: "${cert.name}"?`)) {
                        onDelete(cert.id);
                      }
                    }}
                    className="p-1 hover:bg-[#1a1a1a] rounded border border-zinc-800 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="col-span-full border border-zinc-800 bg-zinc-900/10 p-8 text-center">
            <p className="text-zinc-500 font-mono text-xs">NO_CREDENTIAL_RECORDS_STORED</p>
          </div>
        )}
      </div>
    </div>
  );
}
