import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { post_id } = await req.json();
    if (!post_id) return Response.json({ error: 'post_id is required' }, { status: 400 });

    let post;
    try {
      post = await base44.asServiceRole.entities.Post.get(post_id);
    } catch {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    if (!post) return Response.json({ error: 'Post not found' }, { status: 404 });

    const likes = post.likes || [];
    const hasLiked = likes.includes(user.id);
    const newLikes = hasLiked
      ? likes.filter((id) => id !== user.id)
      : [...likes, user.id];

    await base44.asServiceRole.entities.Post.update(post_id, { likes: newLikes });

    return Response.json({ likes: newLikes, liked: !hasLiked });
  } catch (error) {
    console.error('togglePostLike error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});