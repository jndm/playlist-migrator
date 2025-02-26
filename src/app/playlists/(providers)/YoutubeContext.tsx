"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

type YoutubeTargetPlaylist = {
  id: string;
  name: string;
};

interface YoutubeContextProps {
  targetPlaylist?: YoutubeTargetPlaylist;
  setTargetPlaylist: (playlist?: YoutubeTargetPlaylist) => void;
}

const YoutubeContext = createContext<YoutubeContextProps | undefined>(
  undefined
);

export const YoutubeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [targetPlaylist, setTargetPlaylist] = useState<
    YoutubeTargetPlaylist | undefined
  >(undefined);

  return (
    <YoutubeContext.Provider
      value={{
        targetPlaylist,
        setTargetPlaylist,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};

export const useYoutube = () => {
  const context = useContext(YoutubeContext);
  if (!context) {
    throw new Error("useYoutube must be used within a YoutubeProvider");
  }
  return context;
};
