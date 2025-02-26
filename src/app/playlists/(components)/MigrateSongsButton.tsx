"use client";

import { Button } from "@/components/ui/button";
import { useSpotify } from "../(providers)/SpotifyContext";
import { useYoutube } from "../(providers)/YoutubeContext";
import { addTracksToYoutube } from "@/app/(actions)/youtubeapi.actions";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const MigrateSongsButton: React.FC = () => {
  const { targetPlaylist } = useYoutube();
  const { selectedTracks, setSelectedTracks, updateTracksExportStatus } =
    useSpotify();

  const [loading, setLoading] = useState<boolean>(false);

  const addSelectedSongs = async () => {
    if (!targetPlaylist || selectedTracks.length < 1) return;

    setLoading(true);

    updateTracksExportStatus(
      selectedTracks.map((track) => ({
        trackId: track.id,
        status: "loading",
      }))
    );

    const response = await addTracksToYoutube({
      playlistId: targetPlaylist.id,
      tracks: selectedTracks.map((track) => ({
        trackId: track.id,
        title: track.name,
        artists: track.artists,
      })),
    });

    updateTracksExportStatus(response);

    setSelectedTracks([]);

    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <Button
      disabled={!targetPlaylist || selectedTracks.length < 1}
      onClick={addSelectedSongs}
    >
      Add selected songs to playlist {targetPlaylist?.name}
    </Button>
  );
};
