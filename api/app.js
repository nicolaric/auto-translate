import fastify from "fastify";
import { translateApi } from "./translate/translate.api.js";
import { paymentApi } from "./payment/payment.api.js";
import { userApi } from "./user/user.api.js";

export const build = (opts = {}) => {
    const app = fastify(opts);

    app.register(userApi, { prefix: "/api/user" });
    app.register(paymentApi, { prefix: "/api/payment" });
    app.register(translateApi, { prefix: "/api/translate" });

    return app;
};
