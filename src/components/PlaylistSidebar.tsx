import { useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  audioUrl: string;
}

interface PlaylistSidebarProps {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
}

export const PlaylistSidebar = ({ tracks, currentTrack, onTrackSelect }: PlaylistSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-0 bottom-20 w-12 bg-black border-l border-gray-800 z-30 flex flex-col">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-4 text-gray-400 hover:text-white transition-colors border-b border-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-20 w-96 bg-black border-l border-gray-800 z-30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Resonancia-Playlist</h2>
            <p className="text-gray-400 text-xs">{tracks.length} canciones</p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button className="bg-green-500 hover:bg-green-600 text-black rounded-full p-2 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.83 13.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13zM14.5 4l2.04 2.04L13.41 9.17l1.41 1.41L17.96 7.46 20 9.5V4h-5.5zm-9.46 5.17L6.46 8.04 4 5.5V11h5.5L7.46 8.96l1.09-1.09L10.59 9.9l-1.41 1.41L7.04 9.17z" />
            </svg>
          </button>

          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>

          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <div className="grid grid-cols-12 gap-3 text-xs text-gray-400 border-b border-gray-800 pb-3 mb-4 px-3">
            <div className="col-span-1">#</div>
            <div className="col-span-7">Título</div>
            <div className="col-span-3">Álbum</div>
            <div className="col-span-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {tracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className={`grid grid-cols-12 gap-3 items-center py-3 px-3 mb-1 rounded cursor-pointer transition-colors group hover:bg-gray-800/50 ${
                currentTrack?.id === track.id ? 'bg-gray-800/80' : ''
              }`}>
              <div className="col-span-1 text-gray-400 text-sm">
                {currentTrack?.id === track.id ? (
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <span className="group-hover:hidden">{index + 1}</span>
                )}
                <svg
                  className="w-4 h-4 text-white hidden group-hover:block"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              <div className="col-span-7 min-w-0">
                <div className="flex items-center space-x-4">
                  <img
                    src={track.cover}
                    alt={track.album}
                    className="w-12 h-12 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm truncate ${
                        currentTrack?.id === track.id ? 'text-green-500' : 'text-white'
                      }`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-3 min-w-0">
                <p className="text-xs text-gray-400 truncate">{track.album}</p>
              </div>

              <div className="col-span-1 flex items-center justify-end">
                <span className="text-xs text-gray-400 min-w-[35px] text-right">
                  {formatDuration(track.duration)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      {/*    <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        <p>Creado por Resonancia</p>
        <p className="mt-1">
          Total: {tracks.reduce((acc, track) => acc + track.duration, 0)} segundos
        </p>
      </div> */}
    </div>
  );
};
