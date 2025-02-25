import GoogleLoginBtn from "./(components)/GoogleLoginBtn";

export default async function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-left mt-8">
        Welcome to the Playlist Migrator
      </h1>
      <div className="text-1xl sm:text-1xl">
        To get started please login to to Google account you'll be creating new
        playlist for
      </div>

      <GoogleLoginBtn />
    </div>
  );
}
