import Stripe from "stripe";
import { config } from "../config/config.js";
import { verifyInternalToken } from "../utils/auth/auth.js";
import { updateUserStripeId } from "../utils/db/user.db.js";
import { track } from "../utils/tracking/trackTelegram.js";
import {
    getFreeTierSubscription,
    insertFreeTierSubscription,
    updateFreeTierSubscriptionActive,
} from "../utils/db/free-tier-subscription.db.js";

const stripe = new Stripe(config("STRIPE_KEY"));

export const paymentApi = (fastify, _, done) => {
    fastify.get("/prepare", async (request, reply) => {
        const user = await verifyInternalToken(request.headers.authorization);
        if (!user) {
            reply.type("application/json").code(401);
            return { error: "Unauthorized" };
        }

        if (!user.stripe_id) {
            const customer = await stripe.customers.create({
                email: user.email,
            });

            user.stripe_id = customer.id;
            await updateUserStripeId(user.id, customer.id);
            track(`New Stripe Customer: ${user.email}`);
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer: user.stripe_id,
            line_items: [
                {
                    price: config("STRIPE_PRICE"),
                },
            ],
            success_url: config("STRIPE_SUCCESS_URL"),
            cancel_url: config("STRIPE_CANCEL_URL"),
        });

        reply.type("application/json").code(200);
        return { url: session.url };
    });

    fastify.get("/status", async (request, reply) => {
        const user = await verifyInternalToken(request.headers.authorization);
        if (!user) {
            reply.type("application/json").code(401);
            return { error: "Unauthorized" };
        }

        const freeTier = getFreeTierSubscription(user);
        const freeTierActive = freeTier && freeTier.active;

        if (!user.stripe_id) {
            const customer = await stripe.customers.create({
                email: user.email,
            });

            user.stripe_id = customer.id;
            await updateUserStripeId(user.id, customer.id);
        }

        const subscription = await stripe.subscriptions.list({
            customer: user.stripe_id,
            status: "active",
            limit: 1,
        });

        if (subscription.data.length > 0 && freeTierActive) {
            updateFreeTierSubscriptionActive(user, false);
        }

        if (subscription.data.length > 0) {
            reply.type("application/json").code(200);
            return subscription;
        }

        if (freeTierActive) {
            const usage = freeTier.usage;
            reply.type("application/json").code(200);
            return { freeTier: true, usage };
        }

        reply.type("application/json").code(200);
        return {};
    });

    fastify.get("/usage-link", async (request, reply) => {
        const user = await verifyInternalToken(request.headers.authorization);
        if (!user || !user.stripe_id) {
            reply.type("application/json").code(401);
            return { error: "Unauthorized" };
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripe_id,
            return_url: config("STRIPE_RETURN_URL"),
        });

        reply.type("application/json").code(200);
        return { url: session.url };
    });

    fastify.post("/free-tier", async (request, reply) => {
        const user = await verifyInternalToken(request.headers.authorization);
        if (!user) {
            reply.type("application/json").code(401);
            return { error: "Unauthorized" };
        }

        const subscription = await stripe.subscriptions.list({
            customer: user.stripe_id,
            status: "active",
            limit: 1,
        });

        if (subscription.data.length > 0) {
            reply.type("application/json").code(400);
            return { error: "User already has an active paid subscription" };
        }

        insertFreeTierSubscription(user);
        track(`Free Tier Subscription: ${user.email}`);

        reply.type("application/json").code(200);
        return { success: true };
    });

    done();
};
