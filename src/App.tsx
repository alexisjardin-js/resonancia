import { Scene3D } from './components';
import { useEffect, useRef } from 'react';

export const App = () => {
  // Video fijo desde la carpeta public/videos/
  const videoUrl = '/videos/video.mp4';
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!backgroundRef.current) return;

      // Normalizar posición del mouse (-1 a 1)
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

      // Parallax inverso - cuando mouse va derecha, fondo va izquierda
      const parallaxX = mouseX * -20; // Ajusta la intensidad
      const parallaxY = mouseY * -10; // Menos movimiento vertical

      // Aplicar transformación de parallax al fondo
      backgroundRef.current.style.transform = `translate(${parallaxX}px, ${parallaxY}px) scale(1.1)`;
    };

    // Agregar listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="w-full h-screen overflow-hidden relative">
        {/* Fondo con parallax */}
        <div
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/images/fondo.jpg)',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat',
            transition: 'transform 0.1s ease-out',
            transformOrigin: 'center center',
          }}
        />

        {/* Escena 3D */}
        <div className="absolute inset-0 z-10">
          <Scene3D videoUrl={videoUrl} />
        </div>

        {/* Instrucciones */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/80 text-white p-3 rounded-lg text-center text-sm">
          <p>🖱️ Mueve el mouse para cambiar la perspectiva de la cámara y el parallax del fondo</p>
        </div>
      </div>
    </>
  );
};
