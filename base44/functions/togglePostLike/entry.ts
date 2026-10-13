import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Atomic array add/remove using MongoDB-style operators via updateMany.
// If the operator form isn't supported, fall back to read-modify-write and verify the
// result, retrying a few times so concurrent writers don't silently drop changes.
function applyOp(arr, op, value) {
  if (op === '$push') return [...arr, value];
  if (op === '$addToSet') return arr.includes(value) ? arr : [...arr, value];
  return arr.filter((v) => v !== value);
}

function opApplied(arr, op, value) {
  if (op === '$pull') return !arr.includes(value);
  if (op === '$push') return arr.some((v) => JSON.stringify(v) === JSON.stringify(value));
  return arr.includes(value);
}

async function arrayOp(store, id, field, op, value) {
  try {
    await store.updateMany({ id }, { [op]: { [field]: value } });
    const fresh = await store.get(id);
    const arr = Array.isArray(fresh?.[field]) ? fresh[field] : [];
    if (opApplied(arr, op, value)) return arr;
  } catch (err) {
    console.warn(`updateMany ${op} unsupported, using verified fallback:`, err?.message);
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const rec = await store.get(id);
    const arr = Array.isArray(rec?.[field]) ? rec[field] : [];
    if (op !== '$push' && opApplied(arr, op, value)) return arr;
    await store.update(id, { [field]: applyOp(arr, op, value) });
    const check = await store.get(id);
    const after = Array.isArray(check?.[field]) ? check[field] : [];
    if (opApplied(after, op, value)) return after;
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
  }
  throw new Error(`Could not apply ${op} on ${field}`);
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
