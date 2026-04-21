import db from '../dbConnection/db.js';

let ensureResetColumnsPromise;

const RESET_COLUMNS = {
  resetToken: 'ALTER TABLE users ADD COLUMN resetToken VARCHAR(64) NULL',
  resetTokenExpiry: 'ALTER TABLE users ADD COLUMN resetTokenExpiry BIGINT NULL',
};

const loadExistingResetColumns = async () => {
  const [rows] = await db.execute(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = 'users'
       AND COLUMN_NAME IN ('resetToken', 'resetTokenExpiry')`,
    [process.env.DB_NAME]
  );

  return new Set(rows.map(({ COLUMN_NAME }) => COLUMN_NAME));
};

export const ensureResetColumns = async () => {
  if (ensureResetColumnsPromise) {
    return ensureResetColumnsPromise;
  }

  ensureResetColumnsPromise = (async () => {
    const existingColumns = await loadExistingResetColumns();

    for (const [columnName, alterStatement] of Object.entries(RESET_COLUMNS)) {
      if (!existingColumns.has(columnName)) {
        await db.execute(alterStatement);
      }
    }
  })();

  try {
    await ensureResetColumnsPromise;
  } catch (error) {
    ensureResetColumnsPromise = undefined;
    throw error;
  }
};
