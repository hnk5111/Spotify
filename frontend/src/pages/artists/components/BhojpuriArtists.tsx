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

const bhojpuriArtists: Artist[] = [
  {
    id: "1",
    name: "Pawan Singh",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjzvKOh28zw84U0FBGuK7Ole2G1IdxWB3hGg&s",
    topSongs: [
      {
        id: "ps1",
        name: "Lollipop Lagelu",
        artist: "Pawan Singh",
        url: "https://www.youtube.com/watch?v=Gr8G_ldltDE",
        image: "https://i.ytimg.com/vi/Gr8G_ldltDE/maxresdefault.jpg",
        duration: "4:22"
      },
      {
        id: "ps2",
        name: "Kamariya Kare Lapa Lap",
        artist: "Pawan Singh",
        url: "https://www.youtube.com/watch?v=PHgc8Q6qTjc",
        image: "https://i.ytimg.com/vi/PHgc8Q6qTjc/maxresdefault.jpg",
        duration: "3:49"
      },
      {
        id: "ps3",
        name: "Bhatar Aihe Holi Ke Baad",
        artist: "Pawan Singh",
        url: "https://www.youtube.com/watch?v=7_GX-XmHGbs",
        image: "https://i.ytimg.com/vi/7_GX-XmHGbs/maxresdefault.jpg",
        duration: "5:45"
      }
    ]
  },
  {
    id: "2",
    name: "Khesari Lal Yadav",
    image: "https://www.jansatta.com/wp-content/uploads/2020/08/khesari-lal-yadav-2.jpg",
    topSongs: [
      {
        id: "kl1",
        name: "Thik Hai",
        artist: "Khesari Lal Yadav",
        url: "https://www.youtube.com/watch?v=6L8ZUv8Bx5k",
        image: "https://i.ytimg.com/vi/6L8ZUv8Bx5k/maxresdefault.jpg",
        duration: "3:29"
      },
      {
        id: "kl2",
        name: "Kawna Devta Ke Garhal Sawarl",
        artist: "Khesari Lal Yadav",
        url: "https://www.youtube.com/watch?v=PHgc8Q6qTjc",
        image: "https://i.ytimg.com/vi/PHgc8Q6qTjc/maxresdefault.jpg",
        duration: "3:32"
      },
      {
        id: "kl3",
        name: "Theek Hai",
        artist: "Khesari Lal Yadav",
        url: "https://www.youtube.com/watch?v=L_ZIeH4Yasw",
        image: "https://i.ytimg.com/vi/L_ZIeH4Yasw/maxresdefault.jpg",
        duration: "3:08"
      }
    ]
  },
  {
    id: "3",
    name: "Ritesh Pandey",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBWKTR5nGpwRGm8a2N370WEuUq_xck9YbT8WEH991PKRE3jVti_BvjJOQkpX0TlBabrqE&usqp=CAU",
    topSongs: [
      {
        id: "rp1",
        name: "Tohar Duno Indicator",
        artist: "Ritesh Pandey",
        url: "https://www.youtube.com/watch?v=1X9-0GW6Frs",
        image: "https://i.ytimg.com/vi/1X9-0GW6Frs/maxresdefault.jpg",
        duration: "3:49"
      },
      {
        id: "rp2",
        name: "Piyawa Se Pahile",
        artist: "Ritesh Pandey",
        url: "https://www.youtube.com/watch?v=BadBAMnPX0I",
        image: "https://i.ytimg.com/vi/BadBAMnPX0I/maxresdefault.jpg",
        duration: "4:38"
      },
      {
        id: "rp3",
        name: "Cooler Kurti Me Laga La",
        artist: "Ritesh Pandey",
        url: "https://www.youtube.com/watch?v=SAcpESN_Fk4",
        image: "https://i.ytimg.com/vi/SAcpESN_Fk4/maxresdefault.jpg",
        duration: "4:20"
      }
    ]
  },
  {
    id: "4",
    name: "Monalisa",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEhUQEBAPFRUPEBAQFRAPEA8QDw8PFRUWFhUVFRUYHSggGBolHRUVITIhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGC0lHR0rKy0tLS0tLS0tLS4tLS0vKy0tLS0rLS0tLS0tLS0tLS0tLS0tLS0rLS0tKy03LS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAAIEBQYBBwj/xABCEAACAQIEAggDBQUGBgMAAAABAgADEQQSITEFQQYTIjJRYXGBkaHBB1Kx0eEUIyRy8EJikqKys0NzgoPD8RYzdP/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgQDBf/EACMRAQEAAgICAwADAQEAAAAAAAABAhEDIQQxEjJBIlFxYRP/2gAMAwEAAhEDEQA/AN3QSWNHaQack03tM9m3VKBHLT8I4t94e4ggwMcCeU52aPbppA7RKlpzT0PiI8Meeo8REZZY1lhlsdvhzjKiwgBtFlj8sUrYNAiAj4gI9ggJHxR29/wMkyLiTqPf/SYiiRy/rxnneHH8bV/5y/8AknoynSYLDYUnG1f+ap9j1k5cnp1wegcOOg9vpI/R8/w1P0f/AFtJGGNgB6SD0cf+Hp+j/wCtp3x9ONjOdLh/ED/8+J/2po+BD90ltrfWUXSpL1wfDD4j/amg4MtqKen1kYfeqy+sGxZ7a28Pyhsx8ZGxdQCot/u8vaENUHa/vNMcaNmnGqGCFQRrVBGRVHkao0e7QRgAK+0isJKxG0jyaqAVBHcP7p9/xiqid4f3T7/jJpwRpHeSGMC8FI7QTQ7iBYQARE5HxpEAbFHWnIBoEhlgFMMsQGUwqmAWGSAPnVHMH8520cokWBw+g9Z2+04IhDRx0xRGctJ0bs5eK04YwRMh4o7e/wCBkljImI3H9cjAJ1PaZWjikp8Q6twc2JZAoW11yioSW8jf5GaZamkxNTFUjxIYjOwOHdaVRWUZFQK93z301b5TnlrSu26RrH3+sydHpbg8JRVKtYZ1NQdWgLuP3j7hQbe9piemX2jVXZ6OFY06eYqai/8A2trsD/ZHoL6zz41r62OpuTux95owx6TY9N410/o1KhenQqkdVVpdtkp99CtxYmX/AAr7TMAQEbrafK7pdPiJ4qzIR2gbf3ibSMya3QDfTLcNOuHDjvaMsr6fStbidGqwNKoj2XUqytbUeElo9xPmRKrghlzDXvglGQ+omp6P9O8XRcB361DYFWIzgeRAFzK+GvSNvcy0aLk2A3ldwTi9LEoroe8L2ms4dSQKNBfe/O8mQXpU1sKyd5Trt4RgW4vLvH4imFKsRe23O/KUKNeBbCxQ09ZFQS4xGGHVFjva4lQm8Vhym1UjcANG9ISsYzAHRvSTVRxoJoZoFolBEQTCHtGMsABFHlY0iBGkTkdFA12sMsCsKsQFWFWCWEUwAywiwaQgiDk4NvednBtEHZy8bmnC0NHt1jGZpxmgi0QEYyFim29RCVKsgYpzp/Mv4xWmtA4AHvPPPtCWhh0qOpAfGMuZMu5F8zn1uPhFxXp2KVZ6apmyOUzNoMw0IHoR85hOkvFWxDiox5WCiwsPT6xYzbprTO1g99Dcb8rawtBPvE+gMaVY6i+u55CEwtO7Kv3mUE+82SdOV9r/AID0ZOJs9S4Tknl5zV0OgFO90Zh5HUWl90ewoCqLchpNbhaQA2mG82eV6rXOHDGdx51xDohTKZCAfO1vnPNeknA2wrjcox05FT4frPorGUAeU83+0jhwagxt3Rm0GosbyuHlyxykt6qeXixuNsUf2f8ASX9mfqqrHq31zc6b8n9ORnteHxjEAqdwDodPafMOHrcxyPy0nq/2ddK8y08JUBuLojg3Fhc5TzFgbewmzOarF7j0SqSTrGqxEkU6BZS+wEBlkFs16jEEXPpyke0OYMiFOA1tpzA90+kfWGk5gF0PpJpxxxAmSnWAZYjCM4Y4iNMAaRGFYQxsAEyxsMY0rA1usKsCsKsQFEIsEsKsYHQwggUhVkgpwRTv6xAIxjGEYQLwBrvI7vCVDI5k2qhpMj4jcfzL+Ih6tQKCxIAAJJOwAmY4v0loAdhg5BuAl2zEeklUjy3pR1gxde+QDr6x7xt2nJ+sq84/tVAfS5lxx1Lsajlcz5nKKQcmtlDHbNz95QgKO8wHoSfwmnj9DLpMFcW2NvPb4fnLHo/hs1RahByobgW1Y8h8ZRtVUnKgPIXb8p6R0e4YGTKpIKjcb3hzZfHH/Rw4/LL/ABf4XHYimAB+yKTqEdqjv75dJecG47XdslalSAN+3SZt/wCUzzyv0QxBZr9Y120brGFkI1GUc/A39pueHYDqrlEdQ5BWm7mp1e+aznUjbTl8hlymMx3K0Y/K5asXfFsWaSEgKWt2Q18t/O08+4zWrVrrUroMwYCktMBG02LHX3mw49hWqplzMOspkBl7ynTb8PeYT/4mwKDLly1mqtWBIqVFKgZPS4vfU6naPi+Ot2jP5epHluHaw9BN50N4Y9PGVKLgM1CwLUmzBX0awfbfTlfa+sxXVlajAjVHYH1DWI+U3XQjirYV3AQv1wS7AZ6isuYLYHfQkT0M6wY7e5YLEK1LKdLjwIsfQyfQ4XTya3JIvmvt6TA9GekFWvUalUpmwGZamQ0yfEMp/Gaz9pcLlzG3hOe9p1pFdN/KBMP4wTRAGsNIThy6H0Ec6jLckCd4aND6CKqjjpAOsm1FkZ1kqiMwg2WHYRhERo5jYdlgmWANnJ2KAWiwgg1hBED1hVMEsIsAMkMsAkOpgTkXKI7RHaSYbNAVWhXkWsYUQNmg4mMYzSKsHibEUny2uEYi+17Ty+rxTEU9c6or2K5gOtsNLEAa22NxuCJ6biTdSL7i2ov9Z5Xx+llq9ayDIWIILXueZ2+fMg2hF4s9xrEvVfO7Fi3jYemkrGw/NrAD5nwElYvEq9UvYAEgAAaADQWH5wGPY6X9hNXHHPPsHIbqw8j621nq/QvEgaHynmmEroqMW1/dsANdahvkHx1m/wCjuqpUTmBOPlXcdvF1LXqOFVSJE4tiUUhScoysb23tbQSFgsQ+WROI9JKCHqypdl0tYgKfM8pin8umz49retxCiUQBgWuLAb77fjHY9Ra8y79JEUqRh28yO3Y+RA0HmYTpNxs0cLUxAB0S6hgR22sq3HqRLuF3IWX8ZuvIeOMrYvE5dmxFX45iCfjcybwPGhWscua1rOAVPx0lBSvoSTdr9o6kte9zNP0fwqZ0q1AMpFSmbjMO6cht/MLHyM9LPqaeZjd3b0L7PalcVqi1gFDU1KhVCg2OpuNzqJvDKTonQVcNSCFitmIDnMadyTkv4Db2l4ZMRlezYEiGgzBIdUjKbiO4bsfaR8b3YfhvdPtFTiRUMjPDPBNJqoA0HDEQbCIzDGlY8zkDAZY20ORBlYBYCPEaI8STPWEWDWEWMCpDrAJDLHUumIzh2iY6SDCqSFXMk1mlfiKkKcCqPAs84xjTOa1VxrifVWFlOYNozEXtuAACTvPMul/FGqkLbS4ufEC/Ow5WE33SbDNlNVdwrKwG+S4Jt8J5rxB85N1tmbs7aIbAekrjna/xTU7A/wBfCS8Sl1vlPqTYfH6QWJpZGB0sc2p8j/6+EBXc3AA5+N/hNUccqdUpkId7Apt96/5Ez0XgFF6dJSNQLaeEz/DeBs6Ilh31qNzzkA3W/hqLHY6+RPo3C8AAgHKwsfLwMzeRnPTv4+Nm6mcMx6sBqPAydU4clU32PIjQj3EoMXwsqc1M/CFwmOr0/A/IzHOvTXtbP0ftrUYsN7MBb5TH/aNXBwlVFI7LUAw3sGqC3p3fnC9L+nlfDooFIMXzAEsQqWA1NhruNNJkeEYpqvD8biKxDscZhXbrO4/aXs2AJAIsottp4TZw4W2Z1l8jl6+P6zNNARY8jcHwPKX3AcTUNWnT0ZVYWVgDvvfxGl9TKA1L65SvK2p09bSZgert2rqQrE5jcOd9BbQWt7zVl2zYvoPosVNDKSMyHIxBvr4bTTYfhgZLkm52tawnmn2OqzUy7McuuQN3mOvPmLbfpN+eIVE7AbmRy09ItOd9hVKWUkG2lxIxhXMEYiRsdbIfGF4cez8IHG90w2A7vwipwZ4F4VoMyaowwbQhjDEAzOGOMaYA0zkcZyMJscI0R4kLPWFUQSwyyoVPWFWCUQw2hScMRiM6fpINEr7SrxBllizKms0WSoCTB1algTpoCdTYXtHGDrLcW8dJzUyHE+PPUBC0+zY30Iuo0J8h+cw3EaZBH9wjc+B5maDjLdXUqUiSbWVbaGwYk3HPvSlTEdY4pJTzs2oGbbxZvASsenXXSrr1SwCnQ6+5NtJecB6Ju7K7K4VbG7C2a3gPD1mm4L0WprZ6gDv4kWUHwA8JpKHDlHdW38ukWXkzWsVTg73QcBw0Jr53Nhz5y6wSWOmzcvOBRXXQgnzNr/rDUnynUH8pn26/8HxGHHKV9Wl6S2dwy6HUSvqoSw89IaNj+kWBFQFWFyFLfE/pIFXg4/YquHpWU1q1GodBkawJAJ33QTYY/B5nNh/d9rfrG4ThnVrrrr8p3wzuMcsuOZe3l2K4Ccq1EzZdcyEk5WU2YexuJT16RDtfY6+xN7T2t+FJmZbaOBUHrYK3t3fnMrxPoqxayBcupGg7IPL0nWc2r25f+e500HRDpBhhh6OapTRgi0iouAjDQXOwv9ZtaYB15+t55n0W6F03qstd3IVQ/Viyo4BsQx3tqNLz0vDYcIMovppqSTb1M7Y2WbjNnj8boWMMII0iNCHjR2TC4HuweN7pj8D3YqqDPGWjzGtJUGYwwhjDAgzGGEMYYEaY286Y20CTxCLBLCrJdRFEKog1hVjI9RHiNEcIUiMTmIxtXaSaBjGlVUMn4tpXPUkZKhhkbEYumgOdgLciRf4Q5eUvHmo950DOB2QCuc+29vaQuMljgK+IrNawam4U7Wa6kH0ym/tJfQ7hK00zkdurZieeX+yPh8yZTY+u71RbMOtZUvrfkpHztNvw5dvac+TKya/tp48e9rzBYWXNDAnlIvDpc0qoAnHGS+3TLKz0rcZTsLHlI1M9kH7ht/0nYfj8JLx9beQcF4ffuPfcfMfOdMfev7c8r+ilRuBaRqgMO1xGPY6xRYRN9f6vGsYuekTNHsirv3W+7cH0sd/n8oFgM1o8/wBeokWsbOp5FTv7WjvcTrVSeHnLiKZ5MSh/6hp87TUdWTMdWe2V/uMrfAgzZ57TV49/jYyeTNZShARpjxOGaGdDxg7JhcEvZjcWOyYfBL2ZNOERBsJIYQTCSoEiMMKwgyIAMxhhCIwwIMzkcY2BJawywKwqyXQZYVYFTCAxgUQggVMKNoUiaKoImjapkGqcdKqpLTHGVTyclQwyu4lhnbtUyVbQMVPeQXsLep8jvrLGR8TSY6qxB9Lg+0lTF1cKDjbH/h0+sy5i37y+Uk31BIa+v6zV8OoyiwfC2p4uqzAnrEpv1mtnY3DADlYKvymuwdKwmflvemzi+qxwq2kpmkambQjPIVQsSd5FoVd7bqdPUWIj8XUsJB4Q+ZmI+8foPpHLrsrF/iKQYZhz1+Mq6l1Mu+Hi9ID7pZfYGR8Xhp0zmqjDLpVYZrtaS3w8hMuRg3gbH0l5h7MsUilRUp2kDFLfJ5Ow9Ra/1t7S5xlKVVbvD+YH5H9PhHP2Jv4bjafY9psc4KgnmoPymVxS3X2mjwS3p0jfvUkP+UTR436zeV+CFoyJt7RTUyAYvumHwPdkfGd2SMF3ZNVBGgmhWg2iUGRBkQhg2MAGRBsIRjBMYtg1o0xMYMmGxpNWEUwCmEBkqGUwqmRwYRWjJJSGG0jU2kkQoIwdbaEMbW2kGpccZWOZZcQ3kE0xJqoBOEwxowbUjyMk0OpYuo+7r8dPzlvh10lOgIqAMLXHje/nLrC7TNn9q28f0grCCLwzyMwkqQ+KPZCfI/GSeA4UIg9Iz9jNdhSDZb3Oa17AfmbD3lnW4R1X/EqNYXsbKvK2gH1nbDhyym45Z8uON1Uzhzi7r4G/+ID8pIrJIGDVgSQLZrai+o0HMnxMmvfzudOe/hvO94rWecsirxuHvcRvBq4F0J1U/KXlDD02FymuvfuRobbX/HwMYxAFlCqASLKALnwv8Y8fGv7Tvkf1EPE0y2y6fefsKB76/KZvHUMrhs2bloLAA62Hj6+U0tUAnW5sOZ87e/6Sk4ta6kDnHlxTGXSceW3KbDrns+00XA2zYekfBMv+ElfpM5iT2faXHRet/DqPB6g/zX+sjx/tV+TP4xaOB4QBklzI5mtiR8X3TD4LuwGLPZ+EkYPuyaqCNBPCtBNFVBtBNCNBNJAbQTQjwLGSZjGDLTrGDJgaarR94ooA/NCKZyKBUWi8lq8UUYEJgcQ8UURqjHyvJiikVUdLRpaKKI0Ku37xf5fqZaYdtIopl5PtW3i+sEzQbNFFJXUvo4L1GY+QB32uWHzWTuLPrY33FgL21AH0NvScinqcc1xR5vL96HQr23gcRjyDcX9jptz0iiiSlYfiYtpqRtfTU+nv8TAPitTrz2FjoDob85yKXtIb4gDTT9LX/P5Sr4pU0v4H5xRSMl4h4l+z7S16MD9z/wBx/pORTP4/2aPJ+i7Y6QBiimxiRsXt8JKwndiiipwRoJoopNUC8E0UUk4C0C5iikmE8CTORQgf/9k=",
    topSongs: [
      {
        id: "ml1",
        name: "Machis",
        artist: "Monalisa",
        url: "https://www.youtube.com/watch?v=w4ClQO0FFQg",
        image: "https://i.ytimg.com/vi/w4ClQO0FFQg/maxresdefault.jpg",
        duration: "3:48"
      },
      {
        id: "ml2",
        name: "Dhoka Deti Hai",
        artist: "Monalisa",
        url: "https://www.youtube.com/watch?v=d8IT-16kA8M",
        image: "https://i.ytimg.com/vi/d8IT-16kA8M/maxresdefault.jpg",
        duration: "4:30"
      },
      {
        id: "ml3",
        name: "Ziddi",
        artist: "Monalisa",
        url: "https://www.youtube.com/watch?v=QmW9G4w9gTc",
        image: "https://i.ytimg.com/vi/QmW9G4w9gTc/maxresdefault.jpg",
        duration: "4:25"
      }
    ]
  },
  {
    id: "4",
    name: "Purav Jha",
    image: "https://odianext.com/siteuploads/thumb/sft1/99_6.jpg",
    topSongs: [
      {
        id: "pj1",
        name: "Pahin ke chali Bikini",
        artist: "Purav Jha",
        url: "https://youtu.be/TY9I6ZyTM4U?si=VwocWABsf9N8gild/watch?v=QmW9G4w9gTc",
        image: "https://odianext.com/siteuploads/thumb/sft1/99_6.jpg",
        duration: "2:23"
      },
      {
        id: "pj2",
        name: "Chalu Kar Generator",
        artist: "Purav Jha",
        url: "https://youtu.be/ofYAd3uAo04?si=79sSSetd0oiRJ8uM",
        image: "https://odianext.com/siteuploads/thumb/sft1/99_6.jpg",
        duration: "6:26"
      }
    ]
  },
  {
    id: "5",
    name: "Khesari Lal Yadav",
    image: "https://example.com/khesari.jpg",
    topSongs: [
      {
        id: "kly1",
        name: "Balam Ji Love You",
        artist: "Khesari Lal Yadav",
        url: "https://www.youtube.com/watch?v=example5",
        image: "https://example.com/balam.jpg",
        duration: "3:50"
      },
      {
        id: "kly2",
        name: "Saiyan Arab Gaile Na",
        artist: "Khesari Lal Yadav",
        url: "https://www.youtube.com/watch?v=example6",
        image: "https://example.com/saiyan.jpg",
        duration: "4:00"
      },
      {
        id: "kly3",
        name: "Thik Hai",
        artist: "Khesari Lal Yadav",
        url: "https://www.youtube.com/watch?v=example7",
        image: "https://example.com/thik_hai.jpg",
        duration: "3:30"
      }
    ]
  }
];

const BhojpuriArtists = () => {
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
      {bhojpuriArtists.map((artist) => (
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

export default BhojpuriArtists; 