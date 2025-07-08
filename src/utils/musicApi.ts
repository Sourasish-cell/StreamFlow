export async function fetchSongs() {
  const res = await fetch('http://localhost:4000/api/songs');
  if (!res.ok) throw new Error('Failed to fetch songs');
  return res.json();
}

export async function searchSongs(query: string) {
  const res = await fetch(`http://localhost:4000/api/songs/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search songs');
  return res.json();
}

export async function getStreamUrl(trackId: string) {
  const res = await fetch(`http://localhost:4000/api/songs/stream/${trackId}`);
  if (!res.ok) throw new Error('Failed to get stream URL');
  const data = await res.json();
  return data.url;
}

export async function searchYouTubeMusic(query: string) {
  const res = await fetch(`http://localhost:4000/api/songs/youtube/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search YouTube music');
  return res.json();
}

export async function fetchYouTubePlaylist(playlistId: string) {
  const res = await fetch(`http://localhost:4000/api/songs/youtube/playlist?playlistId=${playlistId}`);
  if (!res.ok) throw new Error('Failed to fetch playlist');
  return res.json();
}

export async function searchYouTubeAlbums(queries: string[]) {
  // queries: array of album search terms
  const results = await Promise.all(
    queries.map(async (q) => {
      const res = await fetch(`http://localhost:4000/api/songs/youtube/search?q=${encodeURIComponent(q + ' album')}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    })
  );
  return results.filter(Boolean);
} 