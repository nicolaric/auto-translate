import {
    executeQuery,
    executeQueryAll,
    executeTransaction,
} from "./db-connector.js";

export function insertToken(userId, name, keyHash) {
    return executeTransaction(
        `INSERT INTO api_token(
        user,
        name,
        key_hash,
        created_at)
        VALUES (?, ?, ?, ?)`,
        [userId, name, keyHash, new Date().toISOString()],
    );
}

export function getTokenByHashedToken(keyHash) {
    return executeQuery("SELECT * FROM api_token WHERE key_hash = ?", [keyHash]);
}

export function getTokens(userId) {
    return executeQueryAll("SELECT * FROM api_token WHERE user = ?", [userId]);
}
