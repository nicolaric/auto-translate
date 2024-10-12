import { executeQuery, executeTransaction } from "./db-connector.js";

export function insertSubscription(userId, stripePlanId, startDate) {
    return executeTransaction(
        `INSERT INTO subscription(
        user,
        stripe_plan_id,
        start_date ,
        used_quantity)
        VALUES (?, ?, ?, ?, ?)`,
        [userId, stripePlanId, startDate, 0],
    );
}

export function incrementUsedQuantity(subscriptionId) {
    return executeTransaction(
        `UPDATE subscription SET used_quantity = used_quantity + 1 WHERE id = ?`,
        [subscriptionId],
    );
}

export function getSubscription(subscriptionId) {
    return executeQuery("SELECT * FROM subscription WHERE id = ?", [
        subscriptionId,
    ]);
}

export function getSubscriptionFromUser(userId) {
    return executeQuery("SELECT * FROM subscription WHERE user = ?", [userId]);
}
