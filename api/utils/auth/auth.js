import { OAuth2Client } from "google-auth-library";
import { config } from "../../config/config.js";
import jwt from "jsonwebtoken";
import { getUser } from "../db/user.db.js";
import { getTokenByHashedToken } from "../db/api-token.db.js";

const client = new OAuth2Client();

export async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config("GOOGLE_CLIENT_ID"),
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function verifyInternalToken(token) {
    if (!token) return false;
    token = token.replace("Bearer ", "");

    return jwt.verify(token, config("JWT_SIGNING_KEY"), (err, decoded) => {
        if (err) {
            return false;
        }
        const user = getUser(decoded.id);
        if (!user) {
            return false;
        }
        return user;
    });
}

export async function verifyApiToken(token) {
    const hashedToken = createHash("SHA256").update(token).digest("hex");

    const dbTokens = getTokenByHashedToken(hashedToken);

    if (!dbTokens.length) return false;

    return dbTokens[0];
}
