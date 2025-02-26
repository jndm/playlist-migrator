"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  getPlaylistTracks,
  getUserPlaylists,
} from "@/app/(actions)/spotifyapi.actions";
import { SpotifyPlaylist, SpotifyTrack } from "@/app/(actions)/spotify.model";

type SelectedPlaylist = {
  id: string;
  name: string;
};

interface SpotifyContextProps {
  playlists: SpotifyPlaylist[];
  fetchPlaylists: (username: string) => Promise<void>;
  selectedPlaylist: SelectedPlaylist | null;
  tracks: SpotifyTrack[];
  loadingTracks: boolean;
  setSelectedPlaylist: (playlist: SelectedPlaylist | null) => void;

  selectedTracks: SpotifyTrack[];
  setSelectedTracks: (tracks: SpotifyTrack[]) => void;
  updateTracksExportStatus: (
    updates: { trackId: string; status: "success" | "error" | "loading" }[]
  ) => void;
}

const SpotifyContext = createContext<SpotifyContextProps | undefined>(
  undefined
);

export const SpotifyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SelectedPlaylist | null>(null);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);
  const [selectedTracks, setSelectedTracks] = useState<SpotifyTrack[]>([]);

  const fetchPlaylists = async (username: string) => {
    if (loadingPlaylists) {
      return;
    }

    setLoadingPlaylists(true);

    try {
      const fetchedPlaylists = await getUserPlaylists(username);
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }

    setLoadingPlaylists(false);
  };

  const fetchPlaylistTracks = async (playlistId: string) => {
    try {
      setLoadingTracks(true);
      const fetchedTracks = await getPlaylistTracks(playlistId);
      setTracks(fetchedTracks);
      setSelectedTracks([]);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    } finally {
      setLoadingTracks(false);
    }
  };

  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistTracks(selectedPlaylist.id);
    }
  }, [selectedPlaylist]);

  const updateTracksExportStatus = (
    updates: { trackId: string; status: "success" | "error" | "loading" }[]
  ) => {
    const updated: SpotifyTrack[] = tracks.map((track) => ({
      ...track,
      exportStatus:
        updates.find((u) => u.trackId === track.id)?.status ??
        track.exportStatus,
    }));

    setTracks(updated);
  };

  return (
    <SpotifyContext.Provider
      value={{
        playlists,
        fetchPlaylists,
        tracks,
        selectedPlaylist,
        setSelectedPlaylist,
        loadingTracks,
        selectedTracks,
        setSelectedTracks,
        updateTracksExportStatus,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
