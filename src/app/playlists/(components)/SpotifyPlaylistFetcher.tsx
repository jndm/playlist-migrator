"use client";
import React, { useRef, useState } from "react";
import { useSpotify } from "../(providers)/SpotifyContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SpotifyPlaylists: React.FC = () => {
  const [spotifyUsername, setSpotifyUsername] = useState<string | null>(null);
  const previousUsername = useRef<string | null>(null);

  const { fetchPlaylists } = useSpotify();

  const getSpotifyPlaylists = (): void => {
    if (!spotifyUsername) return;

    if (spotifyUsername === previousUsername.current) return;

    fetchPlaylists(spotifyUsername);
    previousUsername.current = spotifyUsername;
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      getSpotifyPlaylists();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Spotify playlists</div>
      <div className="text-md text-gray-500">
        Enter Spotify username to get playlists from and choose which playlist
        to migrate songs from.
      </div>

      <div className="flex flex-row gap-4">
        <Input
          type="text"
          placeholder="Spotify Username"
          className="mt-2 p-2 border rounded"
          onChange={(e) => setSpotifyUsername(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <Button
          onClick={getSpotifyPlaylists}
          className="rounded-full mt-2 bg-green-500"
        >
          Get Playlists
        </Button>
      </div>
    </div>
  );
};

export default SpotifyPlaylists;
