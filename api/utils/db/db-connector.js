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
    CREATE TABLE IF NOT EXISTS api_key (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user INTEGER NOT NULL,
        key TEXT NOT NULL,
        created_at DATE NOT NULL,
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

export function executeTransaction(query, values) {
    return db.prepare(query).run(...values);
}
