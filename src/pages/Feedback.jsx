import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageSquare, Star, Loader2, Check, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CATEGORIES = [
  { key: 'testimonial', label: 'Share Your Story', emoji: '💬', desc: 'Tell us about your experience' },
  { key: 'bug_report', label: 'Report a Bug', emoji: '🐛', desc: 'Something not working right?' },
  { key: 'feature_request', label: 'Request a Feature', emoji: '💡', desc: 'Suggest something new' },
  { key: 'general', label: 'General Feedback', emoji: '✉️', desc: 'Anything else on your mind' },
];

export default function Feedback() {
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState('testimonial');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.Feedback.filter({ status: 'approved', category: 'testimonial' }, '-created_date', 6)
      .then(setTestimonials)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await base44.entities.Feedback.create({
        author_id: user?.id,
        author_name: user?.full_name || 'Anonymous',
        category,
        rating: category === 'testimonial' ? rating : undefined,
        content,
      });
      setSubmitted(true);
      setContent('');
      toast({ title: 'Thank you!', description: 'Your feedback has been received.' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Share Your Voice</h1>
              <p className="text-sm text-muted-foreground">Your feedback shapes our community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Approved Testimonials */}
        {testimonials.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Community Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= (t.rating || 5) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-3">"{t.content}"</p>
                  <p className="text-xs font-semibold text-muted-foreground">— {t.author_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Form */}
        {submitted ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Thank you!</h3>
            <p className="text-sm text-muted-foreground mb-4">Your feedback has been received and will be reviewed.</p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>Submit another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-5">
            {!user && (
              <p className="text-sm p-3 rounded-lg bg-muted text-muted-foreground">
                💡 <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link> to submit feedback, or continue as guest.
              </p>
            )}

            <div>
              <Label className="mb-2 block">What's this about?</Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      category === c.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="text-lg">{c.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{c.label}</p>
                      <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {category === 'testimonial' && (
              <div>
                <Label className="mb-2 block">How was your experience?</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)}>
                      <Star className={`w-7 h-7 transition-all ${s <= rating ? 'fill-accent text-accent' : 'text-muted-foreground/30 hover:text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="content" className="mb-2 block">Your message</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder={category === 'testimonial' ? 'Tell us about your experience with Circles of Giving...' : 'Describe your feedback in detail...'}
                className="resize-none"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 font-medium" disabled={loading || !content.trim()}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Send className="w-4 h-4 mr-2" />Submit Feedback</>}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}