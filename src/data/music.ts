// Interface para las canciones
export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number; // en segundos
    cover: string;
    audioUrl: string;
}

// Canciones locales - actualiza esta lista cuando agregues archivos en public/audio/
export const localTracks: Track[] = [
    {
        id: '1',
        title: 'ES_Bang Bang - Matt Large',
        artist: 'Bang Bang',
        album: 'Resonancia Collection',
        duration: 180,
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/1.mp3'
    },
    {
        id: '2',
        title: 'ES_Don\'t Test Me (Clean Version) - Iso Indies',
        artist: 'Katori Walker',
        album: 'Resonancia Collection',
        duration: 200,
        cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/2.mp3'
    },
    {
        id: '3',
        title: 'ES_Libations (Instrumental Version) - Xavy Rusan',
        artist: 'Libations',
        album: 'Resonancia Collection',
        duration: 220,
        cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/3.mp3'
    },
    {
        id: '4',
        title: 'Much Better',
        artist: 'Sarah, the Illstrumentalist',
        album: 'Resonancia Collection',
        duration: 195,
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/4.mp3'
    },
    {
        id: '5',
        title: 'You like It!',
        artist: 'Sarah, the Illstrumentalist',
        album: 'Resonancia Collection',
        duration: 240,
        cover: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/5.mp3'
    },
    {
        id: '6',
        title: 'Good Company',
        artist: 'Nyck Caution',
        album: 'Resonancia Collection',
        duration: 240,
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/6.mp3'
    },
    {
        id: '7',
        title: 'Pocket Rocket (Extended Instrumental)',
        artist: 'Nbhd Nick',
        album: 'Resonancia Collection',
        duration: 240,
        cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/7.mp3'
    },
    {
        id: '8',
        title: 'El Calaveras',
        artist: 'Alcones Negros',
        album: 'Resonancia Collection',
        duration: 240,
        cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/8.mp3'
    },
    {
        id: '9',
        title: 'Street Rev Anthem',
        artist: 'Aiyo',
        album: 'Resonancia Collection',
        duration: 240,
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/9.mp3'
    },
    {
        id: '10',
        title: 'El Invernadero',
        artist: 'Will Harrison',
        album: 'Resonancia Collection',
        duration: 240,
        cover: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=300&fit=crop&crop=entropy',
        audioUrl: '/audio/10.mp3'
    }
];