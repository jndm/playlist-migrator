"use server";
import { redirect } from "next/navigation";
import { oauth2Client, scopes } from "../utils/google-auth";
import crypto from "crypto";

export const startGoogleLogin = async () => {
  // Generate a secure random state value.
  const state = crypto.randomBytes(32).toString("hex");

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: scopes,
    include_granted_scopes: true,
    state,
  });

  // Redirect to the authorization URL.
  redirect(authorizationUrl);
};
