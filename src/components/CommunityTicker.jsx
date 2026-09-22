import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const FALLBACK = ['Neighbors helping neighbors in Safed', 'Share your time, skills, and support', 'Join the Circles of Giving community'];

export default function CommunityTicker() {
  const [updates, setUpdates] = useState(FALLBACK);

  useEffect(() => {
    let mounted = true;
    base44.entities.Post.filter({ status: 'active' }, '-created_date', 8).then((posts) => {
      const items = posts.map((post) => `${post.author_name || 'A community member'}: ${post.content}`).filter(Boolean);
      if (mounted && items.length) setUpdates(items);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const content = updates.map((update, index) => (
    <span key={index} className="inline-flex items-center gap-8 px-4">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span>{update}</span>
    </span>
  ));

  return (
    <Link to="/feed" aria-label="View the community feed" className="block h-8 overflow-hidden bg-card text-foreground border-t border-border">
      <div className="community-ticker-track flex w-max items-center h-8 whitespace-nowrap text-xs font-medium">
        <div className="flex items-center">{content}</div>
        <div className="flex items-center" aria-hidden="true">{content}</div>
      </div>
    </Link>
  );
}