export type YoutubePlaylistItem = {
  id: string;
  name: string;
  thumbnail?: string;
};

export type AddTracksToYoutubeRequest = {
  playlistId: string;
  tracks: {
    trackId: string;
    artists: string[];
    title: string;
  }[];
};

export type AddTracksToYoutubeResponse = {
  trackId: string;
  status: "success" | "error";
};
