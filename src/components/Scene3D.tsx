import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { VideoScreen } from './VideoScreen';
import { MouseCameraController } from './MouseCameraController';

interface Scene3DProps {
  videoUrl: string;
}

export const Scene3D = ({ videoUrl }: Scene3DProps) => {
  // Detectar si es móvil para ajustar tamaño del video
  const isMobile =
    typeof window !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Tamaños responsive para el video
  const videoWidth = isMobile ? 4 : 16; // Mucho más pequeño en móvil (25% del tamaño original)
  const videoHeight = isMobile ? 2.25 : 9; // Mantener proporción 16:9

  // Ajustar cámara y posición según dispositivo
  const cameraPosition: [number, number, number] = isMobile ? [0, 0, 6] : [0, 0, 10];
  const fov = isMobile ? 45 : 75; // Campo de visión mucho más cerrado en móvil
  const videoPosition: [number, number, number] = isMobile ? [0, 0, -3] : [0, 0, 0]; // Más hacia atrás en móvil

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: cameraPosition,
          fov: fov,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          {/* Iluminación ambiental */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          {/* Luz adicional para resaltar la TV */}
          <pointLight position={[0, 0, 15]} intensity={0.5} color="#ffffff" />
          <spotLight position={[5, 5, 10]} angle={0.3} penumbra={0.2} intensity={0.6} castShadow />

          {/* Pantalla de video responsive */}
          <VideoScreen
            videoUrl={videoUrl}
            width={videoWidth}
            height={videoHeight}
            position={videoPosition}
          />

          {/* Control de cámara con mouse */}
          <MouseCameraController />
        </Suspense>
      </Canvas>
    </div>
  );
};
