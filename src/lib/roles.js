export function normalizeUserRole(user) {
  return String(user?.role || user?._app_role || '').trim().toLowerCase();
}

export function isStaffUser(user) {
  const role = normalizeUserRole(user);
  return role === 'admin' || role === 'moderator';
}