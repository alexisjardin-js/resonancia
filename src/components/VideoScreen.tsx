import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VideoScreenProps {
  videoUrl: string;
  width?: number;
  height?: number;
}

export const VideoScreen = ({ videoUrl, width = 16, height = 9 }: VideoScreenProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    // Crear video element
    const video = document.createElement('video');
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.volume = 0; // Silenciado completamente
    video.playsInline = true;
    video.autoplay = true;
    video.style.display = 'none';

    // Agregar al DOM
    document.body.appendChild(video);
    videoRef.current = video;

    // Reproducir y crear textura cuando esté listo
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

      // Reproducir video
      video.play().catch(() => {
        document.addEventListener('click', () => video.play(), { once: true });
      });
    };

    video.addEventListener('canplay', setupVideoTexture);
    video.addEventListener('loadeddata', setupVideoTexture);
    video.load();

    return () => {
      if (video.parentNode) document.body.removeChild(video);
      if (videoTexture) videoTexture.dispose();
    };
  }, [videoUrl, videoTexture]);

  useFrame(() => {
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }
  });

  // Video funcionando correctamente ✅

  return (
    <group ref={meshRef}>
      {/* Pantalla del video - simplificada */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={videoTexture} side={THREE.DoubleSide} transparent={!videoTexture} />
      </mesh>

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
