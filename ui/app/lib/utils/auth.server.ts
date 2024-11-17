import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { getSession } from "../sessions/sessions";

export async function requireUserSession(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));

    // validate the session, `userId` is just an example, use whatever value you
    // put in the session when the user authenticated
    if (!session.has("token")) {
        throw redirect("/");
    }

    return session;
}
