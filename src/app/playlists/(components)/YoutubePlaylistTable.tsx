"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC, useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

interface YoutubePlaylistTableProps {
  playlists: YoutubePlaylistItem[];
}

const YoutubePlaylistTable: FC<YoutubePlaylistTableProps> = ({
  playlists,
}: YoutubePlaylistTableProps) => {
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<YoutubePlaylistItem>();

  return (
    <div>
      <Table className="divide-y">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="px-2 sm:px-6 py-4 text-sm min-w-[180px] sm:min-w-[200px] md:min-w-[300px] lg:min-w-[500px]">
              Name
            </TableHead>
            <TableHead className="px-0 py-3"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {playlists.map((playlist) => (
            <TableRow key={playlist.id}>
              <TableCell className="px-1 sm:px-1 md:px-1 py-4 overflow-x-hidden ">
                {playlist.thumbnail && (
                  <Image
                    width={120}
                    height={90}
                    src={playlist.thumbnail}
                    alt="Playlist thumbnail"
                  />
                )}
              </TableCell>
              <TableCell className="px-2 sm:px-6 py-4 text-sm min-w-[180px] sm:min-w-[250px] md:min-w-[300px] lg:min-w-[500px]">
                {playlist.name}
              </TableCell>
              <TableCell>
                <Checkbox
                  className="mr-1 min-w-[30px] min-h-[30px] sm:min-w-[40px] sm:min-h-[40px]"
                  onCheckedChange={() => setSelectedPlaylist(playlist)}
                  checked={selectedPlaylist?.id === playlist.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default YoutubePlaylistTable;
