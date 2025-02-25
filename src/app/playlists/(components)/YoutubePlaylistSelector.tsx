import { getUserYoutubePlaylists } from "@/app/(actions)/youtubeapi.actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import YoutubePlaylistTable from "./YoutubePlaylistTable";

const YoutubePlaylistSelector: FC = async () => {
  const playlists = (await getUserYoutubePlaylists()) || [];

  return (
    <div>
      {playlists.length > 0 ? (
        <YoutubePlaylistTable playlists={playlists} />
      ) : (
        <div className="text-sm text-gray-500">
          <div className="mt-2">No playlists yet.</div>
        </div>
      )}
    </div>
  );
};

export default YoutubePlaylistSelector;
