import fastify from "fastify";
import { translateApi } from "./translate/translate.api.js";
import { paymentApi } from "./payment/payment.api.js";
import { userApi } from "./user/user.api.js";
import { trackingApi } from "./tracking/tracking.api.js";
import { track } from "./utils/tracking/trackTelegram.js";

export const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(userApi, { prefix: "/api/user" });
  app.register(paymentApi, { prefix: "/api/payment" });
  app.register(translateApi, { prefix: "/api/translate" });
  app.register(trackingApi, { prefix: "/api/tracking" });

  app.addHook("onError", (req, reply, err) => {
    console.error(err.stack);
    track(`Error: ${err.message}`);
  });

  return app;
};
