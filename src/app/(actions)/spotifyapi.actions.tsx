"use server";

import {
  SpotifyPlaylist,
  SpotifyPlaylistsResponse,
  SpotifyTrack,
} from "./spotify.model";

let token = "";

const getAccessToken = async () => {
  if (!!token) {
    console.log("Token already exists");
    return token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authString = `${clientId}:${clientSecret}`;
  const authBase64 = Buffer.from(authString).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authBase64}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }

  const data = await response.json();

  token = data.access_token;

  return token;
};

export const getUserPlaylists = async (
  username: string
): Promise<SpotifyPlaylist[]> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/users/${username}/playlists`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user playlists");
  }

  const data = (await response.json()) as SpotifyPlaylistsResponse;
  return data.items;
};

export const getPlaylistTracks = async (
  playlistId: string
): Promise<SpotifyTrack[]> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist tracks");
  }

  // TODO: Only fetches max 100 tracks - need to handle pagination if want to mork for more

  const data = await response.json();
  const trackNames = data.items.map((item: any) => ({
    id: item.track.id,
    name: item.track.name,
    artists: item.track.artists.map((artist: any) => artist.name),
  }));

  return trackNames;
};
