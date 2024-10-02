import { executeQuery, executeTransaction } from "./db-connector.js";

export function insertToken(userId, name, keyHash) {
    return executeTransaction(
        `INSERT INTO api_token(
        user,
        name,
        key_hash,
        created_at)
        VALUES (?, ?, ?, ?)`,
        [userId, name, keyHash, new Date()],
    );
}

export function getTokenByHashedToken(keyHash) {
    return executeQuery("SELECT * FROM api_token WHERE key_hash = ?", keyHash);
}
