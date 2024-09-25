import Fastify from "fastify";
import OpenAI from "openai";
import { translateRequest } from "./models/translate-request.js";
import { compareJSON, mergeJSON } from "./utils/compareJson/compareJson.js";

const fastify = Fastify({
    logger: true,
});

const openai = new OpenAI({
    apiKey:
        "sk-svcacct-TSSq5wn9lFUxUtGP07UF-29JClno_-sxGH7FMyuHp3vz2AZ5NsUzcbYjq5Vx3Gn6_lVT3BlbkFJr2qOBAFf-uYgvjYTybgqFjyW7jJfM3ki6zNc5YtOsfKJQICJ20THZmbwBEebpgbIeDwA",
    project: "proj_vcupWQG2q2cUO2C8Xk5neGdB",
});

fastify.get("/", async (request, reply) => {
    reply.type("application/json").code(200);
    return { hello: "world" };
});

fastify.post("/translate", async (request, reply) => {
    try {
        translateRequest.parse(request.body);
    } catch (error) {
        reply.type("application/json").code(400);
        return { error: error.errors };
    }

    let { sourceLanguage, targetLanguage, sourceFile, targetFile } = request.body;

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
                    content: `you're a translator and your mandate is to translate translation files for application from the defined sourc                           language into the defined target language. please only return the translation file without any additional message or phrasing. Don't return the response in a code block, but just in plain text. 
                          source language: "${sourceLanguage}"
                          target language: "${targetLanguage}"
                          translation file: \`\`\`${missingKeysAndValues ?? sourceFile}\`\`\``,
                },
            ],
        });

        if (targetFile) {
            const targetJSON = JSON.parse(targetFile);
            const translatedJSON = JSON.parse(completion.choices[0].message.content);

            targetFile = JSON.stringify(mergeJSON(targetJSON, translatedJSON));
        } else {
            targetFile = completion.choices[0].message.content;
        }

        reply.type("application/json").code(200);
        return {
            translation: targetFile,
        };
    } catch (error) {
        reply.type("application/json").code(500);
        return { error: error.message };
    }
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    // Server is now listening on ${address}
});
