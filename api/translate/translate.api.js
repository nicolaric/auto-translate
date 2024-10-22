import OpenAI from "openai";
import Stripe from "stripe";
import { config } from "../config/config.js";
import { translateRequest } from "../models/translate-request.js";
import { verifyApiToken } from "../utils/auth/auth.js";
import { getUser } from "../utils/db/user.db.js";
import { compareJSON, mergeJSON } from "../utils/json/compareJson.js";
import { countValueWords } from "../utils/json/count-value-words.js";
import { chunkJson } from "../utils/json/chunk-json.js";

const stripe = new Stripe(config("STRIPE_KEY"));

const openai = new OpenAI({
  apiKey: config("OPENAI_KEY"),
  project: "proj_vcupWQG2q2cUO2C8Xk5neGdB",
});

export const translateApi = (fastify, _, done) => {
  fastify.get("/test", async (request, reply) => {
    function wait(ms) {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error("timeout succeeded")), ms);
      });
    }

    await wait(1000 * 60 * 5);
    reply.type("application/json").code(200);
    reply.send({ message: "Hello World" });
  });

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

    const chunkedSources = chunkJson(missingKeysAndValues ?? sourceFile, 2000);
    console.log(chunkedSources);

    const completions = [];

    // Create an array of promises for all the chunks
    const translationPromises = chunkedSources.map((chunkedSource) =>
      translateChunk(chunkedSource, sourceLanguage, targetLanguage, openai),
    );

    // Execute all promises in parallel
    const results = await Promise.all(translationPromises);

    // Process the results (can also handle errors if needed)
    results.forEach((result) => {
      if (result.error) {
        console.error(`Error processing chunk: ${result.error}`);
      } else {
        completions.push(result);
      }
    });

    if (targetFile) {
      const targetJSON = JSON.parse(targetFile);
      const translatedJSON = Object.assign({}, ...completions);

      targetFile = JSON.stringify(mergeJSON(targetJSON, translatedJSON));
    } else {
      targetFile = JSON.stringify(Object.assign({}, ...completions));
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
  });

  done();
};

// Function to handle the translation for a single chunk
async function translateChunk(
  chunkedSource,
  sourceLanguage,
  targetLanguage,
  openai,
) {
  try {
    const openAiAnswer = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `you're a translator and your mandate is to translate translation files for application from the defined source
                    language into the defined target language. please only return the translation file without any additional message or phrasing. 
                    Don't return the response in a code block, but just in plain text. 
                    source language: "${sourceLanguage}"
                    target language: "${targetLanguage}"
                    translation file: \`\`\`${chunkedSource}\`\`\``,
        },
      ],
    });

    console.log(chunkedSource);
    console.log(openAiAnswer.choices[0].message.content);

    return JSON.parse(openAiAnswer.choices[0].message.content);
  } catch (error) {
    return { error: error.message };
  }
}
