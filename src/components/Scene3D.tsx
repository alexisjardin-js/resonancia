import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { VideoScreen } from './VideoScreen';
import { MouseCameraController } from './MouseCameraController';

interface Scene3DProps {
  videoUrl: string;
}

export const Scene3D = ({ videoUrl }: Scene3DProps) => {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
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

          {/* Pantalla de video */}
          <VideoScreen videoUrl={videoUrl} width={16} height={9} />

          {/* Control de cámara con mouse */}
          <MouseCameraController />
        </Suspense>
      </Canvas>
    </div>
  );
};
