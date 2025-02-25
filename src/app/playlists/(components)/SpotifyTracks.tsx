"use client";

import React from "react";
import { useSpotify } from "../(providers)/SpotifyContext";
import { searchYouTubeSong } from "@/app/(actions)/youtubeapi.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SpotifyTrack } from "@/app/(actions)/spotifyapi.actions";
import { CheckedState } from "@radix-ui/react-checkbox";

const SpotifyTracks: React.FC = () => {
  const {
    selectedPlaylist,
    tracks,
    loadingTracks,
    selectedTracks,
    setSelectedTracks,
  } = useSpotify();

  const toggleTrack = (
    value: boolean | "indeterminate",
    track: SpotifyTrack
  ) => {
    if (!value) {
      setSelectedTracks(selectedTracks.filter((t) => t.id !== track.id));
      return;
    }

    setSelectedTracks([...selectedTracks, track]);
  };

  const toggleTrackAll = () => {
    if (selectedTracks.length > 0) {
      setSelectedTracks([]);
      return;
    }

    setSelectedTracks(tracks);
  };

  if (!selectedPlaylist) return null;

  if (loadingTracks) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">{selectedPlaylist.name}</div>
      <Table className="min-w-full divide-y">
        <TableHeader>
          <TableRow>
            <TableHead className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase">
              #
            </TableHead>
            <TableHead className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase">
              Track
            </TableHead>
            <TableHead className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase">
              <Checkbox
                className="mr-1"
                onCheckedChange={toggleTrackAll}
                checked={selectedTracks.length > 0}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {tracks?.map((track, i) => (
            <TableRow key={i}>
              <TableCell className="px-3 sm:px-6 py-4 text-sm">
                {i + 1}
              </TableCell>
              <TableCell className="px-3 sm:px-6 py-4 text-sm">
                {track.artists.join(", ")} - {track.name}
              </TableCell>
              <TableCell className="px-4 sm:px-6 py-4 text-sm text-center">
                <Checkbox
                  className="mr-1"
                  onCheckedChange={(e: CheckedState) => toggleTrack(e, track)}
                  checked={selectedTracks.some((t) => t.id === track.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SpotifyTracks;
