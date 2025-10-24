import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const MouseCameraController = () => {
  const { camera, gl } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);

  useFrame(() => {
    // Interpolación suave hacia la rotación objetivo
    const lerpFactor = 0.08;

    camera.rotation.x = THREE.MathUtils.lerp(
      camera.rotation.x,
      targetRotation.current.x,
      lerpFactor
    );

    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      targetRotation.current.y,
      lerpFactor
    );
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalizar coordenadas del mouse de -1 a 1
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calcular rotación objetivo basada en la posición del mouse
      const maxRotation = Math.PI * 0.15; // 27 grados máximo
      targetRotation.current.y = mousePosition.current.x * maxRotation;
      targetRotation.current.x = mousePosition.current.y * maxRotation * 0.6;
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleMouseLeave = () => {
      // Resetear rotación cuando el mouse sale del canvas
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
    };

    // Agregar event listeners
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl.domElement]);

  return null;
};
