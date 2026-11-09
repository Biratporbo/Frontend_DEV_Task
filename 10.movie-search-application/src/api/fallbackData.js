/**
 * Curated fallback movie dataset with complete details and high-resolution posters.
 * Serves as an immediate showcase upon first visit and a resilient fallback
 * in case of network outages or OMDb API rate limits.
 */

export const INITIAL_FEATURED_MOVIES = [
  {
    Title: "The Dark Knight",
    Year: "2008",
    imdbID: "tt0468569",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    imdbRating: "9.0",
    Genre: "Action, Crime, Drama",
    Plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
  },
  {
    Title: "Inception",
    Year: "2010",
    imdbID: "tt1375666",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    imdbRating: "8.8",
    Genre: "Action, Adventure, Sci-Fi",
    Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project."
  },
  {
    Title: "Interstellar",
    Year: "2014",
    imdbID: "tt0816692",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
    imdbRating: "8.7",
    Genre: "Adventure, Drama, Sci-Fi",
    Plot: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans."
  },
  {
    Title: "The Matrix",
    Year: "1999",
    imdbID: "tt0133093",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg",
    imdbRating: "8.7",
    Genre: "Action, Sci-Fi",
    Plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence."
  },
  {
    Title: "Pulp Fiction",
    Year: "1994",
    imdbID: "tt0110912",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BYTViYTE3NWMtPCs0YS00MDgyLTg4YTUtODQzOWNiNzQ2MzQ4XkEyXkFqcGc@._V1_SX300.jpg",
    imdbRating: "8.9",
    Genre: "Crime, Drama",
    Plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
  },
  {
    Title: "Avengers: Endgame",
    Year: "2019",
    imdbID: "tt4154796",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
    imdbRating: "8.4",
    Genre: "Action, Adventure, Drama",
    Plot: "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions."
  },
  {
    Title: "Spider-Man: Across the Spider-Verse",
    Year: "2023",
    imdbID: "tt9362722",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BNThiZjA3MjItZGY5Ni00ODQ3LWJhNzctYzBlMTdfMGMDNTU4XkEyXkFqcGc@._V1_SX300.jpg",
    imdbRating: "8.6",
    Genre: "Animation, Action, Adventure",
    Plot: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash, Miles must redefine what it means to be a hero."
  },
  {
    Title: "The Shawshank Redemption",
    Year: "1994",
    imdbID: "tt0111161",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg",
    imdbRating: "9.3",
    Genre: "Drama",
    Plot: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion."
  },
  {
    Title: "Batman Begins",
    Year: "2005",
    imdbID: "tt0372784",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BMzA2NDQzZDEtNDU5Ni00YTlkLTg2OWEtYmQwM2Y1YTBjMjFjXkEyXkFqcGc@._V1_SX300.jpg",
    imdbRating: "8.2",
    Genre: "Action, Crime, Drama",
    Plot: "After witnessing his parents' death, billionaire Bruce Wayne learns the art of fighting to confront injustice. When he returns to Gotham as Batman, he must stop a secret society that intends to destroy the city."
  },
  {
    Title: "Forrest Gump",
    Year: "1994",
    imdbID: "tt0109830",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX300.jpg",
    imdbRating: "8.8",
    Genre: "Drama, Romance",
    Plot: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart."
  }
];

export const FALLBACK_MOVIE_DETAILS = {
  tt0468569: {
    Title: "The Dark Knight",
    Year: "2008",
    Rated: "PG-13",
    Released: "18 Jul 2008",
    Runtime: "152 min",
    Genre: "Action, Crime, Drama",
    Director: "Christopher Nolan",
    Writer: "Jonathan Nolan, Christopher Nolan, David S. Goyer",
    Actors: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
    Plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    Language: "English, Mandarin",
    Country: "United States, United Kingdom",
    Awards: "Won 2 Oscars. 163 wins & 164 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "9.0/10" },
      { Source: "Rotten Tomatoes", Value: "94%" },
      { Source: "Metacritic", Value: "84/100" }
    ],
    Metascore: "84",
    imdbRating: "9.0",
    imdbVotes: "2,892,100",
    imdbID: "tt0468569",
    Type: "movie",
    BoxOffice: "$534,987,076",
    Production: "Warner Bros. Pictures",
    Response: "True"
  },
  tt1375666: {
    Title: "Inception",
    Year: "2010",
    Rated: "PG-13",
    Released: "16 Jul 2010",
    Runtime: "148 min",
    Genre: "Action, Adventure, Sci-Fi",
    Director: "Christopher Nolan",
    Writer: "Christopher Nolan",
    Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
    Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
    Language: "English, Japanese, French",
    Country: "United States, United Kingdom",
    Awards: "Won 4 Oscars. 159 wins & 220 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.8/10" },
      { Source: "Rotten Tomatoes", Value: "87%" },
      { Source: "Metacritic", Value: "74/100" }
    ],
    Metascore: "74",
    imdbRating: "8.8",
    imdbVotes: "2,540,000",
    imdbID: "tt1375666",
    Type: "movie",
    BoxOffice: "$292,587,330",
    Production: "Warner Bros. Pictures",
    Response: "True"
  },
  tt0816692: {
    Title: "Interstellar",
    Year: "2014",
    Rated: "PG-13",
    Released: "07 Nov 2014",
    Runtime: "169 min",
    Genre: "Adventure, Drama, Sci-Fi",
    Director: "Christopher Nolan",
    Writer: "Jonathan Nolan, Christopher Nolan",
    Actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Mackenzie Foy",
    Plot: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    Language: "English",
    Country: "United States, United Kingdom, Canada",
    Awards: "Won 1 Oscar. 44 wins & 148 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.7/10" },
      { Source: "Rotten Tomatoes", Value: "73%" },
      { Source: "Metacritic", Value: "74/100" }
    ],
    Metascore: "74",
    imdbRating: "8.7",
    imdbVotes: "2,050,000",
    imdbID: "tt0816692",
    Type: "movie",
    BoxOffice: "$188,020,017",
    Production: "Paramount Pictures",
    Response: "True"
  }
};
