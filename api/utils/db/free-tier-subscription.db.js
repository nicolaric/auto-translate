import { executeQuery, executeTransaction } from "./db-connector.js";

export function insertFreeTierSubscription(user) {
    return executeTransaction(
        "INSERT INTO free_tier_subscription (user, active, created_at, usage) VALUES (?, ?, ?, ?)",
        [user.id, true, new Date().toISOString(), 0],
    );
}

export function getFreeTierSubscription(user) {
    return executeQuery("SELECT * FROM free_tier_subscription WHERE user = ?", [
        user.id,
    ]);
}

export function updateFreeTierSubscriptionUsage(user, usage) {
    return executeTransaction(
        "UPDATE free_tier_subscription SET usage = ? WHERE user = ?",
        [usage, user.id],
    );
}

export function updateFreeTierSubscriptionActive(user, active) {
    return executeTransaction(
        "UPDATE free_tier_subscription SET active = ? WHERE user = ?",
        [active, user.id],
    );
}

export function deleteFreeTierSubscription(user) {
    return executeTransaction(
        "DELETE FROM free_tier_subscription WHERE user = ?",
        [user.id],
    );
}
