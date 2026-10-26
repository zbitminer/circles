import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useDebounce } from '@/hooks/useDebounce';

const publicProfile = p => ({ ...p, display_name: p.display_name || 'Community Member', user: { full_name: p.display_name || 'Community Member' }, bio: p.bio_visibility === 'private' ? '' : p.bio, location: p.location_visibility === 'private' ? '' : p.location });

export default function useMemberDiscovery({ search, cause, followingOnly }) {
  const client = useQueryClient();
  const term = useDebounce(search.trim());
  const session = useQuery({ queryKey: ['member-session'], queryFn: async () => {
    let user;
    try { user = await base44.auth.me(); }
    catch (error) { if ((error.status || error.response?.status) !== 401) throw error; return { user: null, profile: null }; }
    const mine = await base44.entities.VolunteerProfile.filter({ user_id: user.id });
    const profile = mine[0] || await base44.entities.VolunteerProfile.create({ user_id: user.id, display_name: user.full_name || 'Community Member', causes: [] });
    return { user, profile };
  } });
  const currentUser = session.data?.user;
  const currentProfile = session.data?.profile;
  const following = currentProfile?.following || [];
  const query = {};
  if (currentUser) query.user_id = { $ne: currentUser.id };
  if (followingOnly) query.user_id = { $in: following };
  if (cause && cause !== 'All') query.causes = cause;
  if (term) {
    const regex = { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    query.$or = [{ display_name: regex }, { causes: regex }, { $and: [{ bio_visibility: { $ne: 'private' } }, { bio: regex }] }, { $and: [{ location_visibility: { $ne: 'private' } }, { location: regex }] }];
  }
  const enabled = session.isSuccess;
  const members = useInfiniteQuery({ queryKey: ['member-discovery', query], enabled, initialPageParam: undefined,
    queryFn: ({ pageParam }) => base44.entities.VolunteerProfile.filter(query, { sort: '-created_date', limit: 24, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const count = useQuery({ queryKey: ['member-count', query], enabled, queryFn: () => base44.entities.VolunteerProfile.count(query) });
  const suggestions = useQuery({ queryKey: ['member-suggestions', currentUser?.id, currentProfile?.causes, following], enabled: enabled && !!currentProfile?.causes?.length,
    queryFn: () => base44.entities.VolunteerProfile.filter({ user_id: { $nin: [currentUser.id, ...following] }, causes: { $in: currentProfile.causes } }, { sort: '-created_date', limit: 4 }) });
  const logs = useQuery({ queryKey: ['member-activity', currentUser?.id], enabled: enabled && !!currentUser,
    queryFn: () => base44.entities.HourLog.list('-created_date', 50) });
  const follow = useMutation({ mutationFn: async target => {
    const response = await base44.functions.invoke('toggleFollow', { target_user_id: target });
    if (response.data?.error) throw new Error(response.data.error);
    return response.data;
  }, onSuccess: result => {
    client.setQueryData(['member-session'], old => ({ ...old, profile: { ...old.profile, following: result.following } }));
    ['member-discovery', 'member-count', 'member-suggestions'].forEach(key => client.invalidateQueries({ queryKey: [key] }));
  } });
  return { currentUser, currentProfile, following, profiles: (members.data?.pages || []).flatMap(p => p.items).map(publicProfile), suggested: (suggestions.data?.items || []).map(publicProfile), hourLogs: logs.data || [],
    loading: session.isPending || (enabled && members.isPending), error: session.error || members.error || count.error,
    total: count.data, hasMore: members.hasNextPage, loadingMore: members.isFetchingNextPage, loadMore: members.fetchNextPage,
    retry: () => { session.refetch(); members.refetch(); count.refetch(); },
    handleFollow: target => currentUser ? follow.mutate(target) : base44.auth.redirectToLogin(window.location.href), followBusy: follow.isPending, followError: follow.error };
}