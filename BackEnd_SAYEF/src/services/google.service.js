import { OAuth2Client } from "google-auth-library";
import UserService from "./user.service.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    email_verified: payload.email_verified
  };
}
