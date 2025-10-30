import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VideoScreenProps {
  videoUrl: string;
  width?: number;
  height?: number;
  position?: [number, number, number];
}

export const VideoScreen = ({
  videoUrl,
  width = 16,
  height = 9,
  position = [0, 0, 0],
}: VideoScreenProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    // Crear video element con configuración optimizada para autoplay
    const video = document.createElement('video');
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.volume = 0; // Silenciado completamente
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.style.display = 'none';

    // Agregar al DOM
    document.body.appendChild(video);
    videoRef.current = video;

    // Reproducir automáticamente al cargar
    const startAutoplay = () => {
      video.play().catch((error) => {
        console.log('Video autoplay failed, waiting for user interaction:', error);
        // Intentar reproducir en cualquier interacción del usuario
        const playOnInteraction = () => {
          video
            .play()
            .then(() => {
              console.log('Video started playing after user interaction');
            })
            .catch(console.error);
        };

        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
      });
    };

    // Crear textura cuando esté listo
    const setupVideoTexture = () => {
      // Solo crear textura cuando el video tenga datos válidos
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.flipY = true;
        texture.generateMipmaps = false; // Evitar warnings WebGL

        setVideoTexture(texture);
      }

      // Intentar reproducir inmediatamente
      startAutoplay();
    };

    video.addEventListener('canplay', setupVideoTexture);
    video.addEventListener('loadeddata', setupVideoTexture);
    video.load();

    return () => {
      if (video.parentNode) document.body.removeChild(video);
      videoRef.current = null;
    };
  }, [videoUrl]);

  // Limpiar textura al desmontar
  useEffect(() => {
    return () => {
      if (videoTexture) {
        videoTexture.dispose();
      }
    };
  }, [videoTexture]);

  useFrame(() => {
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }

    // Asegurar que el video siga reproduciéndose
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(console.error);
    }
  });

  // Video funcionando correctamente ✅

  return (
    <group ref={meshRef} position={position}>
      {/* Pantalla del video - simplificada */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={videoTexture}
          side={THREE.DoubleSide}
          transparent={!videoTexture}
          color={videoTexture ? '#ffffff' : '#333333'} // Gris si no hay video
        />
      </mesh>

      {/* Indicador de carga si no hay video */}
      {!videoTexture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2, 1]} />
          <meshBasicMaterial color="#1db954" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Cristal protector sutil */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0}
          transmission={0.9}
          ior={1.5}
        />
      </mesh>
    </group>
  );
};
