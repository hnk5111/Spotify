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
      name: "Matargashti",
      artist: " Mohit Chauhan ",
      url: "https://youtu.be/iid7cxx0keU?si=41DP-PUb5S6RhXmz",
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
      url: "https://youtu.be/T4tedh_11hg?si=CIBsWHb6Mi8zulPo",
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
    },
    {
      name: "Dance Monkey",
      artist: "Tones and I",
      url: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
      image: "https://i.ytimg.com/vi/q0hyYWKXF0Q/maxresdefault.jpg",
      duration: "3:29"
    },
    {
      name: "Cheap Thrills",
      artist: "Sia ft. Sean Paul",
      url: "https://www.youtube.com/watch?v=nYh-n7EOtMA",
      image: "https://i.ytimg.com/vi/nYh-n7EOtMA/maxresdefault.jpg",
      duration: "3:31"
    },
    {
      name: "Shake It Off",
      artist: "Taylor Swift",
      url: "https://www.youtube.com/watch?v=nfWlot6h_JM",
      image: "https://i.ytimg.com/vi/nfWlot6h_JM/maxresdefault.jpg",
      duration: "3:39"
    },
    {
      name: "Malang Sajna",
      artist: "Sachet-Parampara",
      url: "https://www.youtube.com/watch?v=2GN0T8UxvlQ",
      image: "https://i.ytimg.com/vi/2GN0T8UxvlQ/maxresdefault.jpg",
      duration: "3:25"
    },
    {
      name: "Bom Diggy Diggy",
      artist: "Zack Knight, Jasmin Walia",
      url: "https://www.youtube.com/watch?v=yIIGQB6EMAM",
      image: "https://i.ytimg.com/vi/yIIGQB6EMAM/maxresdefault.jpg",
      duration: "3:22"
    },
    {
      name: "Dil Chori",
      artist: "Yo Yo Honey Singh",
      url: "https://www.youtube.com/watch?v=1RxqaEy94nk",
      image: "https://i.ytimg.com/vi/1RxqaEy94nk/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Naach Meri Rani",
      artist: "Guru Randhawa, Nikhita Gandhi",
      url: "https://www.youtube.com/watch?v=X9B5B3KiYxQ",
      image: "https://i.ytimg.com/vi/X9B5B3KiYxQ/maxresdefault.jpg",
      duration: "3:30"
    },
    {
      name: "Aankh Marey",
      artist: "Neha Kakkar, Mika Singh",
      url: "https://www.youtube.com/watch?v=5MxvgXZNc-0",
      image: "https://i.ytimg.com/vi/5MxvgXZNc-0/maxresdefault.jpg",
      duration: "3:32"
    },
    {
      name: "Coca Cola",
      artist: "Tony Kakkar, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=_cPHiwPqbqo",
      image: "https://i.ytimg.com/vi/_cPHiwPqbqo/maxresdefault.jpg",
      duration: "3:20"
    },
    {
      name: "Garmi",
      artist: "Badshah, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=L_ZIeH4Yasw",
      image: "https://i.ytimg.com/vi/L_ZIeH4Yasw/maxresdefault.jpg",
      duration: "3:08"
    },
    {
      name: "Morni Banke",
      artist: "Guru Randhawa, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=g1Nz2KOoFJs",
      image: "https://i.ytimg.com/vi/g1Nz2KOoFJs/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Lamborghini",
      artist: "Diljit Dosanjh",
      url: "https://www.youtube.com/watch?v=GuqlX_rqN4k",
      image: "https://i.ytimg.com/vi/GuqlX_rqN4k/maxresdefault.jpg",
      duration: "3:35"
    },
    {
      name: "Dheeme Dheeme",
      artist: "Tony Kakkar",
      url: "https://www.youtube.com/watch?v=9mWdw-09dso",
      image: "https://i.ytimg.com/vi/9mWdw-09dso/maxresdefault.jpg",
      duration: "3:28"
    },
    {
      name: "Hauli Hauli",
      artist: "Garry Sandhu, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=k1MbYE_7yfc",
      image: "https://i.ytimg.com/vi/k1MbYE_7yfc/maxresdefault.jpg",
      duration: "3:15"
    },
    {
      name: "Nikle Currant",
      artist: "Jassi Gill, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=tXzh-TB-d9c",
      image: "https://i.ytimg.com/vi/tXzh-TB-d9c/maxresdefault.jpg",
      duration: "3:40"
    },
    {
      name: "Dilbar",
      artist: "Neha Kakkar, Dhvani Bhanushali",
      url: "https://www.youtube.com/watch?v=JFcgOboQZ08",
      image: "https://i.ytimg.com/vi/JFcgOboQZ08/maxresdefault.jpg",
      duration: "3:29"
    },
    {
      name: "Saki Saki",
      artist: "Neha Kakkar, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=gxJ_xZAssqg",
      image: "https://i.ytimg.com/vi/gxJ_xZAssqg/maxresdefault.jpg",
      duration: "3:33"
    },
    {
      name: "Tum Hi Ho Bandhu",
      artist: "Kavita Seth, Neeraj Shridhar",
      url: "https://www.youtube.com/watch?v=z3UHfi9vpbc",
      image: "https://i.ytimg.com/vi/z3UHfi9vpbc/maxresdefault.jpg",
      duration: "4:31"
    },
    {
      name: "Dil Dhadakne Do",
      artist: "Priyanka Chopra, Farhan Akhtar",
      url: "https://www.youtube.com/watch?v=WvdXhMkqkTc",
      image: "https://i.ytimg.com/vi/WvdXhMkqkTc/maxresdefault.jpg",
      duration: "3:47"
    },
    {
      name: "Ainvayi Ainvayi",
      artist: "Salim-Sulaiman",
      url: "https://www.youtube.com/watch?v=pElk1ShPrcE",
      image: "https://i.ytimg.com/vi/pElk1ShPrcE/maxresdefault.jpg",
      duration: "4:25"
    },
    {
      name: "Desi Girl",
      artist: "Shankar-Ehsaan-Loy",
      url: "https://www.youtube.com/watch?v=RX7TA3ezjHc",
      image: "https://i.ytimg.com/vi/RX7TA3ezjHc/maxresdefault.jpg",
      duration: "4:20"
    },
    {
      name: "Dhoom Machale",
      artist: "Sunidhi Chauhan",
      url: "https://www.youtube.com/watch?v=3n6RsyW-FAI",
      image: "https://i.ytimg.com/vi/3n6RsyW-FAI/maxresdefault.jpg",
      duration: "4:45"
    },
    {
      name: "Radha",
      artist: "Shreya Ghoshal, Vishal-Shekhar",
      url: "https://www.youtube.com/watch?v=X9_Ml4t0F-g",
      image: "https://i.ytimg.com/vi/X9_Ml4t0F-g/maxresdefault.jpg",
      duration: "4:05"
    },
    {
      name: "Tune Maari Entriyaan",
      artist: "Vishal Dadlani, Bappi Lahiri",
      url: "https://www.youtube.com/watch?v=Jn5hsfbhWx4",
      image: "https://i.ytimg.com/vi/Jn5hsfbhWx4/maxresdefault.jpg",
      duration: "4:15"
    },
    {
      name: "Chammak Challo",
      artist: "Akon, Hamsika Iyer",
      url: "https://www.youtube.com/watch?v=yJB5v-ZxHbs",
      image: "https://i.ytimg.com/vi/yJB5v-ZxHbs/maxresdefault.jpg",
      duration: "3:42"
    },
    {
      name: "Dard-E-Disco",
      artist: "Sukhwinder Singh",
      url: "https://www.youtube.com/watch?v=jP3_jB_b6YE",
      image: "https://i.ytimg.com/vi/jP3_jB_b6YE/maxresdefault.jpg",
      duration: "4:35"
    },
    {
      name: "Zingaat Hindi",
      artist: "Ajay-Atul",
      url: "https://www.youtube.com/watch?v=sN9U0wRgeLg",
      image: "https://i.ytimg.com/vi/sN9U0wRgeLg/maxresdefault.jpg",
      duration: "3:25"
    },
    {
      name: "Ghagra",
      artist: "Rekha Bhardwaj, Vishal Dadlani",
      url: "https://www.youtube.com/watch?v=caoGNx1LF2Q",
      image: "https://i.ytimg.com/vi/caoGNx1LF2Q/maxresdefault.jpg",
      duration: "5:05"
    },
    {
      name: "Malhari",
      artist: "Vishal Dadlani",
      url: "https://www.youtube.com/watch?v=l_MyUGq7pgs",
      image: "https://i.ytimg.com/vi/l_MyUGq7pgs/maxresdefault.jpg",
      duration: "3:35"
    },
    {
      name: "Nagada Sang Dhol",
      artist: "Shreya Ghoshal, Osman Mir",
      url: "https://www.youtube.com/watch?v=X_8m-lHt6AU",
      image: "https://i.ytimg.com/vi/X_8m-lHt6AU/maxresdefault.jpg",
      duration: "4:15"
    },
    {
      name: "Tattad Tattad",
      artist: "Aditya Narayan",
      url: "https://www.youtube.com/watch?v=sRv9_Q3HOmg",
      image: "https://i.ytimg.com/vi/sRv9_Q3HOmg/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Badtameez Dil",
      artist: "Benny Dayal",
      url: "https://www.youtube.com/watch?v=II2EO3Nw4m0",
      image: "https://i.ytimg.com/vi/II2EO3Nw4m0/maxresdefault.jpg",
      duration: "3:45"
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
    },
    {
      name: "Dil Diyan Gallan",
      artist: "Atif Aslam",
      url: "https://www.youtube.com/watch?v=SAcpESN_Fk4",
      image: "https://i.ytimg.com/vi/SAcpESN_Fk4/maxresdefault.jpg",
      duration: "4:20"
    },
    {
      name: "Kalank",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=Grr0FlC8SQA",
      image: "https://i.ytimg.com/vi/Grr0FlC8SQA/maxresdefault.jpg",
      duration: "5:11"
    },
    {
      name: "Phir Bhi Tumko Chahunga",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=_iktURk0X-A",
      image: "https://i.ytimg.com/vi/_iktURk0X-A/maxresdefault.jpg",
      duration: "4:44"
    },
    {
      name: "Bekhayali",
      artist: "Sachet Tandon",
      url: "https://www.youtube.com/watch?v=VOLKJJvfAbg",
      image: "https://i.ytimg.com/vi/VOLKJJvfAbg/maxresdefault.jpg",
      duration: "6:11"
    },
    {
      name: "Tera Yaar Hoon Main",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=EatzcaVJRMs",
      image: "https://i.ytimg.com/vi/EatzcaVJRMs/maxresdefault.jpg",
      duration: "4:24"
    },
    {
      name: "Lut Gaye",
      artist: "Jubin Nautiyal",
      url: "https://www.youtube.com/watch?v=sCbbMZ-q4-I",
      image: "https://i.ytimg.com/vi/sCbbMZ-q4-I/maxresdefault.jpg",
      duration: "4:57"
    },
    {
      name: "Dil Tod Ke",
      artist: "B Praak",
      url: "https://www.youtube.com/watch?v=0f7qY_rXxKg",
      image: "https://i.ytimg.com/vi/0f7qY_rXxKg/maxresdefault.jpg",
      duration: "5:12"
    },
    {
      name: "Thodi Jagah",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=bqGtrvcR5ls",
      image: "https://i.ytimg.com/vi/bqGtrvcR5ls/maxresdefault.jpg",
      duration: "4:25"
    },
    {
      name: "Dil Lauta Do",
      artist: "Jubin Nautiyal, Payal Dev",
      url: "https://www.youtube.com/watch?v=0B_T1axqVxM",
      image: "https://i.ytimg.com/vi/0B_T1axqVxM/maxresdefault.jpg",
      duration: "4:18"
    },
    {
      name: "Taaron Ke Shehar",
      artist: "Neha Kakkar, Jubin Nautiyal",
      url: "https://www.youtube.com/watch?v=VAZxCZMqPNs",
      image: "https://i.ytimg.com/vi/VAZxCZMqPNs/maxresdefault.jpg",
      duration: "4:02"
    },
    {
      name: "Pachtaoge",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=PVxc5mIHVuQ",
      image: "https://i.ytimg.com/vi/PVxc5mIHVuQ/maxresdefault.jpg",
      duration: "4:30"
    },
    {
      name: "Tujhe Kitna Chahne Lage",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=AgX2II9si7w",
      image: "https://i.ytimg.com/vi/AgX2II9si7w/maxresdefault.jpg",
      duration: "4:45"
    },
    {
      name: "Dil Sambhal Ja Zara",
      artist: "Mohammed Irfan",
      url: "https://www.youtube.com/watch?v=Gg6NMU4ivXM",
      image: "https://i.ytimg.com/vi/Gg6NMU4ivXM/maxresdefault.jpg",
      duration: "4:35"
    },
    {
      name: "Tera Zikr",
      artist: "Darshan Raval",
      url: "https://www.youtube.com/watch?v=iAP5j5_2GBk",
      image: "https://i.ytimg.com/vi/iAP5j5_2GBk/maxresdefault.jpg",
      duration: "4:22"
    },
    {
      name: "Bhula Dunga",
      artist: "Darshan Raval",
      url: "https://www.youtube.com/watch?v=d_Ieu1e_7Ts",
      image: "https://i.ytimg.com/vi/d_Ieu1e_7Ts/maxresdefault.jpg",
      duration: "4:28"
    },
    {
      name: "Judaiyaan",
      artist: "Darshan Raval",
      url: "https://www.youtube.com/watch?v=lNqvUn9G_mk",
      image: "https://i.ytimg.com/vi/lNqvUn9G_mk/maxresdefault.jpg",
      duration: "4:15"
    },
    {
      name: "Ek Tarfa",
      artist: "Darshan Raval",
      url: "https://www.youtube.com/watch?v=2tPs5P7Ldps",
      image: "https://i.ytimg.com/vi/2tPs5P7Ldps/maxresdefault.jpg",
      duration: "4:08"
    },
    {
      name: "Aaj Din Chadheya",
      artist: "Rahat Fateh Ali Khan",
      url: "https://www.youtube.com/watch?v=YFYiTS46x-8",
      image: "https://i.ytimg.com/vi/YFYiTS46x-8/maxresdefault.jpg",
      duration: "5:25"
    },
    {
      name: "Tujhe Bhula Diya",
      artist: "Mohit Chauhan, Shekhar Ravjiani",
      url: "https://www.youtube.com/watch?v=gkCKTuR-ECI",
      image: "https://i.ytimg.com/vi/gkCKTuR-ECI/maxresdefault.jpg",
      duration: "5:10"
    },
    {
      name: "Tum Jo Aaye",
      artist: "Rahat Fateh Ali Khan, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=yxqn-wXUd5c",
      image: "https://i.ytimg.com/vi/yxqn-wXUd5c/maxresdefault.jpg",
      duration: "5:07"
    },
    {
      name: "Tera Chehra",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=QvVqO5qxY_c",
      image: "https://i.ytimg.com/vi/QvVqO5qxY_c/maxresdefault.jpg",
      duration: "4:45"
    },
    {
      name: "Phir Mohabbat",
      artist: "Mohammed Irfan",
      url: "https://www.youtube.com/watch?v=ZWs_ZX82RWs",
      image: "https://i.ytimg.com/vi/ZWs_ZX82RWs/maxresdefault.jpg",
      duration: "4:55"
    },
    {
      name: "Dil Ibaadat",
      artist: "KK",
      url: "https://www.youtube.com/watch?v=BAeGLiBZuiQ",
      image: "https://i.ytimg.com/vi/BAeGLiBZuiQ/maxresdefault.jpg",
      duration: "5:30"
    },
    {
      name: "Alvida",
      artist: "KK",
      url: "https://www.youtube.com/watch?v=grdZhxXCVww",
      image: "https://i.ytimg.com/vi/grdZhxXCVww/maxresdefault.jpg",
      duration: "5:20"
    },
    {
      name: "Bhula Dena",
      artist: "Mustafa Zahid",
      url: "https://www.youtube.com/watch?v=HwIOZkPDhfM",
      image: "https://i.ytimg.com/vi/HwIOZkPDhfM/maxresdefault.jpg",
      duration: "4:05"
    },
    {
      name: "Ek Thi Daastan",
      artist: "Shafqat Amanat Ali",
      url: "https://www.youtube.com/watch?v=Ue8CIyqoFv0",
      image: "https://i.ytimg.com/vi/Ue8CIyqoFv0/maxresdefault.jpg",
      duration: "4:35"
    },
    {
      name: "Dil De Diya Hai",
      artist: "Anand Raj Anand",
      url: "https://www.youtube.com/watch?v=Nc6hSOj_8vY",
      image: "https://i.ytimg.com/vi/Nc6hSOj_8vY/maxresdefault.jpg",
      duration: "5:45"
    },
    {
      name: "Tadap Tadap",
      artist: "KK",
      url: "https://www.youtube.com/watch?v=RLnFGfJ3TN8",
      image: "https://i.ytimg.com/vi/RLnFGfJ3TN8/maxresdefault.jpg",
      duration: "6:05"
    },
    {
      name: "Tujhe Sochta Hoon",
      artist: "Pritam, KK",
      url: "https://www.youtube.com/watch?v=pCyW346-J4E",
      image: "https://i.ytimg.com/vi/pCyW346-J4E/maxresdefault.jpg",
      duration: "4:45"
    },
    {
      name: "Tere Naina",
      artist: "Shankar Mahadevan",
      url: "https://www.youtube.com/watch?v=x_6zUZl8nvI",
      image: "https://i.ytimg.com/vi/x_6zUZl8nvI/maxresdefault.jpg",
      duration: "4:35"
    },
    {
      name: "Tum Mile",
      artist: "Neeraj Shridhar",
      url: "https://www.youtube.com/watch?v=_TxBxB3eHkA",
      image: "https://i.ytimg.com/vi/_TxBxB3eHkA/maxresdefault.jpg",
      duration: "5:15"
    },
    {
      name: "Mere Rang Mein",
      artist: "Atif Aslam, Shreya Ghoshal",
      url: "https://www.youtube.com/watch?v=GQEoKDivm58",
      image: "https://i.ytimg.com/vi/GQEoKDivm58/maxresdefault.jpg",
      duration: "4:55"
    },
    {
      name: "Tere Bina",
      artist: "A.R. Rahman",
      url: "https://www.youtube.com/watch?v=BMB6YOWzQMY",
      image: "https://i.ytimg.com/vi/BMB6YOWzQMY/maxresdefault.jpg",
      duration: "5:30"
    },
    {
      name: "Sanam Re",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=DS-raAyMxl4",
      image: "https://i.ytimg.com/vi/DS-raAyMxl4/maxresdefault.jpg",
      duration: "4:25"
    },
    {
      name: "Soch Na Sake",
      artist: "Arijit Singh, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=_lL5qZf1OeI",
      image: "https://i.ytimg.com/vi/_lL5qZf1OeI/maxresdefault.jpg",
      duration: "4:48"
    },
    {
      name: "Tere Sang Yaara",
      artist: "Atif Aslam",
      url: "https://www.youtube.com/watch?v=E8RPorI6bis",
      image: "https://i.ytimg.com/vi/E8RPorI6bis/maxresdefault.jpg",
      duration: "4:39"
    },
    {
      name: "Kuch To Hai",
      artist: "Armaan Malik",
      url: "https://www.youtube.com/watch?v=BkjX0-pzPxg",
      image: "https://i.ytimg.com/vi/BkjX0-pzPxg/maxresdefault.jpg",
      duration: "4:15"
    },
    {
      name: "Bol Do Na Zara",
      artist: "Armaan Malik",
      url: "https://www.youtube.com/watch?v=EpEraRui1pc",
      image: "https://i.ytimg.com/vi/EpEraRui1pc/maxresdefault.jpg",
      duration: "4:12"
    },
    {
      name: "Main Hoon Saath Tere",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=pfVODjDBFxU",
      image: "https://i.ytimg.com/vi/pfVODjDBFxU/maxresdefault.jpg",
      duration: "4:28"
    },
    {
      name: "Tera Ban Jaunga",
      artist: "Akhil Sachdeva, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=mQiiw7uRngk",
      image: "https://i.ytimg.com/vi/mQiiw7uRngk/maxresdefault.jpg",
      duration: "3:57"
    },
    {
      name: "Kya Baat Ay",
      artist: "Harrdy Sandhu",
      url: "https://www.youtube.com/watch?v=G0Hx6uN2AJE",
      image: "https://i.ytimg.com/vi/G0Hx6uN2AJE/maxresdefault.jpg",
      duration: "3:38"
    },
    {
      name: "Tera Ghata",
      artist: "Gajendra Verma",
      url: "https://www.youtube.com/watch?v=0KNk-Joi-NM",
      image: "https://i.ytimg.com/vi/0KNk-Joi-NM/maxresdefault.jpg",
      duration: "4:15"
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
    },
    {
      name: "Mere Sohneya",
      artist: "Sachet Tandon, Parampara Thakur",
      url: "https://www.youtube.com/watch?v=VOLKJJvfAbg",
      image: "https://i.ytimg.com/vi/VOLKJJvfAbg/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Tera Fitoor",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=qfdShR8Y2dY",
      image: "https://i.ytimg.com/vi/qfdShR8Y2dY/maxresdefault.jpg",
      duration: "4:32"
    },
    {
      name: "Kaise Hua",
      artist: "Vishal Mishra",
      url: "https://www.youtube.com/watch?v=k8T1Qj6Tm1c",
      image: "https://i.ytimg.com/vi/k8T1Qj6Tm1c/maxresdefault.jpg",
      duration: "3:54"
    },
    {
      name: "Dil Meri Na Sune",
      artist: "Atif Aslam",
      url: "https://www.youtube.com/watch?v=Gc9iJG1Wh0E",
      image: "https://i.ytimg.com/vi/Gc9iJG1Wh0E/maxresdefault.jpg",
      duration: "4:12"
    },
    {
      name: "Tera Hone Laga Hoon",
      artist: "Atif Aslam, Alisha Chinai",
      url: "https://www.youtube.com/watch?v=wdD3JxHzwPI",
      image: "https://i.ytimg.com/vi/wdD3JxHzwPI/maxresdefault.jpg",
      duration: "5:00"
    },
    {
      name: "Tere Naal",
      artist: "Darshan Raval, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=EPxvWRGZVrs",
      image: "https://i.ytimg.com/vi/EPxvWRGZVrs/maxresdefault.jpg",
      duration: "3:48"
    },
    {
      name: "Tera Hua",
      artist: "Atif Aslam",
      url: "https://www.youtube.com/watch?v=cN7g4xjHxYw",
      image: "https://i.ytimg.com/vi/cN7g4xjHxYw/maxresdefault.jpg",
      duration: "4:05"
    },
    {
      name: "Tum Hi Aana",
      artist: "Jubin Nautiyal",
      url: "https://www.youtube.com/watch?v=tLsJQ5srVQA",
      image: "https://i.ytimg.com/vi/tLsJQ5srVQA/maxresdefault.jpg",
      duration: "4:25"
    },
    {
      name: "Dheere Dheere Se",
      artist: "Yo Yo Honey Singh",
      url: "https://www.youtube.com/watch?v=nCD2hj6zJEc",
      image: "https://i.ytimg.com/vi/nCD2hj6zJEc/maxresdefault.jpg",
      duration: "4:58"
    },
    {
      name: "Soch Na Sake",
      artist: "Arijit Singh, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=_lL5qZf1OeI",
      image: "https://i.ytimg.com/vi/_lL5qZf1OeI/maxresdefault.jpg",
      duration: "4:48"
    },
    {
      name: "Bol Do Na Zara",
      artist: "Armaan Malik",
      url: "https://www.youtube.com/watch?v=EpEraRui1pc",
      image: "https://i.ytimg.com/vi/EpEraRui1pc/maxresdefault.jpg",
      duration: "4:12"
    },
    {
      name: "Main Hoon Saath Tere",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=pfVODjDBFxU",
      image: "https://i.ytimg.com/vi/pfVODjDBFxU/maxresdefault.jpg",
      duration: "4:28"
    },
    {
      name: "Tera Ban Jaunga",
      artist: "Akhil Sachdeva, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=mQiiw7uRngk",
      image: "https://i.ytimg.com/vi/mQiiw7uRngk/maxresdefault.jpg",
      duration: "3:57"
    },
    {
      name: "Kya Baat Ay",
      artist: "Harrdy Sandhu",
      url: "https://www.youtube.com/watch?v=G0Hx6uN2AJE",
      image: "https://i.ytimg.com/vi/G0Hx6uN2AJE/maxresdefault.jpg",
      duration: "3:38"
    },
    {
      name: "Tera Ghata",
      artist: "Gajendra Verma",
      url: "https://www.youtube.com/watch?v=0KNk-Joi-NM",
      image: "https://i.ytimg.com/vi/0KNk-Joi-NM/maxresdefault.jpg",
      duration: "4:15"
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
    },
    {
      name: "Naach Meri Rani",
      artist: "Guru Randhawa, Nikhita Gandhi",
      url: "https://www.youtube.com/watch?v=X9B5B3KiYxQ",
      image: "https://i.ytimg.com/vi/X9B5B3KiYxQ/maxresdefault.jpg",
      duration: "3:30"
    },
    {
      name: "Aankh Marey",
      artist: "Neha Kakkar, Mika Singh",
      url: "https://www.youtube.com/watch?v=5MxvgXZNc-0",
      image: "https://i.ytimg.com/vi/5MxvgXZNc-0/maxresdefault.jpg",
      duration: "3:32"
    },
    {
      name: "Coca Cola",
      artist: "Tony Kakkar, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=_cPHiwPqbqo",
      image: "https://i.ytimg.com/vi/_cPHiwPqbqo/maxresdefault.jpg",
      duration: "3:20"
    },
    {
      name: "Morni Banke",
      artist: "Guru Randhawa, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=g1Nz2KOoFJs",
      image: "https://i.ytimg.com/vi/g1Nz2KOoFJs/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Lamborghini",
      artist: "Diljit Dosanjh",
      url: "https://www.youtube.com/watch?v=GuqlX_rqN4k",
      image: "https://i.ytimg.com/vi/GuqlX_rqN4k/maxresdefault.jpg",
      duration: "3:35"
    },
    {
      name: "Dheeme Dheeme",
      artist: "Tony Kakkar",
      url: "https://www.youtube.com/watch?v=9mWdw-09dso",
      image: "https://i.ytimg.com/vi/9mWdw-09dso/maxresdefault.jpg",
      duration: "3:28"
    },
    {
      name: "Hauli Hauli",
      artist: "Garry Sandhu, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=k1MbYE_7yfc",
      image: "https://i.ytimg.com/vi/k1MbYE_7yfc/maxresdefault.jpg",
      duration: "3:15"
    },
    {
      name: "Nikle Currant",
      artist: "Jassi Gill, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=tXzh-TB-d9c",
      image: "https://i.ytimg.com/vi/tXzh-TB-d9c/maxresdefault.jpg",
      duration: "3:40"
    },
    {
      name: "Dilbar",
      artist: "Neha Kakkar, Dhvani Bhanushali",
      url: "https://www.youtube.com/watch?v=JFcgOboQZ08",
      image: "https://i.ytimg.com/vi/JFcgOboQZ08/maxresdefault.jpg",
      duration: "3:29"
    },
    {
      name: "Saki Saki",
      artist: "Neha Kakkar, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=gxJ_xZAssqg",
      image: "https://i.ytimg.com/vi/gxJ_xZAssqg/maxresdefault.jpg",
      duration: "3:33"
    },
    {
      name: "Lagdi Lahore Di",
      artist: "Guru Randhawa, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=pWxcXrXvvbs",
      image: "https://i.ytimg.com/vi/pWxcXrXvvbs/maxresdefault.jpg",
      duration: "3:42"
    },
    {
      name: "Genda Phool",
      artist: "Badshah, Payal Dev",
      url: "https://www.youtube.com/watch?v=SD4Z8dlZPd8",
      image: "https://i.ytimg.com/vi/SD4Z8dlZPd8/maxresdefault.jpg",
      duration: "3:30"
    },
    {
      name: "Naagin",
      artist: "Aastha Gill, Akasa",
      url: "https://www.youtube.com/watch?v=JZ_paQILAnw",
      image: "https://i.ytimg.com/vi/JZ_paQILAnw/maxresdefault.jpg",
      duration: "3:15"
    },
    {
      name: "Buzz",
      artist: "Aastha Gill, Badshah",
      url: "https://www.youtube.com/watch?v=DsDe6pz5KKo",
      image: "https://i.ytimg.com/vi/DsDe6pz5KKo/maxresdefault.jpg",
      duration: "3:22"
    },
    {
      name: "Sauda Khara Khara",
      artist: "Sukhbir, Dhvani Bhanushali",
      url: "https://www.youtube.com/watch?v=jZW1cJy4eVQ",
      image: "https://i.ytimg.com/vi/jZW1cJy4eVQ/maxresdefault.jpg",
      duration: "3:35"
    },
    {
      name: "Chandigarh Mein",
      artist: "Badshah, Lisa Mishra",
      url: "https://www.youtube.com/watch?v=Zk11H94KfO4",
      image: "https://i.ytimg.com/vi/Zk11H94KfO4/maxresdefault.jpg",
      duration: "3:28"
    },
    {
      name: "Yaad Piya Ki Aane Lagi",
      artist: "Neha Kakkar",
      url: "https://www.youtube.com/watch?v=eyk18_5LV4k",
      image: "https://i.ytimg.com/vi/eyk18_5LV4k/maxresdefault.jpg",
      duration: "4:05"
    },
    {
      name: "Kala Chashma",
      artist: "Badshah, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=k4yXQkG2s1E",
      image: "https://i.ytimg.com/vi/k4yXQkG2s1E/maxresdefault.jpg",
      duration: "4:00"
    },
    {
      name: "Desi Boyz",
      artist: "Pritam",
      url: "https://www.youtube.com/watch?v=RKioDWlajvo",
      image: "https://i.ytimg.com/vi/RKioDWlajvo/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Subha Hone Na De",
      artist: "Mika Singh, Akriti Kakkar",
      url: "https://www.youtube.com/watch?v=Y7G-tYRzwYY",
      image: "https://i.ytimg.com/vi/Y7G-tYRzwYY/maxresdefault.jpg",
      duration: "4:10"
    },
    {
      name: "Chittiyaan Kalaiyaan",
      artist: "Meet Bros, Kanika Kapoor",
      url: "https://www.youtube.com/watch?v=zpsVpnvFfZQ",
      image: "https://i.ytimg.com/vi/zpsVpnvFfZQ/maxresdefault.jpg",
      duration: "3:42"
    },
    {
      name: "Nashe Si Chadh Gayi",
      artist: "Arijit Singh",
      url: "https://www.youtube.com/watch?v=Wd2B8OAotU8",
      image: "https://i.ytimg.com/vi/Wd2B8OAotU8/maxresdefault.jpg",
      duration: "3:56"
    },
    {
      name: "Desi Look",
      artist: "Kanika Kapoor",
      url: "https://www.youtube.com/watch?v=0IILJTQluKw",
      image: "https://i.ytimg.com/vi/0IILJTQluKw/maxresdefault.jpg",
      duration: "3:20"
    },
    {
      name: "Proper Patola",
      artist: "Badshah, Diljit Dosanjh",
      url: "https://www.youtube.com/watch?v=YmXJp4RtBCM",
      image: "https://i.ytimg.com/vi/YmXJp4RtBCM/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Kamariya",
      artist: "Aastha Gill, Divya Kumar",
      url: "https://www.youtube.com/watch?v=i0_m90T04uw",
      image: "https://i.ytimg.com/vi/i0_m90T04uw/maxresdefault.jpg",
      duration: "3:12"
    },
    {
      name: "Garmi",
      artist: "Badshah, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=L_ZIeH4Yasw",
      image: "https://i.ytimg.com/vi/L_ZIeH4Yasw/maxresdefault.jpg",
      duration: "3:08"
    },
    {
      name: "Naach Meri Rani",
      artist: "Guru Randhawa, Nikhita Gandhi",
      url: "https://www.youtube.com/watch?v=X9B5B3KiYxQ",
      image: "https://i.ytimg.com/vi/X9B5B3KiYxQ/maxresdefault.jpg",
      duration: "3:30"
    },
    {
      name: "Aankh Marey",
      artist: "Neha Kakkar, Mika Singh",
      url: "https://www.youtube.com/watch?v=5MxvgXZNc-0",
      image: "https://i.ytimg.com/vi/5MxvgXZNc-0/maxresdefault.jpg",
      duration: "3:32"
    },
    {
      name: "Coca Cola",
      artist: "Tony Kakkar, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=_cPHiwPqbqo",
      image: "https://i.ytimg.com/vi/_cPHiwPqbqo/maxresdefault.jpg",
      duration: "3:20"
    },
    {
      name: "Morni Banke",
      artist: "Guru Randhawa, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=g1Nz2KOoFJs",
      image: "https://i.ytimg.com/vi/g1Nz2KOoFJs/maxresdefault.jpg",
      duration: "3:45"
    },
    {
      name: "Lamborghini",
      artist: "Diljit Dosanjh",
      url: "https://www.youtube.com/watch?v=GuqlX_rqN4k",
      image: "https://i.ytimg.com/vi/GuqlX_rqN4k/maxresdefault.jpg",
      duration: "3:35"
    },
    {
      name: "Dheeme Dheeme",
      artist: "Tony Kakkar",
      url: "https://www.youtube.com/watch?v=9mWdw-09dso",
      image: "https://i.ytimg.com/vi/9mWdw-09dso/maxresdefault.jpg",
      duration: "3:28"
    },
    {
      name: "Hauli Hauli",
      artist: "Garry Sandhu, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=k1MbYE_7yfc",
      image: "https://i.ytimg.com/vi/k1MbYE_7yfc/maxresdefault.jpg",
      duration: "3:15"
    },
    {
      name: "Nikle Currant",
      artist: "Jassi Gill, Neha Kakkar",
      url: "https://www.youtube.com/watch?v=tXzh-TB-d9c",
      image: "https://i.ytimg.com/vi/tXzh-TB-d9c/maxresdefault.jpg",
      duration: "3:40"
    },
    {
      name: "Dilbar",
      artist: "Neha Kakkar, Dhvani Bhanushali",
      url: "https://www.youtube.com/watch?v=JFcgOboQZ08",
      image: "https://i.ytimg.com/vi/JFcgOboQZ08/maxresdefault.jpg",
      duration: "3:29"
    },
    {
      name: "Saki Saki",
      artist: "Neha Kakkar, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=gxJ_xZAssqg",
      image: "https://i.ytimg.com/vi/gxJ_xZAssqg/maxresdefault.jpg",
      duration: "3:33"
    },
    {
      name: "Lagdi Lahore Di",
      artist: "Guru Randhawa, Tulsi Kumar",
      url: "https://www.youtube.com/watch?v=pWxcXrXvvbs",
      image: "https://i.ytimg.com/vi/pWxcXrXvvbs/maxresdefault.jpg",
      duration: "3:42"
    },
    {
      name: "Genda Phool",
      artist: "Badshah, Payal Dev",
      url: "https://www.youtube.com/watch?v=SD4Z8dlZPd8",
      image: "https://i.ytimg.com/vi/SD4Z8dlZPd8/maxresdefault.jpg",
      duration: "3:30"
    },
    {
      name: "Naagin",
      artist: "Aastha Gill, Akasa",
      url: "https://www.youtube.com/watch?v=JZ_paQILAnw",
      image: "https://i.ytimg.com/vi/JZ_paQILAnw/maxresdefault.jpg",
      duration: "3:15"
    },
    {
      name: "Buzz",
      artist: "Aastha Gill, Badshah",
      url: "https://www.youtube.com/watch?v=DsDe6pz5KKo",
      image: "https://i.ytimg.com/vi/DsDe6pz5KKo/maxresdefault.jpg",
      duration: "3:22"
    },
    {
      name: "Sauda Khara Khara",
      artist: "Sukhbir, Dhvani Bhanushali",
      url: "https://www.youtube.com/watch?v=jZW1cJy4eVQ",
      image: "https://i.ytimg.com/vi/jZW1cJy4eVQ/maxresdefault.jpg",
      duration: "3:35"
    },
    {
      name: "Chandigarh Mein",
      artist: "Badshah, Lisa Mishra",
      url: "https://www.youtube.com/watch?v=Zk11H94KfO4",
      image: "https://i.ytimg.com/vi/Zk11H94KfO4/maxresdefault.jpg",
      duration: "3:28"
    },
    {
      name: "Yaad Piya Ki Aane Lagi",
      artist: "Neha Kakkar",
      url: "https://www.youtube.com/watch?v=eyk18_5LV4k",
      image: "https://i.ytimg.com/vi/eyk18_5LV4k/maxresdefault.jpg",
      duration: "4:05"
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
    
    // Map the songs to our required format and filter out invalid URLs
    const formattedSongs = moodSongsList
      .filter(song => {
        // Validate YouTube URL format
        const videoId = song.url.split('v=')[1];
        if (!videoId) return false;
        
        // Ensure URL is properly formatted
        try {
          new URL(song.url);
          return true;
        } catch {
          return false;
        }
      })
      .map(song => {
        // Extract video ID
        const videoId = song.url.split('v=')[1];
        
        return {
          id: videoId,
          name: song.name,
          artist: song.artist,
          mood: mood,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          image: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          duration: song.duration,
          language: "hindi",
          primaryArtists: song.artist
        };
      });

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