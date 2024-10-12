import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("db.sqlite");
db.exec(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        stripe_id TEXT 
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS api_token (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user INTEGER NOT NULL,
        name TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        created_at DATE NOT NULL,
        last_used_at DATE,
        FOREIGN KEY(user) REFERENCES user(id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS subscription (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user INTEGER NOT NULL,
        stripe_plan_id TEXT,
        start_date DATE NOT NULL,
        end_date DATE,
        used_quantity INTEGER NOT NULL,
        FOREIGN KEY(user) REFERENCES user(id)
);
`);

export function executeQuery(query, values) {
    return db.prepare(query).get(...values);
}

export function executeQueryAll(query, values) {
    return db.prepare(query).all(...values);
}

export function executeTransaction(query, values) {
    return db.prepare(query).run(...values);
}
