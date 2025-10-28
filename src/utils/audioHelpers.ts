// Función helper para codificar URLs de audio correctamente
export const getAudioUrl = (filename: string): string => {
    // Codificar espacios y caracteres especiales
    const encodedFilename = encodeURIComponent(filename);
    return `/audio/${encodedFilename}`;
};

// Función para verificar si un archivo de audio existe
export const checkAudioExists = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};

// Función para testear todas las URLs de audio
export const testAllAudioUrls = async (tracks: { title: string; audioUrl: string }[]): Promise<void> => {
    console.log('🎵 Verificando archivos de audio...');

    for (const track of tracks) {
        const exists = await checkAudioExists(track.audioUrl);
        console.log(`${exists ? '✅' : '❌'} ${track.title}: ${track.audioUrl}`);
    }
};