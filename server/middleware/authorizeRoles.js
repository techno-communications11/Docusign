export function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user?.roles)
      ? req.user.roles.map((role) => role.name ?? role).filter(Boolean)
      : req.user?.role
        ? [req.user.role]
        : [];

    const isAllowed = allowedRoles.some((role) => userRoles.includes(role));

    if (!isAllowed) {
      return res.status(403).json({ error: 'You do not have permission to access this resource.' });
    }

    next();
  };
}
