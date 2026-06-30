import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Search, BookOpen, FileText, Video, Wrench, HelpCircle, FileCode, ExternalLink, Star, Download } from 'lucide-react';

const CATEGORY_META = {
  Guide: { icon: BookOpen, color: '#1A2744', bg: 'rgba(26,39,68,0.10)' },
  Template: { icon: FileCode, color: '#7c5cbf', bg: '#ede7f6' },
  Video: { icon: Video, color: '#c0392b', bg: '#fdecea' },
  Article: { icon: FileText, color: '#2d7a3a', bg: '#e8f5e9' },
  Tool: { icon: Wrench, color: '#C9A84C', bg: 'rgba(201,168,76,0.15)' },
  FAQ: { icon: HelpCircle, color: '#008080', bg: 'rgba(0,128,128,0.10)' },
};

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    base44.entities.Resource.list('-created_date', 100)
      .then((data) => {
        setResources((data || []).filter(r => r.status === 'published'));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r => {
    const catMatch = activeCategory === 'All' || r.category === activeCategory;
    if (!catMatch) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q));
  });

  const featured = resources.filter(r => r.featured);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Resource Library</h1>
          <p className="text-sm text-muted-foreground">Guides, templates, tools & knowledge for our community</p>
        </div>
      </div>

      {/* Featured */}
      {!loading && featured.length > 0 && (
        <div className="mt-6 mb-8">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-accent fill-accent" /> Featured Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map(r => {
              const meta = CATEGORY_META[r.category] || CATEGORY_META.Guide;
              const Icon = meta.icon;
              return (
                <div key={r.id} className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                    <Icon className="w-6 h-6" style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: meta.color }}>{r.category}</span>
                    <h3 className="font-bold text-sm text-foreground mb-1">{r.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{r.description}</p>
                    {r.url || r.file_url ? (
                      <a href={r.file_url || r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        {r.file_url ? <><Download className="w-3 h-3" /> Download</> : <><ExternalLink className="w-3 h-3" /> Open</>}
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search resources by title, description, or tag..."
          className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {['All', ...Object.keys(CATEGORY_META)].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground border border-border hover:border-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="bg-card rounded-2xl border border-border p-5 h-40 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <h3 className="font-bold text-foreground mb-1">No resources found</h3>
          <p className="text-sm text-muted-foreground">Check back soon — we're adding new content regularly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => {
            const meta = CATEGORY_META[r.category] || CATEGORY_META.Guide;
            const Icon = meta.icon;
            return (
              <div key={r.id} className="flex flex-col p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: meta.bg }}>
                    <Icon className="w-5 h-5" style={{ color: meta.color }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: meta.color }}>{r.category}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">{r.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-1">{r.description}</p>
                {r.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                )}
                {(r.url || r.file_url) && (
                  <a href={r.file_url || r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-auto">
                    {r.file_url ? <><Download className="w-3 h-3" /> Download</> : <><ExternalLink className="w-3 h-3" /> Open Resource</>}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}