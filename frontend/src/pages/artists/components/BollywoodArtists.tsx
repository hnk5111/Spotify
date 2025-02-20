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

const bollywoodArtists: Artist[] = [
  {
    id: "1",
    name: "Arijit Singh",
    image: "https://c.saavncdn.com/artists/Arijit_Singh_002_20230323062147_500x500.jpg",
    topSongs: [
      {
        id: "as1",
        name: "Tum Hi Ho",
        artist: "Arijit Singh",
        url: "https://www.youtube.com/watch?v=Umqb9KENgmk",
        image: "https://i.ytimg.com/vi/Umqb9KENgmk/maxresdefault.jpg",
        duration: "4:22"
      },
      {
        id: "as2",
        name: "Channa Mereya",
        artist: "Arijit Singh",
        url: "https://www.youtube.com/watch?v=284Ov7ysmfA",
        image: "https://i.ytimg.com/vi/284Ov7ysmfA/maxresdefault.jpg",
        duration: "4:49"
      },
      {
        id: "as3",
        name: "Gerua",
        artist: "Arijit Singh",
        url: "https://www.youtube.com/watch?v=AEIVhBS6baE",
        image: "https://i.ytimg.com/vi/AEIVhBS6baE/maxresdefault.jpg",
        duration: "5:45"
      }
    ]
  },
  {
    id: "2",
    name: "Neha Kakkar",
    image: "data:image/jpeg;base64,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",
    topSongs: [
      {
        id: "nk1",
        name: "Dilbar",
        artist: "Neha Kakkar",
        url: "https://www.youtube.com/watch?v=JFcgOboQZ08",
        image: "https://i.ytimg.com/vi/JFcgOboQZ08/maxresdefault.jpg",
        duration: "3:29"
      },
      {
        id: "nk2",
        name: "Aankh Marey",
        artist: "Neha Kakkar",
        url: "https://www.youtube.com/watch?v=5MxvgXZNc-0",
        image: "https://i.ytimg.com/vi/5MxvgXZNc-0/maxresdefault.jpg",
        duration: "3:32"
      },
      {
        id: "nk3",
        name: "Garmi",
        artist: "Neha Kakkar",
        url: "https://www.youtube.com/watch?v=L_ZIeH4Yasw",
        image: "https://i.ytimg.com/vi/L_ZIeH4Yasw/maxresdefault.jpg",
        duration: "3:08"
      }
    ]
  },
  {
    id: "3",
    name: "Atif Aslam",
    image: "https://c.saavncdn.com/artists/Atif_Aslam_500x500.jpg",
    topSongs: [
      {
        id: "aa1",
        name: "Jeena Jeena",
        artist: "Atif Aslam",
        url: "https://www.youtube.com/watch?v=1X9-0GW6Frs",
        image: "https://i.ytimg.com/vi/1X9-0GW6Frs/maxresdefault.jpg",
        duration: "3:49"
      },
      {
        id: "aa2",
        name: "Pehli Nazar Mein",
        artist: "Atif Aslam",
        url: "https://www.youtube.com/watch?v=BadBAMnPX0I",
        image: "https://i.ytimg.com/vi/BadBAMnPX0I/maxresdefault.jpg",
        duration: "4:38"
      },
      {
        id: "aa3",
        name: "Dil Diyan Gallan",
        artist: "Atif Aslam",
        url: "https://www.youtube.com/watch?v=SAcpESN_Fk4",
        image: "https://i.ytimg.com/vi/SAcpESN_Fk4/maxresdefault.jpg",
        duration: "4:20"
      }
    ]
  },
  {
    id: "4",
    name: "Shreya Ghoshal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLL8HBRHac3Rh3rPQiZNnWATP9DRL8qupUPg&s",
    topSongs: [
      {
        id: "sg1",
        name: "Param Sundari",
        artist: "Shreya Ghoshal",
        url: "https://www.youtube.com/watch?v=w4ClQO0FFQg",
        image: "https://i.ytimg.com/vi/w4ClQO0FFQg/maxresdefault.jpg",
        duration: "3:48"
      },
      {
        id: "sg2",
        name: "Manwa Laage",
        artist: "Shreya Ghoshal",
        url: "https://www.youtube.com/watch?v=d8IT-16kA8M",
        image: "https://i.ytimg.com/vi/d8IT-16kA8M/maxresdefault.jpg",
        duration: "4:30"
      },
      {
        id: "sg3",
        name: "Teri Meri",
        artist: "Shreya Ghoshal",
        url: "https://www.youtube.com/watch?v=QmW9G4w9gTc",
        image: "https://i.ytimg.com/vi/QmW9G4w9gTc/maxresdefault.jpg",
        duration: "4:25"
      }
    ]
  },
  {
    id: "5",
    name: "Jubin Nautiyal",
    image: "data:image/jpeg;base64,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",
    topSongs: [
      {
        id: "jn1",
        name: "Raatan Lambiyan",
        artist: "Jubin Nautiyal",
        url: "https://www.youtube.com/watch?v=gvyUuxdRdR4",
        image: "https://i.ytimg.com/vi/gvyUuxdRdR4/maxresdefault.jpg",
        duration: "3:50"
      },
      {
        id: "jn2",
        name: "Lut Gaye",
        artist: "Jubin Nautiyal",
        url: "https://www.youtube.com/watch?v=sCbbMZ-q4-I",
        image: "https://i.ytimg.com/vi/sCbbMZ-q4-I/maxresdefault.jpg",
        duration: "4:57"
      },
      {
        id: "jn3",
        name: "Tum Hi Aana",
        artist: "Jubin Nautiyal",
        url: "https://www.youtube.com/watch?v=tLsJQ5srVQA",
        image: "https://i.ytimg.com/vi/tLsJQ5srVQA/maxresdefault.jpg",
        duration: "4:25"
      }
    ]
  },
  {
    id: "6",
    name: "Sonu Nigam",
    image: "https://c.saavncdn.com/artists/Sonu_Nigam_500x500.jpg",
    topSongs: [
      {
        id: "sn1",
        name: "Kal Ho Naa Ho",
        artist: "Sonu Nigam",
        url: "https://www.youtube.com/watch?v=g0eO74UmRBs",
        image: "https://i.ytimg.com/vi/g0eO74UmRBs/maxresdefault.jpg",
        duration: "5:21"
      },
      {
        id: "sn2",
        name: "Suraj Hua Maddham",
        artist: "Sonu Nigam",
        url: "https://www.youtube.com/watch?v=L4FmY6tuCwY",
        image: "https://i.ytimg.com/vi/L4FmY6tuCwY/maxresdefault.jpg",
        duration: "6:22"
      },
      {
        id: "sn3",
        name: "Main Hoon Na",
        artist: "Sonu Nigam",
        url: "https://www.youtube.com/watch?v=OxzF5HyiUBw",
        image: "https://i.ytimg.com/vi/OxzF5HyiUBw/maxresdefault.jpg",
        duration: "5:03"
      }
    ]
  }
];

const BollywoodArtists = () => {
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
      {bollywoodArtists.map((artist) => (
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

export default BollywoodArtists; 


