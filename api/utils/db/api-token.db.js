import {
    executeQuery,
    executeQueryAll,
    executeTransaction,
} from "./db-connector.js";

export async function insertToken(userId, name, keyHash) {
    const insert = executeTransaction(
        `INSERT INTO api_token(
        user,
        name,
        key_hash,
        created_at)
        VALUES (?, ?, ?, ?)`,
        [userId, name, keyHash, new Date().toISOString()],
    );

    return getToken(insert.lastInsertRowid);
}

export function getTokenByHashedToken(keyHash) {
    return executeQuery(
        "SELECT id, name, user FROM api_token WHERE key_hash = ?",
        [keyHash],
    );
}

export function getTokens(userId) {
    return executeQueryAll(
        "SELECT id, name, created_at, last_used_at FROM api_token WHERE user = ?",
        [userId],
    );
}

export function getToken(id) {
    return executeQuery(
        "SELECT id, name, created_at, last_used_at FROM api_token WHERE id = ?",
        [id],
    );
}

export function updateTokenLastUsed(id) {
    return executeTransaction(
        "UPDATE api_token SET last_used_at = ? WHERE id = ?",
        [new Date().toISOString(), id],
    );
}

export function deleteToken(id) {
    return executeTransaction("DELETE FROM api_token WHERE id = ?", [id]);
}
