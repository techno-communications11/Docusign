import db from '../dbConnection/db.js';

export async function findUserWithRolesByEmail(email) {
  const [rows] = await db.execute(
    `SELECT
      u.id,
      u.email,
      u.password,
      u.is_active,
      r.id AS role_id,
      r.name AS role_name,
      r.portal AS role_portal
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE u.email = ?`,
    [email]
  );

  if (rows.length === 0) {
    return null;
  }

  const [firstRow] = rows;
  const roles = rows
    .filter((row) => row.role_name)
    .map((row) => ({
      id: row.role_id,
      name: row.role_name,
      portal: row.role_portal,
    }));

  return {
    id: firstRow.id,
    email: firstRow.email,
    password: firstRow.password,
    is_active: firstRow.is_active,
    role: roles[0]?.name ?? null,
    roles,
  };
}
