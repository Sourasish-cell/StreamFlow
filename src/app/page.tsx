"use client";
import React, { useState } from 'react';
import { searchYouTubeMusic, fetchYouTubePlaylist, searchYouTubeAlbums } from '../utils/musicApi';

const albumQueries = [
  'Best of Ed Sheeran',
  'Top Pop Albums 2024',
  'Greatest Rock Albums',
  'Jazz Classics Album',
];

const playlistIds = [
  'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI', // Top 100 Music Videos Global
  'PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj', // Today's Top Hits
  'PLDcnymzs18LVXfO_x0Ei0R24qDbVtyy66', // Chill Hits
  'PL4fGSI1pDJn6yPz6bM8PQb8K2k6jF2jR_', // Rock Classics
];

const Sidebar = ({ onNav }: { onNav: (nav: string) => void }) => (
  <aside className="bg-[#181818] text-white w-60 min-h-screen flex flex-col p-6">
    <div className="flex items-center gap-2 mb-8">
      <img src="/StreamFlow.jpg" alt="Logo" className="w-8 h-8" />
      <span className="text-2xl font-bold text-red-500">StreamFlow</span>
    </div>
    <nav className="flex flex-col gap-4">
      <button className="text-left hover:text-red-400" onClick={() => onNav('home')}>Home</button>
      <button className="text-left hover:text-red-400" onClick={() => onNav('search')}>Search</button>
      <button className="text-left hover:text-red-400" onClick={() => onNav('playlists')}>Playlists</button>
    </nav>
  </aside>
);

const YouTubePlayer = ({ videoId, onClose }: { videoId: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg p-4 relative w-full max-w-2xl">
      <button className="absolute top-2 right-2 text-white text-2xl" onClick={onClose}>&times;</button>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  </div>
);

const Carousel = ({ title, items, onClick }: { title: string, items: any[], onClick?: (item: any) => void }) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <div className="flex gap-6 overflow-x-auto pb-2">
      {items.map(item => (
        <div key={item.id} className="min-w-[180px] bg-[#232323] rounded-lg p-4 flex flex-col items-center hover:bg-[#333] transition cursor-pointer" onClick={onClick ? () => onClick(item) : undefined}>
          <img src={item.image} alt={item.title} className="rounded mb-2 w-40 h-auto object-contain bg-black" />
          <div className="font-semibold text-white text-center line-clamp-2">{item.title}</div>
        </div>
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const [nav, setNav] = useState('home');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState<string | null>(null);
  const [featuredAlbums, setFeaturedAlbums] = useState<any[]>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<any[]>([]);

  React.useEffect(() => {
    async function fetchHomeContent() {
      const [albums, playlists] = await Promise.all([
        searchYouTubeAlbums(albumQueries),
        Promise.all(playlistIds.map(id => fetchYouTubePlaylist(id))),
      ]);
      setFeaturedAlbums(albums);
      setFeaturedPlaylists(playlists);
    }
    fetchHomeContent();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchYouTubeMusic(search);
      setResults(data);
      setNav('search');
    } finally {
      setLoading(false);
    }
  };

  let mainContent;
  if (nav === 'home') {
    mainContent = (
      <section className="flex-1 p-8 overflow-y-auto">
        <div className="bg-gradient-to-r from-[#1e1e1e] to-[#232323] rounded-2xl p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to StreamFlow</h1>
            <p className="text-gray-300 text-lg mb-6 max-w-xl">Enjoy unlimited music videos, trending albums, and curated playlists. Search for your favorite songs, artists, or genres!</p>
            <form onSubmit={handleSearch} className="flex w-full max-w-lg">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for any song, artist, or genre..."
                className="flex-1 p-3 rounded-l bg-gray-700 text-white focus:outline-none"
              />
              <button type="submit" className="px-6 py-3 bg-red-500 rounded-r hover:bg-red-600 font-bold">Search</button>
            </form>
          </div>
          <img src="/StreamFlow1.jpg" alt="YouTube Music" className="w-96 h-auto hidden md:block rounded-2xl shadow-lg" />
        </div>
        <Carousel title="Featured Albums" items={featuredAlbums} />
        <Carousel title="Curated Playlists" items={featuredPlaylists} />
      </section>
    );
  } else if (nav === 'search') {
    mainContent = (
      <>
        <header className="bg-[#181818] p-6 flex items-center justify-between">
          <form onSubmit={handleSearch} className="flex w-full max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for any song, artist, or genre..."
              className="flex-1 p-3 rounded-l bg-gray-700 text-white focus:outline-none"
            />
            <button type="submit" className="px-6 py-3 bg-red-500 rounded-r hover:bg-red-600 font-bold">Search</button>
          </form>
        </header>
        <section className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="text-gray-400 text-center">Loading...</div>
          ) : results.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Search Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((video) => (
                  <div key={video.id} className="bg-[#232323] rounded-lg p-4 flex flex-col items-center hover:bg-[#333] transition cursor-pointer" onClick={() => setPlayer(video.id)}>
                    <img src={video.thumbnail} alt={video.title} className="rounded mb-2 w-full h-40 object-cover" />
                    <div className="font-semibold text-white text-center line-clamp-2">{video.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{video.channel}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-16">Search for any song, artist, or genre to get started!</div>
          )}
        </section>
      </>
    );
  } else if (nav === 'playlists') {
    mainContent = (
      <section className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Your Playlists</h2>
        <p className="text-gray-400">Playlist functionality coming soon!</p>
      </section>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar onNav={setNav} />
      <main className="flex-1 flex flex-col">
        {mainContent}
        {player && <YouTubePlayer videoId={player} onClose={() => setPlayer(null)} />}
      </main>
    </div>
  );
};

export default HomePage;
