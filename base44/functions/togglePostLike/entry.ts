import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Atomic array add/remove using MongoDB-style operators via updateMany.
// Falls back to read-modify-write if the operator form is not supported.
async function arrayOp(store, id, field, op, value) {
  try {
    await store.updateMany({ id }, { [op]: { [field]: value } });
  } catch (err) {
    console.warn(`updateMany ${op} failed, falling back:`, err?.message);
    const rec = await store.get(id);
    const arr = Array.isArray(rec?.[field]) ? rec[field] : [];
    const next = op === '$addToSet' ? (arr.includes(value) ? arr : [...arr, value]) : arr.filter((v) => v !== value);
    await store.update(id, { [field]: next });
  }
  const fresh = await store.get(id);
  return Array.isArray(fresh?.[field]) ? fresh[field] : [];
}

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
    if (!post || (post.status && post.status !== 'active')) return Response.json({ error: 'Post not found' }, { status: 404 });

    const hasLiked = (post.likes || []).includes(user.id);
    const likes = await arrayOp(store, post_id, 'likes', hasLiked ? '$pull' : '$addToSet', user.id);

    return Response.json({ likes, liked: likes.includes(user.id) });
  } catch (error) {
    console.error('togglePostLike error:', error);
    return Response.json({ error: 'Could not update like.' }, { status: 500 });
  }
});
