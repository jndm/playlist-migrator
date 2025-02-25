"use server";
import { oauth2Client } from "../utils/google-auth";
import { cookies } from "next/headers";
import { google } from "googleapis";

export const getUserYoutubePlaylists = async (): Promise<
  YoutubePlaylistItem[]
> => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token");

  if (!accessToken) {
    throw new Error("Access token not found in cookies");
  }

  oauth2Client.setCredentials({ access_token: accessToken.value });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    const response = await youtube.playlists.list({
      part: ["snippet", "contentDetails"],
      mine: true, // Get playlists from authenticated user
      maxResults: 10,
    });

    const playlists =
      response?.data?.items
        ?.filter((x) => !!x.id && !!x.snippet)
        .map((x) => ({
          id: x.id!,
          name: x.snippet!.title ?? "-",
          thumbnail: x.snippet!.thumbnails?.default?.url ?? undefined,
        })) ?? [];

    return playlists;
  } catch (error) {
    console.error("Error fetching YouTube playlists:", error);
    throw new Error("Failed to fetch YouTube playlists");
  }
};

export const searchYouTubeSong = async (
  artists: string[],
  songTitle: string
) => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token");

  if (!accessToken) {
    throw new Error("Access token not found in cookies");
  }

  oauth2Client.setCredentials({ access_token: accessToken.value });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      q: `${artists.join(", ")} ${songTitle}`,
      type: ["video"],
      videoCategoryId: "10", // Music category
      maxResults: 1, // Adjust as needed
    });

    if (!response.data.items?.length || !response.data.items[0].id?.videoId) {
      return [];
    }

    const addResponse = await youtube.playlistItems.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          playlistId: "PLyLBTt4SdCfqF2t_RzStbOQfuGiTtdcUz",
          resourceId: {
            kind: "youtube#video",
            videoId: response.data.items[0].id.videoId,
          },
        },
      },
    });

    return response.data.items;
  } catch (error) {
    // TODO: Handle gracefully
    console.error("Error searching for song on YouTube:", error);
    throw error;
  }
};
