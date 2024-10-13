import OpenAI from "openai";
import Stripe from "stripe";
import { config } from "../config/config.js";
import { translateRequest } from "../models/translate-request.js";
import { verifyApiToken } from "../utils/auth/auth.js";
import { getUser } from "../utils/db/user.db.js";
import { compareJSON, mergeJSON } from "../utils/json/compareJson.js";
import { countValueWords } from "../utils/json/count-value-words.js";

const stripe = new Stripe(config("STRIPE_KEY"));

const openai = new OpenAI({
  apiKey: config("OPENAI_KEY"),
  project: "proj_vcupWQG2q2cUO2C8Xk5neGdB",
});

export const translateApi = (fastify, _, done) => {
  fastify.post("/", async (request, reply) => {
    const tokenObject = await verifyApiToken(request.headers["api-token"]);
    const user = getUser(tokenObject.user);
    const subscription = (
      await stripe.subscriptions.list({
        customer: user.stripe_id,
        status: "active",
        limit: 10,
      })
    ).data[0];

    if (!subscription) {
      reply.type("application/json").code(402);
      return { error: "Subscription Required" };
    }

    try {
      translateRequest.parse(request.body);
    } catch (error) {
      reply.type("application/json").code(400);
      return { error: error.errors };
    }

    let { sourceLanguage, targetLanguage, sourceFile, targetFile } =
      request.body;

    let missingKeysAndValues;

    if (targetFile) {
      missingKeysAndValues = JSON.stringify(
        compareJSON(JSON.parse(sourceFile), JSON.parse(targetFile)),
      );
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `you're a translator and your mandate is to translate translation files for application from the defined source
                                  language into the defined target language. please only return the translation file without any additional message or phrasing. Don't return the response in a code block, but just in plain text. 
                                  source language: "${sourceLanguage}"
                                  target language: "${targetLanguage}"
                                  translation file: \`\`\`${missingKeysAndValues ?? sourceFile}\`\`\``,
          },
        ],
      });

      if (targetFile) {
        const targetJSON = JSON.parse(targetFile);
        const translatedJSON = JSON.parse(
          completion.choices[0].message.content,
        );

        targetFile = JSON.stringify(mergeJSON(targetJSON, translatedJSON));
      } else {
        targetFile = completion.choices[0].message.content;
      }

      const translatedWords = countValueWords(JSON.parse(sourceFile));

      await stripe.billing.meterEvents.create({
        event_name: "translated_words",
        payload: {
          value: translatedWords,
          stripe_customer_id: user.stripe_id,
        },
      });

      reply.type("application/json").code(200);
      return {
        translation: targetFile,
      };
    } catch (error) {
      reply.type("application/json").code(500);
      return { error: error.message };
    }
  });

  done();
};
