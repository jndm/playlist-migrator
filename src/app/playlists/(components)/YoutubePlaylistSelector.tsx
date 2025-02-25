import { getUserYoutubePlaylists } from "@/app/(actions)/youtubeapi.actions";
import { FC } from "react";
import YoutubePlaylistTable from "./YoutubePlaylistTable";

const YoutubePlaylistSelector: FC = async () => {
  const playlists = (await getUserYoutubePlaylists()) || [];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Target Youtube playlist</div>
      <div className="text-md text-gray-500">
        Choose to which Youtube playlist will the songs be added to.
      </div>
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
