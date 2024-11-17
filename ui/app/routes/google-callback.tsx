import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getTokenFromCode } from "~/lib/oauth-providers/google";
import { commitSession, getSession } from "~/lib/sessions/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");

    if (!code) {
        return redirect("/");
    }

    const idToken = await getTokenFromCode(code);

    const authReq = await fetch(
        "https://auto-translate.com/api/user/authenticate",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: idToken,
            },
        }
    );
    const data = await authReq.json();

    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", data.token);

    return redirect("/account", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

// This component should never get rendered, so it can be anything
export default function GoogleCallback() {
    return (
        <div>
            <h1>GoogleCallback</h1>
        </div>
    );
}
