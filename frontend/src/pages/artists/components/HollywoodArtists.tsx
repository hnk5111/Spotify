import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface Artist {
  id: string;
  name: string;
  image: string;
  topSongs: Song[];
}

interface Song {
  id: string;
  name: string;
  artist: string;
  url: string;
  image: string;
  duration: string;
}

const hollywoodArtists: Artist[] = [
  {
    id: "1",
    name: "Ed Sheeran",
    image: "https://c.saavncdn.com/artists/Ed_Sheeran_500x500.jpg",
    topSongs: [
      {
        id: "es1",
        name: "Shape of You",
        artist: "Ed Sheeran",
        url: "https://www.youtube.com/watch?v=example1",
        image: "https://example.com/shape_of_you.jpg",
        duration: "3:53"
      },
      {
        id: "es2",
        name: "Perfect",
        artist: "Ed Sheeran",
        url: "https://www.youtube.com/watch?v=example2",
        image: "https://example.com/perfect.jpg",
        duration: "4:23"
      },
      {
        id: "es3",
        name: "Castle on the Hill",
        artist: "Ed Sheeran",
        url: "https://www.youtube.com/watch?v=example3",
        image: "https://example.com/castle_on_the_hill.jpg",
        duration: "4:21"
      }
    ]
  },
  {
    id: "2",
    name: "Adele",
    image: "https://c.saavncdn.com/artists/Adele_500x500.jpg",
    topSongs: [
      {
        id: "ad1",
        name: "Hello",
        artist: "Adele",
        url: "https://www.youtube.com/watch?v=example4",
        image: "https://example.com/hello.jpg",
        duration: "4:55"
      },
      {
        id: "ad2",
        name: "Someone Like You",
        artist: "Adele",
        url: "https://www.youtube.com/watch?v=example5",
        image: "https://example.com/someone_like_you.jpg",
        duration: "4:45"
      },
      {
        id: "ad3",
        name: "Rolling in the Deep",
        artist: "Adele",
        url: "https://www.youtube.com/watch?v=example6",
        image: "https://example.com/rolling_in_the_deep.jpg",
        duration: "3:48"
      }
    ]
  },
  {
    id: "3",
    name: "Taylor Swift",
    image: "https://c.saavncdn.com/artists/Taylor_Swift_500x500.jpg",
    topSongs: [
      {
        id: "ts1",
        name: "Shake It Off",
        artist: "Taylor Swift",
        url: "https://www.youtube.com/watch?v=example7",
        image: "https://example.com/shake_it_off.jpg",
        duration: "3:39"
      },
      {
        id: "ts2",
        name: "Blank Space",
        artist: "Taylor Swift",
        url: "https://www.youtube.com/watch?v=example8",
        image: "https://example.com/blank_space.jpg",
        duration: "3:51"
      },
      {
        id: "ts3",
        name: "Love Story",
        artist: "Taylor Swift",
        url: "https://www.youtube.com/watch?v=example9",
        image: "https://example.com/love_story.jpg",
        duration: "3:55"
      }
    ]
  },
  {
    id: "4",
    name: "Bruno Mars",
    image: "https://c.saavncdn.com/artists/Bruno_Mars_500x500.jpg",
    topSongs: [
      {
        id: "bm1",
        name: "Uptown Funk",
        artist: "Bruno Mars",
        url: "https://www.youtube.com/watch?v=example10",
        image: "https://example.com/uptown_funk.jpg",
        duration: "4:30"
      },
      {
        id: "bm2",
        name: "Just the Way You Are",
        artist: "Bruno Mars",
        url: "https://www.youtube.com/watch?v=example11",
        image: "https://example.com/just_the_way_you_are.jpg",
        duration: "3:40"
      },
      {
        id: "bm3",
        name: "Grenade",
        artist: "Bruno Mars",
        url: "https://www.youtube.com/watch?v=example12",
        image: "https://example.com/grenade.jpg",
        duration: "3:42"
      }
    ]
  },
  {
    id: "5",
    name: "The Weeknd",
    image: "https://c.saavncdn.com/artists/The_Weeknd_500x500.jpg",
    topSongs: [
      {
        id: "tw1",
        name: "Blinding Lights",
        artist: "The Weeknd",
        url: "https://www.youtube.com/watch?v=example13",
        image: "https://example.com/blinding_lights.jpg",
        duration: "3:20"
      },
      {
        id: "tw2",
        name: "Starboy",
        artist: "The Weeknd",
        url: "https://www.youtube.com/watch?v=example14",
        image: "https://example.com/starboy.jpg",
        duration: "3:50"
      },
      {
        id: "tw3",
        name: "Can't Feel My Face",
        artist: "The Weeknd",
        url: "https://www.youtube.com/watch?v=example15",
        image: "https://example.com/cant_feel_my_face.jpg",
        duration: "3:36"
      }
    ]
  },
  {
    id: "6",
    name: "Drake",
    image: "https://c.saavncdn.com/artists/Drake_500x500.jpg",
    topSongs: [
      {
        id: "dr1",
        name: "Rich Flex",
        artist: "Drake, 21 Savage",
        url: "https://www.youtube.com/watch?v=I4DjHHVHWAE",
        image: "https://i.ytimg.com/vi/I4DjHHVHWAE/maxresdefault.jpg",
        duration: "3:59"
      },
      {
        id: "dr2",
        name: "Jimmy Cooks",
        artist: "Drake ft. 21 Savage",
        url: "https://www.youtube.com/watch?v=0V1tWpDJDn0",
        image: "https://i.ytimg.com/vi/0V1tWpDJDn0/maxresdefault.jpg",
        duration: "3:38"
      },
      {
        id: "dr3",
        name: "Spin Bout U",
        artist: "Drake, 21 Savage",
        url: "https://www.youtube.com/watch?v=qOgC_PPQFXg",
        image: "https://i.ytimg.com/vi/qOgC_PPQFXg/maxresdefault.jpg",
        duration: "3:45"
      }
    ]
  },
  {
    id: "7",
    name: "Dua Lipa",
    image: "https://c.saavncdn.com/artists/Dua_Lipa_500x500.jpg",
    topSongs: [
      {
        id: "dl1",
        name: "Dance The Night",
        artist: "Dua Lipa",
        url: "https://www.youtube.com/watch?v=OZnBt2W48A0",
        image: "https://i.ytimg.com/vi/OZnBt2W48A0/maxresdefault.jpg",
        duration: "3:15"
      },
      {
        id: "dl2",
        name: "Levitating",
        artist: "Dua Lipa",
        url: "https://www.youtube.com/watch?v=TUVcZfQe-Kw",
        image: "https://i.ytimg.com/vi/TUVcZfQe-Kw/maxresdefault.jpg",
        duration: "3:23"
      },
      {
        id: "dl3",
        name: "Don't Start Now",
        artist: "Dua Lipa",
        url: "https://www.youtube.com/watch?v=oygrmJFKYZY",
        image: "https://i.ytimg.com/vi/oygrmJFKYZY/maxresdefault.jpg",
        duration: "3:03"
      }
    ]
  },
  {
    id: "8",
    name: "SZA",
    image: "https://c.saavncdn.com/artists/SZA_500x500.jpg",
    topSongs: [
      {
        id: "sz1",
        name: "Kill Bill",
        artist: "SZA",
        url: "https://www.youtube.com/watch?v=hbnPkK76Ask",
        image: "https://i.ytimg.com/vi/hbnPkK76Ask/maxresdefault.jpg",
        duration: "2:33"
      },
      {
        id: "sz2",
        name: "Snooze",
        artist: "SZA",
        url: "https://www.youtube.com/watch?v=2d-CgqHkqbI",
        image: "https://i.ytimg.com/vi/2d-CgqHkqbI/maxresdefault.jpg",
        duration: "3:21"
      },
      {
        id: "sz3",
        name: "Nobody Gets Me",
        artist: "SZA",
        url: "https://www.youtube.com/watch?v=EbNxGK8FcTk",
        image: "https://i.ytimg.com/vi/EbNxGK8FcTk/maxresdefault.jpg",
        duration: "3:00"
      }
    ]
  },
  {
    id: "9",
    name: "Miley Cyrus",
    image: "https://c.saavncdn.com/artists/Miley_Cyrus_500x500.jpg",
    topSongs: [
      {
        id: "mc1",
        name: "Flowers",
        artist: "Miley Cyrus",
        url: "https://www.youtube.com/watch?v=G7KNmW9a75Y",
        image: "https://i.ytimg.com/vi/G7KNmW9a75Y/maxresdefault.jpg",
        duration: "3:20"
      },
      {
        id: "mc2",
        name: "Used to Be Young",
        artist: "Miley Cyrus",
        url: "https://www.youtube.com/watch?v=b4v9BHqeOgM",
        image: "https://i.ytimg.com/vi/b4v9BHqeOgM/maxresdefault.jpg",
        duration: "3:22"
      },
      {
        id: "mc3",
        name: "River",
        artist: "Miley Cyrus",
        url: "https://www.youtube.com/watch?v=MMK2VO_-Kx0",
        image: "https://i.ytimg.com/vi/MMK2VO_-Kx0/maxresdefault.jpg",
        duration: "3:10"
      }
    ]
  },
  {
    id: "10",
    name: "Lana Del Rey",
    image: "https://c.saavncdn.com/artists/Lana_Del_Rey_500x500.jpg",
    topSongs: [
      {
        id: "ldr1",
        name: "Say Yes To Heaven",
        artist: "Lana Del Rey",
        url: "https://www.youtube.com/watch?v=MGQXGnLR3-E",
        image: "https://i.ytimg.com/vi/MGQXGnLR3-E/maxresdefault.jpg",
        duration: "3:56"
      },
      {
        id: "ldr2",
        name: "Summertime Sadness",
        artist: "Lana Del Rey",
        url: "https://www.youtube.com/watch?v=TdrL3QxjyVw",
        image: "https://i.ytimg.com/vi/TdrL3QxjyVw/maxresdefault.jpg",
        duration: "4:25"
      },
      {
        id: "ldr3",
        name: "A&W",
        artist: "Lana Del Rey",
        url: "https://www.youtube.com/watch?v=RKz6gqWXWuA",
        image: "https://i.ytimg.com/vi/RKz6gqWXWuA/maxresdefault.jpg",
        duration: "7:14"
      },
      {
        id: "ldr4",
        name: "Video Games",
        artist: "Lana Del Rey",
        url: "https://www.youtube.com/watch?v=cE6wxDqdOV0",
        image: "https://i.ytimg.com/vi/cE6wxDqdOV0/maxresdefault.jpg",
        duration: "4:42"
      },
      {
        id: "ldr5",
        name: "Young and Beautiful",
        artist: "Lana Del Rey",
        url: "https://www.youtube.com/watch?v=o_1aF54DO60",
        image: "https://i.ytimg.com/vi/o_1aF54DO60/maxresdefault.jpg",
        duration: "3:56"
      }
    ]
  }
];

