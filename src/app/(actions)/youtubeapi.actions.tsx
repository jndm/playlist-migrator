"use server";
import { oauth2Client } from "../utils/google-auth";
import { cookies } from "next/headers";
import { google } from "googleapis";
import {
  AddTracksToYoutubeRequest,
  AddTracksToYoutubeResponse,
  YoutubePlaylistItem,
} from "./youtube.model";

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

export const addTracksToYoutube = async (
  request: AddTracksToYoutubeRequest
): Promise<AddTracksToYoutubeResponse[]> => {
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

  const { playlistId, tracks } = request;

  const response: AddTracksToYoutubeResponse[] = [];

  for (const track of tracks) {
    try {
      const searchResp = await youtube.search.list({
        part: ["snippet"],
        q: `${track.artists.join(", ")} ${track.title}`,
        type: ["video"],
        videoCategoryId: "10", // Music category
        maxResults: 1, // Adjust as needed
      });

      if (
        !searchResp.data.items?.length ||
        !searchResp.data.items[0].id?.videoId
      ) {
        response.push({
          trackId: track.trackId,
          status: "error",
        });
        continue;
      }

      await youtube.playlistItems.insert({
        part: ["snippet"],
        requestBody: {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: searchResp.data.items[0].id.videoId,
            },
          },
        },
      });

      response.push({
        trackId: track.trackId,
        status: "success",
      });
    } catch (error) {
      console.error("Error searching for song on YouTube:", error);
      response.push({
        trackId: track.trackId,
        status: "error",
      });
    }
  }

  return response;
};
