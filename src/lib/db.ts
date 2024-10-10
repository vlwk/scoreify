import postgres from "postgres";

export const sql = postgres("postgres://postgres:Cbvf4dEkSNuiG0b@zephyr-dev-db.fly.dev:5432/lohvicto", {
  ssl: "allow",
});

export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
}