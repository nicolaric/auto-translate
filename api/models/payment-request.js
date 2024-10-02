import { z } from "zod";

export const paymentPrepareRequest = z.object({
    email: z.string(),
});
