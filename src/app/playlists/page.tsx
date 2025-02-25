import { cookies } from "next/headers";
import { parseJwt } from "../utils/jwt-utils";
import { SpotifyProvider } from "./(providers)/SpotifyContext";
import SpotifyPlaylistFetcher from "./(components)/SpotifyPlaylistFetcher";
import SpotifyPlaylists from "./(components)/SpotifyPlaylists";
import SpotifyTracks from "./(components)/SpotifyTracks";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import YoutubePlaylistSelector from "./(components)/YoutubePlaylistSelector";

export default async function Home() {
  const cookiesStore = await cookies();

  let username = "";
  let img = "";
  try {
    const userjwt = parseJwt(cookiesStore.get("id_token")?.value);
    username = userjwt.name;
    img = userjwt.picture;
  } catch {
    redirect("/");
  }

  return (
    <div className="flex flex-col w-full md:max-w-[600] lg:max-w-[800]">
      <div className="flex flex-row items-center my-8 space-x-4">
        <img src={img} className="h-12 rounded-lg" />
        <div className="text-3xl sm:text-4xl font-bold">{username}</div>
      </div>

      <div className="flex flex-col gap-8">
        <YoutubePlaylistSelector />
        <SpotifyProvider>
          <SpotifyPlaylistFetcher />
          <SpotifyPlaylists />
          <SpotifyTracks />

          <Button>Add selected songs to playlist</Button>
        </SpotifyProvider>
      </div>
    </div>
  );
}