const HollywoodArtists = () => {
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

  const handlePlayPause = (song: Song) => {
    if (currentSong?._id === song.id && isPlaying) {
      togglePlay();
    } else {
      setCurrentSong({
        _id: song.id,
        title: song.name,
        artist: song.artist,
        imageUrl: song.image,
        audioUrl: song.url,
        duration: parseInt(song.duration.split(":")[0]) * 60 + parseInt(song.duration.split(":")[1]),
        albumId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hollywoodArtists.map((artist) => (
        <Card
          key={artist.id}
          className="bg-zinc-800/50 border-zinc-700 p-4 transition-all duration-300 hover:bg-zinc-800"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <h3 className="text-xl font-semibold">{artist.name}</h3>
                <button
                  onClick={() => setExpandedArtist(expandedArtist === artist.id ? null : artist.id)}
                  className="text-sm text-primary hover:underline mt-1"
                >
                  {expandedArtist === artist.id ? "Show less" : "View top songs"}
                </button>
              </div>
            </div>

            {expandedArtist === artist.id && (
              <div className="space-y-3">
                {artist.topSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-lg hover:bg-zinc-900"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={song.image} 
                        alt={song.name} 
                        className="w-12 h-12 rounded object-cover"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-medium">{song.name}</p>
                        <p className="text-sm text-zinc-400">{song.duration}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayPause(song)}
                      className="p-2 hover:bg-primary/20 rounded-full transition-colors"
                    >
                      {currentSong?._id === song.id && isPlaying ? (
                        <Pause className="size-5" />
                      ) : (
                        <Play className="size-5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HollywoodArtists; 