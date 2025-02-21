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
        name: "Ve Kamleya",
        artist: "Arijit Singh",
        url: "https://youtu.be/IYK34I7y5O8?si=2t88lplAE65tWsxo",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoJkXvPVomVpv9cKbDcwl9YAioQxmCRI_WTU3mO0Tvdn8l2sKCcbAAFMAcwZeSgoezgl4&usqp=CAU",
        duration: "4:45"
      },
      {
        id: "as2",
        name: "Tera Chehra",
        artist: "Arijit Singh",
        url: "https://youtu.be/LOmC1dlZ2BE?si=39Yyxd2wZ_ysA5iz",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEx6kF06iGOwkoxpT7aPhy8miY9DF477fduHcWAJ7KuQz1WXFyYjpCpUAGCgK96cBQXy4&usqp=CAU",
        duration: "4:38"
      },
      {
        id: "as3",
        name: "Tera Hone Laga Hoon",
        artist: "Arijit Singh",
        url: "https://youtu.be/rLR37BR88T0?si=vIkbedI0Tpr1nQd7",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsub5XVj0stErbJgpwuE3763gigxtFJrL-4QzKOWfzTuhZ_DrkWwTQtg5XGQHUrewUpk8&usqp=CAU",
        duration: "4:30"
      }
    ]
  },
  {
    id: "2",
    name: "Shreya Ghoshal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLL8HBRHac3Rh3rPQiZNnWATP9DRL8qupUPg&s",
    topSongs: [
      {
        id: "sg1",
        name: "Ami Je Tomar",
        artist: "Shreya Ghoshal",
        url: "https://youtu.be/FGNc3BibU3o?si=PaOXRnVWc81MHPPm",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaAxfJiYff-Q2Ds525g2Ls3iBuYliii6zLRAY3L7rGKbA-tkisycmZ4O9DaHQ5uZ7onf0&usqp=CAU",
        duration: "5:13"
      },
      {
        id: "sg2",
        name: "Jaadu Hai Nasha Hai",
        artist: "Shreya Ghoshal",
        url: "https://youtu.be/T_MPeEX-aIs?si=a6QPLoo2NMa5VOtQ",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPIktM9XKKC7h65YPnQLpTuAL3Ni-oVOk-6YbiMwu5niMTalqfjlsckzenDeDNNvu9kJQ&usqp=CAU",
        duration: "4:45"
      },
      {
        id: "sg3",
        name: "Sun Raha Hai Na Tu",
        artist: "Shreya Ghoshal",
        url: "https://youtu.be/inEu2qQuGZ8?si=DLFzyE6l2NFSBt0m",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmR90AdydgAjESLBS14FLEzGbkgDr9lzdwH8_kncT84S4btr5XpRcOZjsMguy8ZVE_MQc&usqp=CAU",
        duration: "5:00"
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
        name: "Pehli Dafa ",
        artist: "Atif Aslam",
        url: "https://youtu.be/SxTYjptEzZs?si=y2zh46a7-Ac-POzG",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFICIglYIqu6Zk5njY11CL5Xug67vUuzmuxg&s",
        duration: "4:43"
      },
      {
        id: "aa2",
        name: "Jeene Laga Hoon",
        artist: "Atif Aslam",
        url: "https://youtu.be/qpIdoaaPa6U?si=h0VAuNz1VRHMH60v",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSN221T63pQn0p0kPQSSgcUZI875vs7m_znQ&s",
        duration: "4:10"
      },
      {
        id: "aa3",
        name: "Dil Diyan Gallan",
        artist: "Atif Aslam",
        url: "https://youtu.be/SAcpESN_Fk4?si=259uU_Z_40gbee84",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzoCUiRECbhvlXPCLPzBfNdrFv9PZzXqyDNSUnOgL0taC5lKPacFvffXle6OKkXtinPog&usqp=CAU",
        duration: "5:00"
      }
    ]
  },
  {
    id: "4",
    name: "Shankar Mahadevan",
    image: "https://www.millenniumpost.in/h-upload/2022/12/01/656365-shankar.jpg",
    topSongs: [
      {
        id: "sm1",
        name: "Shiv Tandav Stotram",
        artist: "Shankar Mahadevan",
        url: "https://youtu.be/S980-z1qx3g?si=5EgS4seiuzwhF3gD",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBDc4TCQwZuRcXvX9BHc8qyQyxKkR3xxV16A&s",
        duration: "9:14"
      },
      {
        id: "sm2",
        name: "Breathless",
        artist: "Shankar Mahadevan",
        url: "https://youtu.be/9tXtv8XE6lU?si=vZp7hzq3s-vtNF5T",
        image: "https://i.ytimg.com/vi/-eFqg8JnohY/maxresdefault.jpg",
        duration: "6:07"
      },
      {
        id: "sm3",
        name: "Mitwa",
        artist: "Shankar Mahadevan",
        url: "https://youtu.be/ru_5PA8cwkE?si=YTQ1hggstwgCgoxX",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmUd5LRbK-9yf2IRtvSkIHBkvhhM4HutCU_8zZkuTZOgznCK-9yEvjrFTUgjWfzriUzKY&usqp=CAU",
        duration: "6:01"
      }
    ]
  },
  {
    id: "5",
    name: "Kumar Sanu",
    image: "https://c.saavncdn.com/artists/Kumar_Sanu_500x500.jpg",
    topSongs: [
      {
        id: "ks1",
        name: "Tujhe Dekha To",
        artist: "Kumar Sanu",
        url: "https://www.youtube.com/watch?v=example13",
        image: "https://example.com/tujhe_dekha_to.jpg",
        duration: "4:45"
      },
      {
        id: "ks2",
        name: "Mera Dil Bhi Kitna Pagal Hai",
        artist: "Kumar Sanu",
        url: "https://www.youtube.com/watch?v=example14",
        image: "https://example.com/mera_dil.jpg",
        duration: "5:10"
      },
      {
        id: "ks3",
        name: "Baazigar O Baazigar",
        artist: "Kumar Sanu",
        url: "https://www.youtube.com/watch?v=example15",
        image: "https://example.com/baazigar.jpg",
        duration: "4:30"
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
  },
  {
    id: "7",
    name: "Jubin Nautiyal",
    image: "https://a10.gaanacdn.com/gn_img/artists/10q3ZR1352/0q3Z6Lg135/size_m_1716892887.jpg",
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


