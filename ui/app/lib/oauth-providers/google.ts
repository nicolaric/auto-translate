import { OAuth2Client } from "google-auth-library";

// Make sure the environment variables are set
if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI
) {
    throw new Error(
        "Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI"
    );
}

const oauthClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const generateAuthUrl = (state: string) => {
    return oauthClient.generateAuthUrl({
        access_type: "online",
        scope: ["https://www.googleapis.com/auth/userinfo.email"],
        state,
    });
};

export const getTokenFromCode = async (code: string) => {
    const { tokens } = await oauthClient.getToken(code);
    if (!tokens.id_token) {
        throw new Error("Something went wrong. Please try again.");
    }

    return tokens.id_token;
};
