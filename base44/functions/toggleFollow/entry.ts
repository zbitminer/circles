import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { target_user_id } = body;
    if (!target_user_id) return Response.json({ error: 'target_user_id is required' }, { status: 400 });

    // Find current user's profile
    const myProfiles = await base44.asServiceRole.entities.VolunteerProfile.filter({ user_id: user.id });
    const myProfile = myProfiles[0];
    if (!myProfile) return Response.json({ error: 'Your profile not found' }, { status: 404 });

    // Find target user's profile
    const targetProfiles = await base44.asServiceRole.entities.VolunteerProfile.filter({ user_id: target_user_id });
    const targetProfile = targetProfiles[0];

    const isFollowing = (myProfile.following || []).includes(target_user_id);

    // Update my following list
    const newFollowing = isFollowing
      ? (myProfile.following || []).filter(id => id !== target_user_id)
      : [...(myProfile.following || []), target_user_id];

    await base44.asServiceRole.entities.VolunteerProfile.update(myProfile.id, { following: newFollowing });

    // Update target's followers list (requires service role — RLS prevents updating others' profiles)
    let newFollowers = [];
    if (targetProfile) {
      newFollowers = isFollowing
        ? (targetProfile.followers || []).filter(id => id !== user.id)
        : [...(targetProfile.followers || []), user.id];
      await base44.asServiceRole.entities.VolunteerProfile.update(targetProfile.id, { followers: newFollowers });
    }

    return Response.json({
      following: newFollowing,
      followers: newFollowers,
      is_following: !isFollowing
    });
  } catch (error) {
    console.error('toggleFollow error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});