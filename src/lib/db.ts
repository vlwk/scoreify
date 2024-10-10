import postgres from "postgres";

const connectionString = process.env.POSTGRES_SQL;

if (!connectionString) {
  throw new Error("Missing PostgreSQL connection string in environment variables.");
}

export const sql = postgres(connectionString, {
  ssl: "allow",
});

export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
}