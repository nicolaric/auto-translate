import Stripe from "stripe";
import { config } from "../config/config.js";
import { getUser, updateUserStripeId } from "../utils/db/user.db.js";
import { verifyInternalToken } from "../utils/auth/auth.js";

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
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer: user.stripe_id,
            line_items: [
                {
                    price: "price_1Q2b1lGhN3Kqa0Kd3o5vDSZf",
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:3001/payment-callback.html",
            cancel_url: "https://example.com/cancel",
        });

        console.log(session);
        reply.type("application/json").code(200);
        return { url: session.url };
    });

    fastify.get("/status", async (request, reply) => {
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
        reply.type("application/json").code(200);
        return subscription;
    });

    done();
};
