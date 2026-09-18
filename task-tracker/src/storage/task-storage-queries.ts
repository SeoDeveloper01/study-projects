const CREATE_TABLE = `
	CREATE TABLE IF NOT EXISTS task (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		description TEXT NOT NULL,
		status INTEGER CHECK (status IN (0, 1, 2)) DEFAULT 0,
		createdAt INTEGER NOT NULL,
		updatedAt INTEGER NOT NULL
	) STRICT
`;

const SELECT_ALL = `
	SELECT *
	FROM task
`;

const SELECT = `
	SELECT *
	FROM task
	WHERE status = $status
`;

const INSERT = `
	INSERT INTO task (
		description,
		status,
		createdAt,
		updatedAt
	) VALUES (
		$description,
		$status,
		$createdAt,
		$updatedAt
	) RETURNING *
`;

const UPDATE_DESCRIPTION = `
	UPDATE task
	SET description = $description, updatedAt = $updatedAt
	WHERE id = $id
`;

const UPDATE_STATUS = `
	UPDATE task
	SET status = $status, updatedAt = $updatedAt
	WHERE id = $id
`;

const DELETE = `
	DELETE FROM task
	WHERE id = $id
`;

export default { CREATE_TABLE, SELECT_ALL, SELECT, INSERT, UPDATE_DESCRIPTION, UPDATE_STATUS, DELETE } as const;
