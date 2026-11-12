import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Any logged-in user can report a post once. The reporter id is taken from the session,
// never from the request. The post is flagged for moderator review.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { post_id } = await req.json().catch(() => ({}));
    if (typeof post_id !== 'string' || !post_id) return Response.json({ error: 'post_id is required' }, { status: 400 });

    const store = base44.asServiceRole.entities.Post;
    const post = await store.get(post_id).catch(e => e.status === 404 ? null : Promise.reject(e));
    if (!post || post.status === 'removed') return Response.json({ error: 'Post not found' }, { status: 404 });
    if (post.created_by_id === user.id || post.author_id === user.id) {
      return Response.json({ error: 'You cannot report your own post.' }, { status: 400 });
    }

    const reported = Array.isArray(post.reported_by) ? post.reported_by : [];
    if (reported.includes(user.id)) return Response.json({ ok: true, already_reported: true });

    // Atomically append this reporter without overwriting simultaneous reports.
    // Never re-flag a post that a moderator has already removed.
    await store.updateMany(
      { id: post_id, status: { $ne: 'removed' } },
      { $addToSet: { reported_by: user.id }, $set: { status: 'flagged' } }
    );
    const saved = await store.get(post_id);
    if (saved.status === 'removed') return Response.json({ error: 'Post not found' }, { status: 404 });
    if (!saved.reported_by?.includes(user.id)) return Response.json({ error: 'Could not save your report. Please try again.' }, { status: 500 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('reportPost error:', error);
    return Response.json({ error: 'Could not report post.' }, { status: 500 });
  }
}