import { config } from "dotenv";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

console.log("aaa", config("TELEGRAM_API_ID"));

const telegramClient = new TelegramClient(
    new StringSession(""),
    config("TELEGRAM_API_ID"),
    config("TELEGRAM_API_HASH"),
);

export const trackingApi = (fastify, _, done) => {
    fastify.post("/", async (request, reply) => {
        if (
            ["page_view", "new_user", "open_faq_question"].includes(
                request?.body?.event,
            )
        ) {
            const { event, data } = request.body;

            await telegramClient.start();

            telegramClient.sendMessage("me", `Event: ${event}\nData: ${data}`);

            reply.type("application/json").code(200);
            return { success: true };
        }

        reply.type("application/json").code(400);
        return { error: "Invalid Event" };
    });

    done();
};
