import { cookies } from "next/headers";
import { parseJwt } from "../utils/jwt-utils";
import { SpotifyProvider } from "./(providers)/SpotifyContext";
import SpotifyPlaylistFetcher from "./(components)/SpotifyPlaylistFetcher";
import SpotifyPlaylists from "./(components)/SpotifyPlaylists";
import SpotifyTracks from "./(components)/SpotifyTracks";
import { redirect } from "next/navigation";
import YoutubePlaylistSelector from "./(components)/YoutubePlaylistSelector";
import Image from "next/image";
import { YoutubeProvider } from "./(providers)/YoutubeContext";
import { MigrateSongsButton } from "./(components)/MigrateSongsButton";

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
    <div className="flex flex-col w-full md:max-w-[600px] lg:max-w-[800px]">
      <div className="flex flex-row items-center my-6 md:my-8 space-x-4">
        <Image
          src={img}
          className="h-12 rounded-lg"
          alt="user logo"
          width={50}
          height={80}
        />
        <div className="text-3xl sm:text-4xl font-bold">{username}</div>
      </div>

      <div className="flex flex-col gap-8">
        <YoutubeProvider>
          <YoutubePlaylistSelector />
          <SpotifyProvider>
            <SpotifyPlaylistFetcher />
            <SpotifyPlaylists />
            <SpotifyTracks />

            <MigrateSongsButton />
          </SpotifyProvider>
        </YoutubeProvider>
      </div>
    </div>
  );
}
