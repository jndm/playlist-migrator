"use client";

import React from "react";
import { useSpotify } from "../(providers)/SpotifyContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const SpotifyPlaylists = () => {
  const { playlists, selectedPlaylist, setSelectedPlaylist } = useSpotify();

  return (
    <div>
      {playlists.length > 0 ? (
        <Table className="divide-y">
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tracks
              </TableHead>
              <TableHead className="px-0 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {playlists.map((playlist) => (
              <TableRow key={playlist.id}>
                <TableCell className="px-2 sm:px-6 py-4 whitespace-nowrap overflow-x-hidden max-w-[150px] md:max-w-auto text-sm">
                  {playlist.name}
                </TableCell>
                <TableCell className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm">
                  {playlist.tracks.total}
                </TableCell>
                <TableCell className="px-0 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {playlist.id !== selectedPlaylist?.id ? (
                    <Button
                      className="rounded-full bg-green-500"
                      onClick={() =>
                        setSelectedPlaylist({
                          id: playlist.id,
                          name: playlist.name,
                        })
                      }
                    >
                      Get tracks
                    </Button>
                  ) : (
                    <div className="text-green-500 mr-6">Selected</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-sm text-gray-500">
          <div className="mt-2">No playlists yet.</div>
        </div>
      )}
    </div>
  );
};

export default SpotifyPlaylists;
