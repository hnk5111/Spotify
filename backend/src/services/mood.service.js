import axios from 'axios';

// Remove Saavn API configuration
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

const moodSongs = {
  happy: [
    {
      name: "Happy",
      artist: "Pharrell Williams",
      url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
      image: "https://i.ytimg.com/vi/ZbZSe6N_BXs/maxresdefault.jpg",
      duration: "3:53"
    },
    {
      name: "Can't Stop the Feeling!",
      artist: "Justin Timberlake",
      url: "https://www.youtube.com/watch?v=ru0K8uYEZWw",
      image: "https://i.ytimg.com/vi/ru0K8uYEZWw/maxresdefault.jpg",
      duration: "4:11"
    },
    {
      name: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      url: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
      image: "https://i.ytimg.com/vi/OPf0YbXqDm0/maxresdefault.jpg",
      duration: "4:31"
    },
    {
      name: "Badtameez Dil",
      artist: "Pritam, Benny Dayal",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=II2EO3Nw4m0",
      image: "https://i.ytimg.com/vi/II2EO3Nw4m0/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "London Thumakda",
      artist: "Labh Janjua, Sonu Kakkar",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=udra3Mfw2oo",
      image: "https://i.ytimg.com/vi/udra3Mfw2oo/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Desi Girl",
      artist: "Vishal Dadlani, Shankar Mahadevan",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=RX7TA3ezjHc",
      image: "https://i.ytimg.com/vi/RX7TA3ezjHc/maxresdefault.jpg",
      duration: "4:20"
    },
    {
      name: "Gallan Goodiyaan",
      artist: "Daler Mehndi, Yashita Sharma",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=jCEdTq3j-0U",
      image: "https://i.ytimg.com/vi/jCEdTq3j-0U/maxresdefault.jpg",
      duration: "3:35"
    },
    {
      name: "Nachde Ne Saare",
      artist: "Jasleen Royal, Harshdeep Kaur",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=pOxF_07Kbs0",
      image: "https://i.ytimg.com/vi/pOxF_07Kbs0/maxresdefault.jpg",
      duration: "3:40"
    },
    {
      name: "Cutiepie",
      artist: "Pardeep Singh Sran, Nakash Aziz",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=f6vY6tYvKGA",
      image: "https://i.ytimg.com/vi/f6vY6tYvKGA/maxresdefault.jpg",
      duration: "3:22"
    },
    {
      name: "Ullu Ka Pattha",
      artist: "Arijit Singh, Nikhita Gandhi",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=3YZP0lzqZp4",
      image: "https://i.ytimg.com/vi/3YZP0lzqZp4/maxresdefault.jpg",
      duration: "3:15"
    },
    {
      name: "Kala Chashma",
      artist: "Badshah, Neha Kakkar",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=k4yXQkG2s1E",
      image: "https://i.ytimg.com/vi/k4yXQkG2s1E/maxresdefault.jpg",
      duration: "4:00"
    },
    {
      name: "Matargashti",
      artist: "Mohit Chauhan",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=6vKucgAeF_Q",
      image: "https://i.ytimg.com/vi/6vKucgAeF_Q/maxresdefault.jpg",
      duration: "4:15"
    },
    {
      name: "Sweety Tera Drama",
      artist: "Dev Negi, Pawni Pandey",
      mood: "happy",
      url: "https://www.youtube.com/watch?v=KiXh1YTrHN8",
      image: "https://i.ytimg.com/vi/KiXh1YTrHN8/maxresdefault.jpg",
      duration: "3:30"
    }
  ],
  sad: [
    {
      name: "Channa Mereya",
      artist: "Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=284Ov7ysmfA",
      image: "https://i.ytimg.com/vi/284Ov7ysmfA/maxresdefault.jpg",
      duration: "4:49"
    },
    {
      name: "Tum Hi Ho",
      artist: "Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=Umqb9KENgmk",
      image: "https://i.ytimg.com/vi/Umqb9KENgmk/maxresdefault.jpg",
      duration: "4:22"
    },
    {
      name: "Agar Tum Saath Ho",
      artist: "Arijit Singh, Alka Yagnik",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=sK7riqg2mr4",
      image: "https://i.ytimg.com/vi/sK7riqg2mr4/maxresdefault.jpg",
      duration: "5:41"
    },
    {
      name: "Kabira",
      artist: "Tochi Raina, Rekha Bhardwaj",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=jHNNMj5bNQw",
      image: "https://i.ytimg.com/vi/jHNNMj5bNQw/maxresdefault.jpg",
      duration: "3:43"
    },
    {
      name: "Phir Le Aya Dil",
      artist: "Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=PfLWwH5mNKg",
      image: "https://i.ytimg.com/vi/PfLWwH5mNKg/maxresdefault.jpg",
      duration: "5:05"
    },
    {
      name: "Ae Dil Hai Mushkil",
      artist: "Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=6FURuLYrR_Q",
      image: "https://i.ytimg.com/vi/6FURuLYrR_Q/maxresdefault.jpg",
      duration: "4:30"
    },
    {
      name: "Judaai",
      artist: "Rekha Bhardwaj, Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=zKo9nJvzHMw",
      image: "https://i.ytimg.com/vi/zKo9nJvzHMw/maxresdefault.jpg",
      duration: "4:32"
    },
    {
      name: "Hamari Adhuri Kahani",
      artist: "Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=f3FFOBrMmdg",
      image: "https://i.ytimg.com/vi/f3FFOBrMmdg/maxresdefault.jpg",
      duration: "5:10"
    },
    {
      name: "Humdard",
      artist: "Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=j6yq5QXjWZw",
      image: "https://i.ytimg.com/vi/j6yq5QXjWZw/maxresdefault.jpg",
      duration: "4:20"
    },
    {
      name: "Muskurane",
      artist: "Arijit Singh",
      mood: "sad",
      url: "https://www.youtube.com/watch?v=Ek8L3v5_Xtk",
      image: "https://i.ytimg.com/vi/Ek8L3v5_Xtk/maxresdefault.jpg",
      duration: "4:50"
    },
    {
      name: "Someone Like You",
      artist: "Adele",
      url: "https://www.youtube.com/watch?v=hLQl3WQQoQ0",
      image: "https://i.ytimg.com/vi/hLQl3WQQoQ0/maxresdefault.jpg",
      duration: "4:45"
    },
    {
      name: "Say Something",
      artist: "A Great Big World & Christina Aguilera",
      url: "https://www.youtube.com/watch?v=-2U0Ivkn2Ds",
      image: "https://i.ytimg.com/vi/-2U0Ivkn2Ds/maxresdefault.jpg",
      duration: "3:49"
    },
    {
      name: "All of Me",
      artist: "John Legend",
      url: "https://www.youtube.com/watch?v=450p7goxZqg",
      image: "https://i.ytimg.com/vi/450p7goxZqg/maxresdefault.jpg",
      duration: "4:29"
    }
  ],
  romantic: [
    {
      name: "Tum Se Hi",
      artist: "Mohit Chauhan",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=mt9xg0mmt28",
      image: "https://i.ytimg.com/vi/mt9xg0mmt28/maxresdefault.jpg",
      duration: "5:07"
    },
    {
      name: "Tere Sang Yaara",
      artist: "Atif Aslam",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=E8RPorI6bis",
      image: "https://i.ytimg.com/vi/E8RPorI6bis/maxresdefault.jpg",
      duration: "4:39"
    },
    {
      name: "Hawayein",
      artist: "Arijit Singh",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=cYOB941gyXI",
      image: "https://i.ytimg.com/vi/cYOB941gyXI/maxresdefault.jpg",
      duration: "4:49"
    },
    {
      name: "Gerua",
      artist: "Arijit Singh, Antara Mitra",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=AEIVhBS6baE",
      image: "https://i.ytimg.com/vi/AEIVhBS6baE/maxresdefault.jpg",
      duration: "5:45"
    },
    {
      name: "Raabta",
      artist: "Arijit Singh",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=zAU_rsoS5ok",
      image: "https://i.ytimg.com/vi/zAU_rsoS5ok/maxresdefault.jpg",
      duration: "4:03"
    },
    {
      name: "Tera Ban Jaunga",
      artist: "Akhil Sachdeva, Tulsi Kumar",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=mQiiw7uRngk",
      image: "https://i.ytimg.com/vi/mQiiw7uRngk/maxresdefault.jpg",
      duration: "3:57"
    },
    {
      name: "Pehli Nazar Mein",
      artist: "Atif Aslam",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=BadBAMnPX0I",
      image: "https://i.ytimg.com/vi/BadBAMnPX0I/maxresdefault.jpg",
      duration: "4:38"
    },
    {
      name: "Tere Liye",
      artist: "Atif Aslam, Shreya Ghoshal",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=_xG-eX2iXhw",
      image: "https://i.ytimg.com/vi/_xG-eX2iXhw/maxresdefault.jpg",
      duration: "4:42"
    },
    {
      name: "Jeena Jeena",
      artist: "Atif Aslam",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=1X9-0GW6Frs",
      image: "https://i.ytimg.com/vi/1X9-0GW6Frs/maxresdefault.jpg",
      duration: "3:49"
    },
    {
      name: "Kuch To Hai",
      artist: "Armaan Malik",
      mood: "romantic",
      url: "https://www.youtube.com/watch?v=BkjX0-pzPxg",
      image: "https://i.ytimg.com/vi/BkjX0-pzPxg/maxresdefault.jpg",
      duration: "4:15"
    },
    {
      name: "Perfect",
      artist: "Ed Sheeran",
      url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
      image: "https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg",
      duration: "4:39"
    },
    {
      name: "Just the Way You Are",
      artist: "Bruno Mars",
      url: "https://www.youtube.com/watch?v=LjhCEhWiKXk",
      image: "https://i.ytimg.com/vi/LjhCEhWiKXk/maxresdefault.jpg",
      duration: "3:40"
    },
    {
      name: "A Thousand Years",
      artist: "Christina Perri",
      url: "https://www.youtube.com/watch?v=rtOvBOTyX00",
      image: "https://i.ytimg.com/vi/rtOvBOTyX00/maxresdefault.jpg",
      duration: "4:45"
    }
  ],
  party: [
    {
      name: "Kar Gayi Chull",
      artist: "Badshah, Fazilpuria",
      mood: "party",
      url: "https://www.youtube.com/watch?v=NTHz9ephYTw",
      image: "https://i.ytimg.com/vi/NTHz9ephYTw/maxresdefault.jpg",
      duration: "2:56"
    },
    {
      name: "Saturday Saturday",
      artist: "Indeep Bakshi, Badshah",
      mood: "party",
      url: "https://www.youtube.com/watch?v=E3O8Q-_tAXo",
      image: "https://i.ytimg.com/vi/E3O8Q-_tAXo/maxresdefault.jpg",
      duration: "3:42"
    },
    {
      name: "Abhi Toh Party Shuru Hui Hai",
      artist: "Badshah, Aastha",
      mood: "party",
      url: "https://www.youtube.com/watch?v=8LZgzAZ2lpQ",
      image: "https://i.ytimg.com/vi/8LZgzAZ2lpQ/maxresdefault.jpg",
      duration: "3:12"
    },
    {
      name: "Lungi Dance",
      artist: "Yo Yo Honey Singh",
      mood: "party",
      url: "https://www.youtube.com/watch?v=r9-DM9uBtVI",
      image: "https://i.ytimg.com/vi/r9-DM9uBtVI/maxresdefault.jpg",
      duration: "3:43"
    },
    {
      name: "Chittiyaan Kalaiyaan",
      artist: "Meet Bros, Kanika Kapoor",
      mood: "party",
      url: "https://www.youtube.com/watch?v=zpsVpnvFfZQ",
      image: "https://i.ytimg.com/vi/zpsVpnvFfZQ/maxresdefault.jpg",
      duration: "3:42"
    },
    {
      name: "Nashe Si Chadh Gayi",
      artist: "Arijit Singh",
      mood: "party",
      url: "https://www.youtube.com/watch?v=Wd2B8OAotU8",
      image: "https://i.ytimg.com/vi/Wd2B8OAotU8/maxresdefault.jpg",
      duration: "3:56"
    },
    {
      name: "Desi Look",
      artist: "Kanika Kapoor",
      mood: "party",
      url: "https://www.youtube.com/watch?v=0IILJTQluKw",
      image: "https://i.ytimg.com/vi/0IILJTQluKw/maxresdefault.jpg",
      duration: "3:20"
    },
    {
      name: "Proper Patola",
      artist: "Badshah, Diljit Dosanjh",
      mood: "party",
      url: "https://www.youtube.com/watch?v=YmXJp4RtBCM",
      image: "https://i.ytimg.com/vi/YmXJp4RtBCM/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Kamariya",
      artist: "Aastha Gill, Divya Kumar",
      mood: "party",
      url: "https://www.youtube.com/watch?v=i0_m90T04uw",
      image: "https://i.ytimg.com/vi/i0_m90T04uw/maxresdefault.jpg",
      duration: "3:12"
    },
    {
      name: "Garmi",
      artist: "Badshah, Neha Kakkar",
      mood: "party",
      url: "https://www.youtube.com/watch?v=L_ZIeH4Yasw",
      image: "https://i.ytimg.com/vi/L_ZIeH4Yasw/maxresdefault.jpg",
      duration: "3:08"
    },
    {
      name: "I Gotta Feeling",
      artist: "The Black Eyed Peas",
      url: "https://www.youtube.com/watch?v=uSD4vsh1zDA",
      image: "https://i.ytimg.com/vi/uSD4vsh1zDA/maxresdefault.jpg",
      duration: "4:49"
    },
    {
      name: "Don't Stop the Music",
      artist: "Rihanna",
      url: "https://www.youtube.com/watch?v=yd8jh9QYfEs",
      image: "https://i.ytimg.com/vi/yd8jh9QYfEs/maxresdefault.jpg",
      duration: "4:27"
    },
    {
      name: "Dynamite",
      artist: "BTS",
      url: "https://www.youtube.com/watch?v=gdZLi9oWNZg",
      image: "https://i.ytimg.com/vi/gdZLi9oWNZg/maxresdefault.jpg",
      duration: "3:43"
    }
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
    
    // Return predefined songs for the selected mood
    const moodSongsList = moodSongs[mood] || [];
    
    // Map the songs to our required format
    const formattedSongs = moodSongsList.map(song => ({
      id: song.url.split('v=')[1] || song.url.split('/').pop(), // Extract video ID from URL
      name: song.name,
      artist: song.artist,
      mood: mood,
      url: song.url,
      image: song.image,
      duration: song.duration,
      language: "hindi",
      primaryArtists: song.artist
    }));

    console.log(`Returning ${formattedSongs.length} songs for mood: ${mood}`);
    return formattedSongs;
  } catch (error) {
    console.error('Error in getMoodBasedSongs:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

// Helper function to format duration from seconds to MM:SS
function formatDuration(seconds) {
  if (!seconds) return "3:30"; // Default duration if not provided
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 