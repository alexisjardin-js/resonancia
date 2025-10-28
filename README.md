# 🎵 Resonancia - Reproductor de Música con Video 3D

Una aplicación web interactiva que combina un reproductor de música estilo Spotify con una experiencia visual 3D inmersiva.

## ✨ Características Principales

- 🎵 **Reproductor estilo Spotify** con controles completos
- 📱 **Playlist sidebar** colapsible con lista de canciones
- 🎥 **Video 3D** en escena Three.js con audio silenciado
- 🖱️ **Control de cámara** mediante movimiento del mouse
- 🌟 **Efecto parallax** en el fondo
- 🎧 **Música local** desde archivos MP3

## 🎶 Funcionalidades del Reproductor

- ▶️ Play/Pausa con controles visuales
- ⏮️⏭️ Botones anterior/siguiente
- 🔀 Modo aleatorio (shuffle)
- 🔁 Modo repetición (off/one/all)
- 🔊 Control de volumen con slider
- 📊 Barra de progreso interactiva
- ❤️ Botón de favoritos
- 🎨 Portadas de álbumes dinámicas

## 📁 Cómo Agregar Música

### 1. **Agrega archivos MP3**
Coloca tus archivos de audio en la carpeta `public/audio/`:
```
public/audio/
├── cancion1.mp3
├── cancion2.mp3
├── cancion3.mp3
├── cancion4.mp3
└── cancion5.mp3
```

### 2. **Actualiza la configuración**
Edita `src/data/music.ts` con la información de tus canciones:

```typescript
export const localTracks: Track[] = [
  {
    id: '1',
    title: 'Tu Canción Favorita',
    artist: 'Tu Artista',
    album: 'Tu Álbum',
    duration: 180, // segundos
    cover: 'https://tu-portada.jpg',
    audioUrl: '/audio/tu-archivo.mp3'
  }
  // ... más canciones
];
```

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🎨 Estructura del Proyecto

```
src/
├── components/
│   ├── SpotifyPlayer.tsx     # Reproductor principal
│   ├── PlaylistSidebar.tsx   # Lista de canciones
│   ├── Scene3D.tsx           # Escena Three.js
│   └── VideoScreen.tsx       # Pantalla de video
├── data/
│   └── music.ts              # Configuración de canciones
└── App.tsx                   # Componente principal
```

## 🛠️ Tecnologías

- **React 19** + **TypeScript**
- **Three.js** + **React Three Fiber**
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Audio HTML5** para reproducción

## 🎯 Características Técnicas

- ✅ Reproducción de audio local
- ✅ Controles de reproducción completos
- ✅ Interfaz responsive
- ✅ Efectos visuales 3D
- ✅ Sin dependencias de APIs externas
- ✅ Fácil personalización