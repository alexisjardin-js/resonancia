import { SpotifyPlayer, PlaylistSidebar, Scene3D } from './components';
import { useEffect, useRef, useState } from 'react';
import { type Track, localTracks } from './data/music';

// Tunables
const BASE_SCALE = 1.1; // Zoom base más bajo
const PARALLAX_X = -12; // Menos movimiento horizontal
const PARALLAX_Y = -6; // Menos movimiento vertical

export const App = () => {
  // Video fijo desde la carpeta public/videos/
  const videoUrl = '/videos/video3.mp4';
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Estado para el reproductor de música
  const [currentTrack, setCurrentTrack] = useState<Track | null>(localTracks[0]);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
  };

  useEffect(() => {
    let currentX = 0;
    let currentY = 0;

    const updateParallax = (x: number, y: number) => {
      if (!backgroundRef.current) return;

      const parallaxX = x * PARALLAX_X;
      const parallaxY = y * PARALLAX_Y;

      backgroundRef.current.style.transform = `translate(${parallaxX}px, ${parallaxY}px) scale(${BASE_SCALE})`;
    };

    // Mouse events para desktop
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

      currentX = mouseX;
      currentY = mouseY;
      updateParallax(currentX, currentY);
    };

    // Touch events para móvil
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];

      const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
      const touchY = (touch.clientY / window.innerHeight) * 2 - 1;

      currentX = touchX;
      currentY = touchY;
      updateParallax(currentX, currentY);
    };

    // Device orientation para giroscopio
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        const orientationX = Math.max(-1, Math.min(1, event.gamma / 45));
        const orientationY = Math.max(-1, Math.min(1, event.beta / 90));

        currentX = orientationX;
        currentY = orientationY;
        updateParallax(currentX, currentY);
      }
    };

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      if (
        typeof (
          window as unknown as {
            DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
          }
        ).DeviceOrientationEvent?.requestPermission === 'function'
      ) {
        (
          window as unknown as {
            DeviceOrientationEvent: { requestPermission: () => Promise<string> };
          }
        ).DeviceOrientationEvent.requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleDeviceOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }

      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return (
    <>
      <div className="w-full h-screen overflow-hidden relative">
        {/* Fondo con parallax: video en loop - responsive container */}
        <div
          ref={backgroundRef}
          className="absolute inset-0 w-full h-[calc(100vh-80px)] md:h-full z-0 will-change-transform"
          style={{
            transition: 'transform 0.1s ease-out',
            transformOrigin: 'center center',
          }}
          aria-hidden>
          {/* Video solo en desktop (md y mayor) */}
          <video
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{ pointerEvents: 'none' }}
          />

          {/* Imagen solo en móvil (menor que md) */}
          <img
            src="./images/fondo.jpg"
            alt="fondo"
            className="absolute inset-0 w-full h-full object-cover md:hidden"
          />
          {/* Overlay opcional para contraste:
          <div className="absolute inset-0 bg-black/20" /> */}
        </div>

        {/* Escena 3D solo en móvil - ajustado al área del video */}
        <div className="absolute inset-0 h-[calc(100vh-80px)] z-10 md:hidden">
          <Scene3D videoUrl={videoUrl} />
        </div>

        {/* Instrucciones */}
        <div className="absolute bottom-4 md:bottom-28 left-4 right-4 md:right-[400px] z-20 bg-black/80 text-white p-3 rounded-lg text-center text-sm">
          <p className="hidden md:block">
            🖱️ Mueve el mouse para cambiar la perspectiva del video de fondo
          </p>
          <div className="md:hidden space-y-1">
            <p>🎵 Toca una canción del menú para reproducir</p>
            <p className="text-xs text-gray-300">
              📱 Inclina el dispositivo o desliza el dedo para mover la cámara 3D
            </p>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <PlaylistSidebar
        tracks={localTracks}
        currentTrack={currentTrack}
        onTrackSelect={handleTrackSelect}
      />

      {/* Reproductor de Spotify */}
      <SpotifyPlayer currentTrack={currentTrack} />
    </>
  );
};
