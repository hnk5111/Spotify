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
      },
      {
        id: "aa4",
        name: "Tum",
        artist: "Atif Aslam",
        url: "https://youtu.be/PZtFYkMYyJA?si=0kuxZ2GmY0KL_MYR",
        image: "https://c.saavncdn.com/334/Laila-Majnu-Hindi-2018-20190506111426-500x500.jpg",
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
    name: "Anuv Jain",
    image: "data:image/jpeg;base64,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",
    topSongs: [
      {
        id: "aj1",
        name: "Jo Tum Mere Ho",
        artist: "Anuv Jain",
        url: "https://youtu.be/wmUJwQNGK3k?si=bF-7vfUKHgpzk8GI",
        image: "https://c.saavncdn.com/401/Jo-Tum-Mere-Ho-Hindi-2024-20240731053953-500x500.jpg",
        duration: "4:16"
      },
      {
        id: "aj2",
        name: "HUSN",
        artist: "Anuv Jain",
        url: "https://youtu.be/0IIJxkDtkHY?si=a91WIDaRhTetuDwx",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFwF5VzBJz86hT86PPi_xtI4DJ_rXgUCGVDw&s",
        duration: "3:38"
      },
      {
        id: "aj3",
        name: "Gul",
        artist: "Anuv Jain",
        url: "https://youtu.be/SmaY7RfBgas?si=GCzmVb6hOi_xYdW7",
        image: "https://c.saavncdn.com/266/Gul-Hindi-2021-20210706151615-500x500.jpg",
        duration: "3:45"
      },
      {
        id: "aj4",
        name: "Alag Aasmaan",
        artist: "Anuv Jain",
        url: "https://youtu.be/vA86QFrXoho?si=iQIbBTGqL5FtruX2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRocycieuWyQsuCzams5gjm-IBnuczFTn188g&s",
        duration: "3:46"
      },
      {
        id: "aj5",
        name: "Baarishein",
        artist: "Anuv Jain",
        url: "https://youtu.be/PJWemSzExXs?si=DqLCiLncgzkZt0vj",
        image: "https://c.saavncdn.com/520/Baarishein-English-2018-20180522204131-500x500.jpg",
        duration: "3:28"
      }
    ]
  },
  {
    id: "6",
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


