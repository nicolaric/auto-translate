import { executeQuery, executeTransaction } from "./db-connector.js";

export function insertUser(email) {
    return executeTransaction("INSERT INTO user (email) VALUES (?)", [email]);
}

export function getUser(id) {
    return executeQuery("SELECT * FROM user WHERE id = ?", [id]);
}

export function getUserByEmail(email) {
    return executeQuery("SELECT * FROM user WHERE email = ?", [email]);
}

export function updateUserStripeId(id, stripeId) {
    return executeTransaction("UPDATE user SET stripe_id = ? WHERE id = ?", [
        stripeId,
        id,
    ]);
}
