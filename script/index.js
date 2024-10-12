#! /usr/bin/env node

import fs from "fs";
import { Command } from "commander";

const commander = new Command();
let apiToken;

function checkApiTokenAvailability() {
    apiToken = process.env.AUTO_TRANSLATE_API_KEY;
    if (!apiToken) {
        console.error(
            "API token not found. Please set the AUTO_TRANSLATE_API_TOKEN environment variable.",
        );
        process.exit(1);
    }
}

function getOptions() {
    commander
        .version("0.0.1", "-v, --version")
        .usage("[options]...")
        .option("-sf, --source-file <sourceFile>", "Source file to translate")
        .option(
            "-tf, --target-file <targetFile>",
            "Target file to save the translation",
        )
        .option("-sl, --source-language <sourceLanguage>", "Source language")
        .option("-tl, --target-language <targetLanguage>", "Target language")
        .parse(process.argv);

    return commander.opts();
}

function checkArgsValidity(args) {
    if (
        !args.sourceFile ||
        !args.targetFile ||
        !args.sourceLanguage ||
        !args.targetLanguage
    ) {
        console.error("Missing required options.");
        commander.outputHelp();
        process.exit(1);
    }
}

async function translateFile(options) {
    if (!fs.existsSync(options.sourceFile)) {
        console.error("Source file not found.");
        process.exit(1);
    }

    const sourceFileContent = fs.readFileSync(options.sourceFile, "utf8");

    let targetFileContent;
    if (fs.existsSync(options.targetFile)) {
        targetFileContent = fs.readFileSync(options.targetFile, "utf8");
    }

    console.log("Sending translation request...");

    const translateReq = await fetch("http://localhost:3000/api/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-token": apiToken,
        },
        body: JSON.stringify({
            sourceLanguage: options.sourceLanguage,
            targetLanguage: options.targetLanguage,
            sourceFile: sourceFileContent,
            targetFile: targetFileContent,
        }),
    });

    console.log("Processing translation response...");

    const translateRes = await translateReq.json();

    if (translateRes.error) {
        console.error(translateRes.error);
        process.exit(1);
    }

    console.log("Writing translation to target file...");

    fs.writeFileSync(options.targetFile, translateRes.translation);

    console.log("Translation completed successfully.");
}

const options = getOptions();
checkApiTokenAvailability();
checkArgsValidity(options);
translateFile(options);
