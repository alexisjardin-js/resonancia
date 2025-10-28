import { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  audioUrl: string;
}

interface SpotifyPlayerProps {
  currentTrack: Track | null;
}

export const SpotifyPlayer = ({ currentTrack }: SpotifyPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volumeIndicator, setVolumeIndicator] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentTrack]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // No interceptar si está escribiendo en un input
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((prev) => Math.min(1, prev + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Reset states when track changes
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioReady(false);

    const handleTrackEnd = () => {
      if (repeatMode === 'one') {
        audio.play().catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleCanPlay = () => setAudioReady(true);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrack, repeatMode]);

  // Auto-reproducir cuando cambie la canción
  useEffect(() => {
    if (!audioRef.current || !currentTrack || !audioReady) return;

    const autoPlay = async () => {
      try {
        await audioRef.current!.play();
        setIsPlaying(true);
      } catch {
        // Auto-play bloqueado por el navegador
        setIsPlaying(false);
      }
    };

    const timer = setTimeout(autoPlay, 100);
    return () => clearTimeout(timer);
  }, [currentTrack, audioReady]);
  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        // Asegurar que el volumen esté configurado
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error reproduciendo audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 border-t border-gray-800 z-50">
        <div className="flex items-center justify-center">
          <p className="text-gray-400">Selecciona una canción para reproducir</p>
        </div>
      </div>
    );
  }

  const handleVolumeWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05; // Subir/bajar volumen en pasos de 5%
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);

    // Mostrar indicador temporal
    const percentage = Math.round(newVolume * 100);
    setVolumeIndicator(`🔊 ${percentage}%`);
    setTimeout(() => setVolumeIndicator(null), 1500);
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
  };
  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} src={currentTrack.audioUrl} />

      {/* Volume indicator */}
      {volumeIndicator && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-center backdrop-blur-sm">
          <span className="text-lg">{volumeIndicator}</span>
        </div>
      )}

      {/* Player bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white border-t border-gray-800 z-50">
        {/* Progress bar */}
        <div className="px-4 py-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${progress}%, #4a5568 ${progress}%, #4a5568 100%)`,
                }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main player content */}
        <div className="flex items-center justify-between px-2 md:px-4 py-2">
          {/* Track info */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
            <img
              src={currentTrack.cover}
              alt={currentTrack.album}
              className="w-10 h-10 md:w-14 md:h-14 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-white text-xs md:text-sm font-medium truncate flex items-center">
                {currentTrack.title}
                {!audioReady && (
                  <span className="ml-1 md:ml-2 text-xs text-yellow-400 hidden md:inline">
                    (Cargando...)
                  </span>
                )}
              </p>
              <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 justify-center">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`text-xs ${
                isShuffled ? 'text-green-500' : 'text-gray-400'
              } hover:text-white transition-colors hidden md:block`}
              disabled={!audioReady}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.83 13.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13zM14.5 4l2.04 2.04L13.41 9.17l1.41 1.41L17.96 7.46 20 9.5V4h-5.5zm-9.46 5.17L6.46 8.04 4 5.5V11h5.5L7.46 8.96l1.09-1.09L10.59 9.9l-1.41 1.41L7.04 9.17z" />
              </svg>
            </button>

            <button className="text-gray-400 hover:text-white transition-colors hidden md:block">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className={`${
                audioReady
                  ? 'bg-white text-black hover:scale-105'
                  : 'bg-yellow-500 text-black hover:scale-105'
              } rounded-full p-2 transition-transform`}
              title={
                audioReady ? 'Listo para reproducir' : 'Audio cargando... (Prueba hacer clic)'
              }>
              {!audioReady ? (
                <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button className="text-gray-400 hover:text-white transition-colors hidden md:block">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            <button
              onClick={() =>
                setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')
              }
              className={`text-xs ${
                repeatMode !== 'off' ? 'text-green-500' : 'text-gray-400'
              } hover:text-white transition-colors relative hidden md:block`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">1</span>
                </span>
              )}
            </button>

            {/* Volume control in center */}
            <div
              className="flex items-center space-x-1 relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              onWheel={handleVolumeWheel}>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={toggleMute}
                title={volume === 0 ? 'Desmutear' : 'Mutear'}>
                {volume === 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50">
                  <div className="bg-gray-800 p-3 rounded shadow-xl border border-gray-700">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs text-gray-300">{Math.round(volume * 100)}%</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => {
                          const newVolume = parseFloat(e.target.value);
                          setVolume(newVolume);
                        }}
                        className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #1db954 0%, #1db954 ${
                            volume * 100
                          }%, #4a5568 ${volume * 100}%, #4a5568 100%)`,
                        }}
                      />
                      <div className="text-xs text-gray-400 text-center">
                        <p>Rueda del mouse</p>
                        <p>para ajustar</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Additional controls (could add lyrics, queue, etc.) */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {/* Future: Device selector, lyrics, queue, etc. */}
          </div>
        </div>
      </div>
    </>
  );
};
