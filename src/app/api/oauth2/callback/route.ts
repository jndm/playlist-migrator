"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { oauth2Client } from "@/app/utils/google-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  // TODO: Should handle error better
  const error = searchParams.get("error");
  if (error) {
    return NextResponse.json("Error: " + error);
  }

  if (!code) {
    return NextResponse.json("Error: No code provided");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    const idtoken = tokens.id_token;
    if (!idtoken) {
      return NextResponse.json("Error: No ID token provided");
    }

    const cookiesStore = await cookies();
    cookiesStore.set("access_token", tokens.access_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: tokens.expiry_date
        ? (tokens.expiry_date - Date.now()) / 1000
        : 60 * 60 * 24 * 7,
    });

    cookiesStore.set("id_token", tokens.id_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: tokens.expiry_date
        ? (tokens.expiry_date - Date.now()) / 1000
        : 60 * 60 * 24 * 7,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return NextResponse.redirect(new URL("/playlists", baseUrl));
  } catch (err) {
    console.error(err);
    return NextResponse.json("Something went wrong");
  }
}
