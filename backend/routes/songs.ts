import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
const JAMENDO_API = 'https://api.jamendo.com/v3.0';
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';

console.log('JAMENDO_CLIENT_ID in songs route:', JAMENDO_CLIENT_ID);

// Search for songs
router.get('/search', async (req: Request, res: Response) => {
  const search = req.query.q || '';
  try {
    const response = await axios.get(`${JAMENDO_API}/tracks`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 20,
        namesearch: search,
        audioformat: 'mp31',
        include: 'musicinfo',
      },
    });
    console.log('Jamendo API response:', response.data);
    const tracks = response.data.results.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      genre: track.musicinfo?.tags?.genres?.[0] || '',
      file: track.audio,
      image: track.album_image,
    }));
    res.json(tracks);
  } catch (err) {
    console.error('Jamendo fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch songs from Jamendo' });
  }
});

// Get stream URL for a track (Jamendo provides direct mp3 links)
router.get('/stream/:track_id', async (req: Request, res: Response) => {
  const { track_id } = req.params;
  try {
    const response = await axios.get(`${JAMENDO_API}/tracks`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        id: track_id,
        format: 'json',
        audioformat: 'mp31',
      },
    });
    const track = response.data.results[0];
    if (track && track.audio) {
      res.json({ url: track.audio });
    } else {
      res.status(404).json({ error: 'Track not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stream URL' });
  }
});

// YouTube Music Search
router.get('/youtube/search', async (req: Request, res: Response) => {
  const search = req.query.q || '';
  try {
    const response = await axios.get(`${YOUTUBE_API}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'snippet',
        q: search + ' music',
        type: 'video',
        maxResults: 20,
        videoCategoryId: '10', // Music category
      },
    });
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
    res.json(videos);
  } catch (err) {
    console.error('YouTube fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
  }
});

// YouTube Playlist Details
router.get('/youtube/playlist', (req: Request, res: Response) => {
  (async () => {
    const playlistId = req.query.playlistId as string;
    if (!playlistId) return res.status(400).json({ error: 'Missing playlistId' });
    try {
      const response = await axios.get(`${YOUTUBE_API}/playlists`, {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet',
          id: playlistId,
        },
      });
      const item = response.data.items[0];
      if (!item) return res.status(404).json({ error: 'Playlist not found' });
      res.json({
        id: item.id,
        title: item.snippet.title,
        image: item.snippet.thumbnails.medium.url,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
      });
    } catch (err) {
      console.error('YouTube playlist fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch playlist from YouTube' });
    }
  })();
});

export default router; 