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
        url: "https://youtu.be/liTfD88dbCo?si=mRteQ5X0p9UDY4_v",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIWFRUVFRUVFRUVGBcVFRUVFRUXFhUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGi0dHR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTAtLS0tLS0tLS0tLS0tLS0tLy0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAbAAADAQADAQAAAAAAAAAAAAAAAQIDBAUGB//EAD4QAAICAQICCAMGAwUJAAAAAAECABEDEiEEMQUGEyJBUWFxgaHwFDJCkbHBI1JyFmKS0eEHJDM0Y6Kj0vH/xAAbAQEBAQEBAQEBAAAAAAAAAAAAAQIDBAUGB//EADQRAQEAAgECAwQKAQQDAQAAAAABAhEDEiEEMUEFUWFxEyKBkaGxwdHh8DIjM0LxUmKyFf/aAAwDAQACEQMRAD8A5M/Tv5uZkFJFKUIcAuQFyg1QC4NC4NC4AYCgBgEAqA69YCNQFKohRCGIRVyBXGgi8ul0nVLpdC40aBMGisSrqnMsnApZKUhCGTAUAgEBQo285Q9oBCCNKIQrhRqjRoao0aLXL0r0kXjSzFByiXTXRVK4MaS41QMmmdKk7p3FiO6dyJl0uk3LppJhYRlWFcDWYcxAoSIBBRARlUXALjRo7k0aFwhSqICMqlKpFo0SFqjS6It7fOXS6RZ9JWtRJY+QhrUSFPlBuNV2kYrQSMHARMq6TCkAIXudCEOoRN/VytNpzcilVUyyBBRAUqiFKpQQAwHUm0FQEZVjreK6b4fGaOQX6b/OcsvEcePa17OPwPPyTcxcH+1XDfzMPWrHymJ4ziej/wDK8R7o5/A9KYc22LIrEbkcmA9jvO3HzYcn+N28/N4Xl4f9zGz8nKnVwEBHlAkPDXSvG8ljNja5lzBEoVShGFhCFBMCGMrUjPXK1pzJyecoU4QQCAql2u01KuxvHY7DeOy9i3jsdtLEz2Y7OP0lxyYMZyPy8B4sfITnyckwm67eH4MufOYY/wDT51071kyZe7dLdgLtXl7/ABnyubxOWfZ+r8J7O4+HvJ3eeycW1+fvPLc6+nOPFON9Rre/Dy9pnbWpFHKQfJlOxGxseIPMES9VTpn2V9D6m9PHiE7PIQcqfAung3uOR/1n2vBeJ+kx6cr9afi/Le1PAzgz68J9S/hfc9Gfae58pBaVrSRcL2aIp8hIxbG2qZc9JJmlkIvCyIDQ1oy8GqTNBJUlpWtCx5Qd3MnJ5hAcIJFEIUqkRKsFQJNytTTJgblblmlByOcl0z0y+T5r1t6ZOfKdJIRO6vrR3b1s+PkBPieK5evO68p5P13s3wk4OKb873v7fZ+e3mHY3PHX1JIzMy0asQb8oGpct7iXzTyc7q90oeGzLmq1+6w8Spq6vx5H4Tt4fm+izmTzeM8NPE8V475+nzfWcWcOoZSCpFgjcEHyIn6PGyzc8n4vLC4ZdNmrEXNNaUmT0kS4t1e5HK46UWhmROqVrSLlaS3OFgqF2CsGwUhJkmGnPnJ5BALgO5NBShXLpdFq3l0ujuRCgBhY6zp7E+RFwYhb5si4lWwNRa+7Z2F14zzeLy6eN9H2Xx9fiJ8Jt844no59ByFe4rjGW2IVyCQpo7WAa89J8jPkZR+qwtdXhC73vOUd6yygUK52Qf2P6/lM1qJSgQT9CRW/DYC7aFrUNTd5lQUil27zEC6U7XvyG5Eo4xMivpnUbpBc2AYwNLYQFIu7B5MPntPu+B5pnx9Ou+L8n7W4Lxc3XbuZ/wB079kM975syiFWGrXJxiZrjlVspiMyszK3E3KqGhqFCmIQyJEidErW3PucnkK40JfJU1I3MdoGaXpXoUXk0nSC0aNEri4sW42RZkYK5V0Rf0helxuI4zHiy8NnytpTFxWHIzbmlBNmhudvKePx0/0n1vY/1fEz5V4bonpzDixZ8WVGyjPxXDZHQDujh+Hdsrmz+Jw2mvIG62nxbuv1eOpFY+luG+2cR2nZnAy8d9myDFXZPxKnsWddOqkNACjoJJEy25fQvGYhwmHis4xgJ0twy5GGNTeDFwxDKVUd61U2PEkk87kV1HSnS3DfZk+y41xuM/GDJjdAxbDxCqMJDEEdxLXnYNEc7gdt/aHhR0gjB0HC/ZjdYqA4g9G/Zzfc1E9qq+l7+sDLozpno1c3Cvkw6RjyqeIXHeTh8n8EqvEKjqGRlcgsm4NGoC6g8Q7cQ6koVx4Oz1IoUOFyd1iaBY7nc71XlPo+zd9eXy/V8P27r6HD37/R7hnE+y/MyVn2glb6a2RhM1zsq7hjREiVZKzNSt90sB5ws2WkfVQuwFg2emE2de0DcTDidyIzyzcdMWNSum2tbSMeor1hGY95XTzaapHPRXCgwOH0nwJzYnxWAWGxPIMCCpPpYE582HXhcfe9Hh+ecPLjye78vV8scFWvawaI9QaI3n56zVftMbMo4mZu+TW3+kxXWeSTxWTs+x1t2ZcZNFnTrClQ+nlqokXI0wJkDB2PwgOoH0b/AGf9H6MLZmG+QgL/AEKOfxYt+U+17P47jhcve/Le2ufr5ceOf8fP53+HpMgn0XysUgi5WrOzdWHn8plysvuaX6wwgmVqIYw1JUGVoVAKkDgTcK5omHlpyDFzOkdIgiGttNJk2zuKVZNs2pKiVqWmB6SIDBFCRmmBCPnnX3oc4snb41PZ5Pv7bLk8fYNz97nx/G8XTl1Tyv5v1Xsfxc5eP6LO/Wx8vjP4/J5EKfETxafa2ycTNaiZFXjxEyyJbp6Lq31afiGBIIxA95+V1+FPM/pv7T1eH8NeW/D1fN8d7Qw8PjZ55Xyn63+931JECgKoAAFADYAeQE+5JJ2j8Zlbbu97SYTUWMWWadZVJIzWoEjFOoRDqfqpZWpYyOIy7bmcT2cNdQ0QdRMsLKiFc+c3kMiBkwE26S0qhRvB2MGE0DBCkOxmAAwLBkZpZcaspVgGUiiCLBB8CJm4yzVMcssbMsbqx5zpHqTw+TfGWxHyXvJ/hbl8CJ5M/BceX+PZ9bg9s8+HbPWfz7X75+roOJ6gZx9zLjf+rUh/Qzy5eAz9LK+jh7d4b/ljZ91/Znw/ULiCe82JR/Ux+WmTHwHJ66jeftzw8n1Zb9k/d6LovqXgx75CcrevdT/CNz8TPVx+Bwx75d3zOf21zZ9uOdM++/f/AA9KigAKAAAKAAoADwAHKe2SSaj5GWVyttu6DKIaVYgytmvtCVoBIxTgSzCWLJWTCVuACF2emRNpKyrKNAja9Tkzm4HcIgma01IgtLprREwulLCU6kTYIg2nTG12dQKEMqkQXGjQuTSaO40aKVShQRBtBE01EX6w0amErRZlimZRJEq7Toja7GmDYgFwDVGl01ExXM4RDTTUZSuhgwmlgyM1UiJMqpNecKViF1VKwhmyq1RpNGTGjQuNBExo0ktGmpCuXRojkjSzFByS6a6El4XS0aRLGwMjkIAYUoClUH4wJ1QuhcCg8mmbieqNGjMIxcTUdIz1Hzlb1GXE5WVGZRbAEgb717bmYztmNsdOPCZZyZdonhGyUC7o4IsMilLvlsWaxXtJh1etl+Xb9avLOPf1Zcfhbv8ASMOM4thmxYVIBbU73/Ioqh6lmX8jM552Z44z1735OnFxY3iz5MvTUnzv7SNcHEawSPB3Tn4oxU/pN4ZdU+2/gxnx9Fkvul++bYcZmZdKpWtzSg2QAN2YgeAHzI85OTOzUnnf7t14sMbvLLynn+k+1yeEyalDefMc6I2YfAgiaxy6pK48uPTlcf78C47imQ41QBmyMVGokAVjZ7JAP8oHxnPkzuNkxne/ts4eLHOZ5Zbkxm+3zk/VyeEzjIuoWNyCDzVlNMD7EHltN4ZTKbcuXjuGWvP9ZfJwcXHZD3lfC4Y9zGzdmwF93vi7sUaKjnOE5MvOWXfp5f37noy4OOfVuOUs87JufHt28r2867b68J6HhcbNxNEqql2FFgunYH3I3q9ucxlnrtJt2w4tzeV6ZfLe/wC/avh8q5FDobBvwrcEggg7gggivSXHOZTcZzwy48rjlO7h8I2d1DasRBJ3CuLUNQIGo8wL5+ImMMs8pvt/ftejlnDhlZrL7556+TmMk7bcJk6w9IBe0GSg2M2AObq3/DKjxJPdr+YH0nH6aTqmXnPx937fN7JwdXRcPLL8LPPfy8/k5OHKUxh8pVSFt6ugfEDz8vWb6rMd5/a454zPk6eOW9+y+C4/WdLI2N61BHqyt1qFEjnzHMWL5iZw5Oq6s1fixzeH6J1SzKeW57/d/e19GmbiwuRMVG3V2B2ruabHv3h+UtzkymPv3+DOHFvjy5P/AB1+O/2Ph+IVy4XfQ2hvAagASAfGr/OXHOZW69OyZ8dwmO/+U39jYTTmUKIAPraBcjLJWmnSw9UJpWv63k0z0s8jy6dMYy1St6cE5M4BXQGbcLk1BVonYuvMEDwAN14Tjvkk1rd9/wC709PBbMt6nrNd/svl3+Pk5vDYQiKg/CqrfsAJ0xx6ZJ7nn5M+vK5e+7cQcKW4h2dLx9ljQagCpOpmbY+6zj028ttnbUdvpZjwYzG6y6rfwkjPq/jIwjav4mY1VVeV9qjw3bj+2/nWvG5T6X7Mf/mHhwO+R8h1JRONNl+6K1GmHi35hRLjjcsrle3pPl6/fVy5MMMMcJq773z8/TyvpPxtHQ3BnEcoOo3kYgsdmDU9qBsN2YGgNwZOHDo6vn/KeL5pyTCzXl6emu3z8oriUOTiVVXK9niZtQokHK2kVYI5I/gZM51cskutT8/+k48px+HuVm+rKTXym/1jkcRwmjA2PECTRGxGs6277WxA1d5jzG81lj08dxxn9vm44csz5pnyXX5dp2nbfbyRweHG7EtwnZnY6nXEbIoCmVmNih+UmExt74a+ev023y554Yzp5eqe6XL9ZHZETs8TqsnDcQj5Gw9kwyMGPaFlKEIqbaQdQpR5ThceTHK3DV37/T0e7Hk4M8MZyblxmu2u/e37PP4tsHCtixONRZzrdiBRZ2G+keHgAPbnNY43DC+t737XPPlx5OXHtrGak+E+P6n0VwXZYlTUxIRAQzFgCFApQdlHtLw8fRjIeJ5vpeS5annfKf3blEHznVxmnUDD22ftStLhJRSRRd/xH+leQ9bPgJ55jOTk6tf49p8/4/N77n9Dw9EvfPvfhPT7b6/DTkdJISinTqC5EdlAslVazS+NbGvSb5puTtvVlcfD2TKzetyyfOz8PdscI/bZhmUMFTGyAurIWZ2VmpWo0NA3rmT5TGN68+uS6k17vM5cfoeH6O2W5WXtd6k3POdu+2nG9Hu+VMq5dGlXQ93U1OVJKEmge6NyDGfHcs5lLrTHF4jDDiywyx3uy+fbtvz+/wB8HQHBNiwLjcUwLlt9VkuTd+N34x4fC4ccl818bzY8vNcsfLtr7nP0zvt5dpKwu06ZWtmB6yJs6hNsVqV0u1ioZu1EDzhN0ig8/lC9VScY8zC9VGmDaxXrIycIRMKmGlAwzVKvjtfnW+3KRm30XvCdhRhDgIwpQEZVSWhdILe0abkNT7QljQSMHUqbBWTZstJl3F3CKGNm4VfVwuwFjZuDSfq42bSmH1jbVz+CxjHnG2LlfcrSI3U3RQg3UsIWWpho6hARBsiIXaSPSF2oQlWIYUJEOAQEYChRUohpWozYQ3s1AhLtpIz3UIZ7ncgL9YADAciHCF9co7qwDzbrcVB5NM3FWuNJ0gvGjTPI28sjeM7JDwulB/WE0C/rGjpSW9YXSdzC9osCRLWgB9YY3HF6R6TxcOuvK+kHlzJYjwUDczny8uHHN5V24PDcnPl08c28/k6+4eSYsjerFUH7meO+0MPTG38H08fYfL/yyk+W7+yMXX/EfvYXH9LK361Mz2jj641cvYPJ6Zz7r/Lt+jes/DZiFXJpY8lfuk+gPI/Az08fiuLPtLq/F4uf2Z4jhm7jue+d/wCXciel4CMCT7QqSIa2agesF2sQwBAdyIRMqpMKdwaMNImj1RpNIXHG2rksJG06j0R1M9Q7ONr1FojZ1DQPKNr1Uwok2ltBSNp1EUja9QCxs2oSI6Drb1kXhU0JRzOO6PBAdtbfsPSePxXifopqeb6fsz2dfE5dWXbCfj8P3fLOL4psjnI7Es3NjuTPj5Z3K7vm/YcfHjx4zDGakY7zDoQaXYpW84TT1/Vrrc2KsWcl8fIOd2x/+y+nMfKfQ8N4y4fVz7z8nxfHeyseXefF2y93pf2r6FjyBgGUgggEEUQQeRBn2JZZuPy9xuN1ZqwN9c5SILSt6NWk0ljQNDFh6oTRyIRlUjUL3SQIWWqCxtLT0yJswJEqpEOEECZVAgOAVBsVICo2bJ2CgsdgASfYc5LdTayXKyTzr4p0lxzZ8r5XJtmJ38B+EewG0/O8mdzyuV9X9A4OHHh48ePHyn9/FxSBObsk+FfGAhAUC62uVHtOoHTLa/srG1IJx3zDDcqPQizXpPp+z+ezL6O+Xo+F7Y8Jj0fT4zvPP5e97or6CfXfnZWZUw1uLVYZtaqJHOnUIdQEYIm4aBgAMA1fW8aNNRMuapEEAgFSqkwCA4CgO5Bxelc6JhyPk+4EbVXMgiqHqbr4zny2Y4W5eTt4bDPPmwmH+W5p8W4bHrdUsgM4W/cgX85+cf0F6PpzqwnDnj17cf7nmxYkDgBs+tmU6Rf3lC6q32uB0B4DNsBiyWdA+41k5QWxjlzYAkeYG0DUdE8QxULw+U63ONKxsdbpsyJtuw8VG4uBycHQTtixuiZ2yZMz4ggwsVJRVICOL1v961A2qBwjwjqO+jKO8O8CN1Olhv4g7EeEsZtdv1Rx1xmH3cf+Nt56/Cf72P8AfR8/2nd+F5Ps/OPp7Kfqp99+QliaMLuKAkRawxTBhDIgQYaAgI/XOFUIQqg2sNJpmxQMmmdHcaQ7k0aImVSgOAQFAIHX9YVvhc4/6OTxr8J8TOPiP9rL5V6vA3XieO/+0/N8f4LKFyYyeSurGvKwT+k/Ov3r1vWPp7g+IfpJtGpsvEY+I4TIyUQA5GXGx+8AyMDXK086gb8f1uxP0unHo+ROHyZ+Ez58VHunBpBUqDT6dJKn+94QNOB608Mq4bZ/4fTR41qU/wDLkJuP73dO0DHprrJhycOqYcjY8qdI8XxasVbZX72FgRybUoHpA6/rb0tw/E5PtWIaXzojcTj00qcTyyFD4qxUN7s1zUYs77HUvFfFYvHTrO/9Db/MT1+Dn+rj/fR832rlrw2fx1+cfS2X2n3X4+VISNtdSikm06lAQmzqNpsaY2bSUjazItJl2u4VGDcG8HYWfODsFgqxIzTgEiCVSqAQCoNgiAoV1vWXDr4TOp3/AIbEUa3XvD5gTh4mb4svk9fgM+nxPHfjPx7Pj+nb4z88/cq4rDpo+B/yH73FJWFyK3wuNgfO/ltLEqzTMB4ft9frKz5Ryk4W6A+J+vedJhtyvJp7DqH0cNTZj+DZfQsN/egP+6fQ8DxfWuV9Hw/bPiPqY8c9fP5T+fye1n0350oBIKAhDqAoBAUKKgFSgkGImnSrBhmxQkZOBJhRALlNDVBpJb1jSyJLQ1qJLeB5H9I1tZPV8y6w9BHh3YAE423RvLzU7cwf2nwfE+GvFldeXo/YeC8bPEYS26ynnP1dHkUmhW4v6+vOeWx9CVx6mVMLLobYkmpGLXo+iOhs2UBlRtJ3ViKUjkaPwns4uHPPvI+Z4nxfFxWy5Tc856voPQ/RwwYxjuzdsfMn/wCAfCfV4eP6PHT8x4rxF5uS5eno5hWdXn2kiF2W0q91CEqxIydxpCuNKLg0CYNAtBpOv3jS6Zj2lbUPaGasSMmYGZlaMiNkqfyhR+X5QEfraVYzLmG+mJswuoWbEHUo4DKeYIBEzljMpqrjncMurG6rzPG9T73RvYfX1vPncngfdX2OL2vrtnHSZ+qecb6L9v2nmvg+Sej34+1OG+rThuqOZvwV6t3QPz3/ACEuPgs76M8ntXhx9fu7vR9E9UMWI68h7Rh+H8F+o/F8fynt4vA4Y3eXf8nyfE+1uXknTh9We/1/h6TXPbp8npI5I0vSWsymog3DU0neGlrDFaCRmnCFClcGiLRpdEckulmJdr9bSaXoAMI0UiGbtQMjOjJgQTK0NUGkyqKgS0LEkQ0VekLtYHpDNaD2kYqqk2yIBKrLIJW8WYEN7HxgFwaIQLWGa0WRimTKSILQ1og0FgJhdHUImhC7WFkZtWBIztVRtNio2m0lY21stJl2u4YUxtNgrGzaSnrG2pkzK+srWy0wu1D4SM1a+8M1cjIv1g0CYXTNq8ppqbZQ6ER6wo0wm1AQm1qIZtWBIzsiIJSqVrZQFCgsINVHaiF6a2WRzqxIyoSIIEmVSAhdi4CZpdLIzLy6bmJXAg+8NRQhKuRlQMM6FwaJpVhVCoIhqUoUxCU6kTahCVpDDNjK3Ekwuk3DWk6vWVdCoE3C6cgSOVUJErQSMHIhTSszDUAlKHgnmzflDcRDSjDJyBwKEJShDlUQkSIUmhqJSCtJGQsFUIZQ0rc8mWSG4iVT/wA4UvCA4Zf/2Q==",
        duration: "3:52"
      },
      {
        id: "es2",
        name: "Perfect",
        artist: "Ed Sheeran",
        url: "https://youtu.be/2Vv-BfVoq4g?si=UKSgBLqbdPKDkP6y",
        image: "data:image/png;base64,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",
        duration: "4:40"
      },
      {
        id: "es3",
        name: "Castle on the Hill",
        artist: "Ed Sheeran",
        url: "https://youtu.be/YQHsXMglC9A?si=CPGDhuax31j1pgz2",
        image: "data:image/jpeg;base64,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",
        duration: "4:20"
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
        image: "https://i.ytimg.com/vi/YQHsXMglC9A/maxresdefault.jpg",
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
        url: "https://youtu.be/MiAoetOXKcY?si=ZfejXsbOMjr1Mh8f",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHg-6T35G5Jejw9XK68DgzabRHPuRGu1WRmSpldtQRfiV6oD4-Ui9F-8m7E8NtyRMxd78&usqp=CAU",
        duration: "3:30"
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
        name: "Brooklyn Baby",
        artist: "Lana Del Rey",
        url: "https://youtu.be/T5xcnjAG8pE?si=KfCfo8TbwloqVqx9",
        image: "data:image/jpeg;base64,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",
        duration: "5:54"
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