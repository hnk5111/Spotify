import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const moodKeywords = {
  happy: [
    "upbeat",
    "energetic",
    "joyful",
    "celebratory",
    "festive",
    "dance",
    "party",
    "खुशी",
    "जश्न",
    "मस्ती"
  ],
  sad: [
    "melancholic",
    "emotional",
    "heartbreak",
    "pain",
    "sorrow",
    "दर्द",
    "ग़म",
    "जुदाई",
    "तन्हाई"
  ],
  romantic: [
    "love",
    "romance",
    "passion",
    "intimate",
    "प्यार",
    "मोहब्बत",
    "इश्क़",
    "रोमांस"
  ],
  party: [
    "dance",
    "celebration",
    "upbeat",
    "energetic",
    "डांस",
    "पार्टी",
    "मस्ती",
    "धमाल"
  ]
};

async function analyzeLyricsMood(lyrics, targetMood) {
  try {
    const prompt = `
      Analyze these Hindi song lyrics and determine if they match a ${targetMood} mood.
      Consider these aspects for ${targetMood} mood: ${moodKeywords[targetMood].join(', ')}.
      Lyrics: ${lyrics}
      Return only "true" if it matches the mood, "false" if it doesn't.
    `;

    const response = await axios.post('https://api.groq.com/v1/completions', {
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: 'You are a Hindi song lyrics analyzer. Respond only with "true" or "false".'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 5
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const result = response.data.choices[0].message.content.trim().toLowerCase();
    return result === 'true';
  } catch (error) {
    console.error('Error analyzing lyrics:', error);
    return false;
  }
}

export async function getMoodBasedSongs(mood) {
  try {
    console.log(`Fetching songs for mood: ${mood}`);
    
    // First search for songs
    const searchUrl = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(
      `${mood} hindi songs`
    )}&limit=20`;
    
    console.log('Search URL:', searchUrl);
    const searchResponse = await axios.get(searchUrl);
    
    console.log('Search Response:', JSON.stringify(searchResponse.data, null, 2));

    if (!searchResponse.data?.data?.results) {
      console.error('Invalid response structure from Saavn API:', JSON.stringify(searchResponse.data, null, 2));
      throw new Error('Failed to fetch songs');
    }

    const songs = searchResponse.data.data.results;
    console.log(`Found ${songs.length} songs in search`);
    
    // Get detailed song information for each song
    const songDetailsPromises = songs.slice(0, 5).map(async (song) => {
      try {
        const detailsUrl = `https://saavn.dev/api/songs?id=${song.id}`;
        console.log(`Fetching details for song ${song.id} from ${detailsUrl}`);
        
        const detailsResponse = await axios.get(detailsUrl);
        console.log(`Song ${song.id} details:`, JSON.stringify(detailsResponse.data, null, 2));

        const songDetails = detailsResponse.data?.data?.[0];
        if (!songDetails) {
          console.error(`No details found for song ${song.id}`);
          return null;
        }

        // Try to get the highest quality URL available
        const downloadUrls = songDetails.downloadUrl;
        console.log(`Download URLs for song ${song.id}:`, downloadUrls);

        const downloadUrl = downloadUrls.reduce((best, current) => {
          const currentQuality = parseInt(current.quality);
          const bestQuality = parseInt(best.quality);
          return currentQuality > bestQuality ? current : best;
        }, downloadUrls[0]);

        console.log(`Selected download URL for song ${song.id}:`, downloadUrl);

        return {
          id: songDetails.id,
          name: songDetails.name,
          url: downloadUrl?.link || "",
          image: songDetails.image?.[2]?.link || songDetails.image?.[0]?.link || "",
          duration: songDetails.duration,
          primaryArtists: songDetails.primaryArtists,
          language: songDetails.language
        };
      } catch (error) {
        console.error(`Error fetching details for song ${song.id}:`, error.response?.data || error.message);
        return null;
      }
    });

    const results = await Promise.all(songDetailsPromises);
    const filteredResults = results.filter(song => song !== null && song.url);
    console.log(`Returning ${filteredResults.length} valid songs`);
    return filteredResults;
  } catch (error) {
    console.error('Error in getMoodBasedSongs:', error.response?.data || error.message);
    throw error;
  }
} 