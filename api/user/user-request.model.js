import { z } from "zod";

export const createTokenSchema = z.object({
    name: z.string(),
});
