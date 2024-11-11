import { track } from "../utils/tracking/trackTelegram.js";

export const trackingApi = (fastify, _, done) => {
    fastify.post("/", async (request, reply) => {
        if (
            ["page_view", "new_user", "open_faq_question"].includes(
                request?.body?.event,
            )
        ) {
            const { event, data } = request.body;

            track(`Event: ${event}, Data: ${data}`);

            reply.type("application/json").code(200);
            return { success: true };
        }

        reply.type("application/json").code(400);
        return { error: "Invalid Event" };
    });

    done();
};
