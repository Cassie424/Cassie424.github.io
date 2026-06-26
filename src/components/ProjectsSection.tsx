import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '../types';
import { Plus, Trash2, Edit, ExternalLink, Github, FileText, Search, Tag, Filter, Check, X } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
  onAdd: (project: Project) => void;
  onUpdate: (project: Project) => void;
  onDelete: (id: string) => void;
  isAuthenticated?: boolean;
}

const CATEGORIES: ProjectCategory[] = [
  'Penetration Testing',
  'Defensive Security',
  'Threat Intelligence',
  'Reverse Engineering',
  'Incident Response',
  'Cryptography',
  'Other'
];

export default function ProjectsSection({ projects, onAdd, onUpdate, onDelete, isAuthenticated = false }: ProjectsSectionProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Penetration Testing');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Planned'>('Completed');
  const [tagsInput, setTagsInput] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Unique tags across all projects for easy search / filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [projects]);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Penetration Testing');
    setStatus('Completed');
    setTagsInput('');
    setGithubLink('');
    setReportLink('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      tags: parsedTags,
      githubLink: githubLink.trim() || undefined,
      reportLink: reportLink.trim() || undefined,
      date
    };

    onAdd(newProject);
    resetForm();
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setStatus(project.status);
    setTagsInput(project.tags.join(', '));
    setGithubLink(project.githubLink || '');
    setReportLink(project.reportLink || '');
    setDate(project.date);
    setIsAdding(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !title.trim() || !description.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updatedProject: Project = {
      id: editingId,
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      tags: parsedTags,
      githubLink: githubLink.trim() || undefined,
      reportLink: reportLink.trim() || undefined,
      date
    };

    onUpdate(updatedProject);
    resetForm();
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Controls */}
      <div className="border border-zinc-800 bg-zinc-900/10 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050505] border border-zinc-800 rounded pl-9 pr-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-[#050505] border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {isAuthenticated && (
          <button
            id="toggle-add-project-btn"
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-950/20 hover:bg-cyan-900/20 text-cyan-400 border border-cyan-900/50 hover:border-cyan-700/80 rounded font-mono text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            ADD_NEW_PROJECT
          </button>
        )}
      </div>

      {/* Selected Tag Indicator */}
      {selectedTag && (
        <div className="border border-zinc-800 bg-zinc-900/20 rounded px-3 py-1.5 w-max">
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Filtering by tag: <span className="text-cyan-400 font-semibold">{selectedTag}</span>
          </span>
          <button 
            onClick={() => setSelectedTag(null)}
            className="text-zinc-500 hover:text-red-400 p-0.5 rounded transition"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Add / Edit Form Panel */}
      {isAuthenticated && (isAdding || editingId) && (
        <div className="border border-cyan-500/20 bg-zinc-900/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
          <h3 className="font-mono text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span>{isAdding ? 'ADD_NEW_PROJECT_RECORD' : 'EDIT_PROJECT_RECORD'}</span>
            <span className="text-[10px] text-zinc-500 font-normal">({isAdding ? 'INITIALIZE' : 'RE_CONFIGURE'})</span>
          </h3>

          <form onSubmit={isAdding ? handleAddSubmit : handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">PROJECT TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Threat Intelligence Dashboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-sans text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">DESCRIPTION (Remediation steps, discovery details, writeup)</label>
              <textarea
                required
                rows={3}
                placeholder="Brief summary of what you did, the vulnerabilities mitigated, and methodologies used..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-sans text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">TAGS (separated by commas)</label>
                <input
                  type="text"
                  placeholder="e.g. Wireshark, Nmap, Bash, Scripting"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">RECORD DATE</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">CODE REPOSITORY (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">SECURITY REPORT / WRITEUP LINK (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/reports/..."
                value={reportLink}
                onChange={(e) => setReportLink(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
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
                {isAdding ? 'COMMENCE_ADD' : 'APPLY_RECONFIG'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="border border-zinc-800 bg-zinc-900/10 p-12 text-center">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-mono text-sm">NO_MATCHING_PROJECTS_FOUND</p>
          <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-zinc-800 bg-zinc-900/30 p-5 hover:border-zinc-700 transition duration-300 flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Top border colored accent depending on category */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20" />

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-[10px] bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                      {project.category}
                    </span>
                    <h4 className="text-base font-semibold text-zinc-100 font-mono tracking-tight mt-2 group-hover:text-cyan-400 transition">
                      {project.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status badge */}
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                      project.status === 'Completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : project.status === 'In Progress' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs font-sans leading-relaxed mb-4 line-clamp-4">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition ${
                        tag === selectedTag
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-[#050505] text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                  <span className="font-mono text-[10px] text-zinc-500">
                    DATE: {project.date}
                  </span>

                  <div className="flex items-center gap-2">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#050505] text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 rounded border border-zinc-800 transition"
                        title="GitHub Code"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.reportLink && (
                      <a
                        href={project.reportLink}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#050505] text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 rounded border border-zinc-800 transition"
                        title="Security Report"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => handleStartEdit(project)}
                          className="p-1.5 bg-[#050505] text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded border border-zinc-800 transition cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove this project archive: "${project.title}"?`)) {
                              onDelete(project.id);
                            }
                          }}
                          className="p-1.5 bg-[#050505] text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded border border-zinc-800 transition cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
