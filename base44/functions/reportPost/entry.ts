import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Any logged-in user can report a post once. The reporter id is taken from the session,
// never from the request. The post is flagged for moderator review.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { post_id } = await req.json().catch(() => ({}));
    if (typeof post_id !== 'string' || !post_id) return Response.json({ error: 'post_id is required' }, { status: 400 });

    const store = base44.asServiceRole.entities.Post;
    let post = null;
    try { post = await store.get(post_id); } catch { post = null; }
    if (!post || post.status === 'removed') return Response.json({ error: 'Post not found' }, { status: 404 });
    if (post.created_by_id === user.id || post.author_id === user.id) {
      return Response.json({ error: 'You cannot report your own post.' }, { status: 400 });
    }

    const reported = Array.isArray(post.reported_by) ? post.reported_by : [];
    if (reported.includes(user.id)) return Response.json({ ok: true, already_reported: true });

    // Retry a few times so concurrent reports aren't lost (read-modify-write with verification).
    for (let attempt = 0; attempt < 3; attempt++) {
      const fresh = await store.get(post_id);
      const list = Array.isArray(fresh.reported_by) ? fresh.reported_by : [];
      if (list.includes(user.id)) break;
      await store.update(post_id, { reported_by: [...list, user.id], status: fresh.status === 'removed' ? 'removed' : 'flagged' });
      const check = await store.get(post_id);
      if ((check.reported_by || []).includes(user.id)) break;
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('reportPost error:', error);
    return Response.json({ error: 'Could not report post.' }, { status: 500 });
  }
});
