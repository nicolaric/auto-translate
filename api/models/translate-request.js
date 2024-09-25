import { z } from "zod";

export const translateRequest = z.object({
    sourceLanguage: z.string(),
    targetLanguage: z.string(),
    sourceFile: z.string(),
    targetFile: z.string().optional(),
});
