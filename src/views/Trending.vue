<script>
import axios from "axios";
import tmdb from "../plugins/tmdb";

export default {
  data() {
    return {
      model: null,
      movies: [],
      currentMovie: null,
      genres: [
        {
          id: 28,
          name: "Action",
        },
        {
          id: 12,
          name: "Adventure",
        },
        {
          id: 16,
          name: "Animation",
        },
        {
          id: 35,
          name: "Comedy",
        },
        {
          id: 80,
          name: "Crime",
        },
        {
          id: 99,
          name: "Documentary",
        },
        {
          id: 18,
          name: "Drama",
        },
        {
          id: 10751,
          name: "Family",
        },
        {
          id: 14,
          name: "Fantasy",
        },
        {
          id: 36,
          name: "History",
        },
        {
          id: 27,
          name: "Horror",
        },
        {
          id: 10402,
          name: "Music",
        },
        {
          id: 9648,
          name: "Mystery",
        },
        {
          id: 10749,
          name: "Romance",
        },
        {
          id: 878,
          name: "Science Fiction",
        },
        {
          id: 10770,
          name: "TV Movie",
        },
        {
          id: 53,
          name: "Thriller",
        },
        {
          id: 10752,
          name: "War",
        },
        {
          id: 37,
          name: "Western",
        },
      ],
    };
  },
  beforeMount() {
    this.fetchTrendingMovies();
  },
  methods: {
    async fetchTrendingMovies() {
      try {
        const response = await tmdb.getTrendingMovies();
        this.movies = response.map((r) => ({
          ...r,
          duration: null,
          actors: [],
        }));
        await this.fetchMovieDurations();
        await this.fetchMovieActors();
        this.currentMovie = this.movies[0];
      } catch (error) {
        console.error(error);
      }
    },
    async fetchMovieDurations() {
      const apiKey = import.meta.env.VITE_VUE_APP_API_KEY;
      const promises = this.movies.map(async (movie) => {
        const url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=videos`;
        const response = await axios.get(url);
        movie.duration = response.data.runtime;
      });

      try {
        await Promise.all(promises);
        this.movies.forEach((movie) => {
          console.log(
            `Movie: ${movie.title}, Duration: ${movie.duration} minutes`
          );
        });
      } catch (error) {
        console.error(error);
      }
    },
    async fetchMovieActors() {
      const apiKey = import.meta.env.VITE_VUE_APP_API_KEY;
      const promises = this.movies.map(async (movie) => {
        const url = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`;
        const response = await axios.get(url);
        movie.actors = response.data.cast.slice(0, 6);
      });

      try {
        await Promise.all(promises);
        this.movies.forEach((movie) => {
          console.log(`Actors: ${movie.actors}`);
        });
      } catch (error) {
        console.error(error);
      }
    },
    getMovieDuration(movie) {
      const durationInMinutes = movie.duration;
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `${hours}h ${minutes}m`;
    },
    getBackdropPath(movie) {
      return "https://image.tmdb.org/t/p/original" + movie.backdrop_path;
    },
    getPosterPath(movie) {
      return "https://image.tmdb.org/t/p/original" + movie.poster_path;
    },
    getActorProfilePath(actor) {
      return "https://image.tmdb.org/t/p/original" + actor.profile_path;
    },
    getAverageVote(movie) {
      return Math.round(movie.vote_average * 10) / 10;
    },
    getTotalVoteCount(movie) {
      return movie.vote_count.toLocaleString();
    },
    getgenreText(gs) {
      let text = "";
      gs.forEach((g) => {
        const genre = this.genres.find((genre) => genre.id === g);
        if (genre) text += `${genre.name}, `;
      });
      return text;
    },
    getReleaseDate(movie) {
      const releaseDate = movie.release_date;
      if (releaseDate) {
        const date = new Date(releaseDate);
        const options = { year: "numeric" };
        return date.toLocaleDateString(undefined, options);
      }
      return "";
    },
    getOverview(overview) {
      const maxLength = 150;
      if (overview.length > maxLength) {
        return overview.substring(0, maxLength) + "...";
      }
      return overview;
    },
    selectMovie(movie) {
      this.currentMovie = movie;
    },
  },
  computed: {
    remainingMovies() {
      return this.movies.filter((movie) => movie !== this.currentMovie);
    },
  },
};
</script>

<template>
  <div class="trending-movie">
    <v-card v-if="currentMovie">
      <div class="image-container">
        <v-img class="image" :src="getBackdropPath(currentMovie)"></v-img>
      </div>
      <div class="gradient-overlay"></div>
      <div class="details ml-14">
        <v-card-title class="title">
          <h1>{{ currentMovie.title }}</h1>
        </v-card-title>
        <v-card-text>
          <div class="d-flex mb-4 mt-4">
            <v-icon color="yellow" class="pb-1 mr-1">mdi-star</v-icon>
            <p class="vote">{{ getAverageVote(currentMovie) }}</p>
            <v-icon>mdi-drag-vertical-variant</v-icon>
            <p class="total-vote mr-5">{{ getTotalVoteCount(currentMovie) }}</p>
            <p class="duration">{{ getMovieDuration(currentMovie) }}</p>
            <v-icon>mdi-circle-small</v-icon>
            <p class="genre">{{ getgenreText(currentMovie.genre_ids) }}</p>
            <v-icon>mdi-circle-small</v-icon>
            <p class="rel-date mr-2">{{ getReleaseDate(currentMovie) }}</p>
          </div>
          <p class="overview font-weight-medium">
            {{ getOverview(currentMovie.overview) }}
          </p>
        </v-card-text>
        <div class="actors">
          <v-card-title>Actors</v-card-title>
          <ul class="d-flex ac-list ml-3">
            <li
              v-for="actor in currentMovie.actors"
              :key="actor.id"
              class="pr-3"
            >
              <v-avatar
                ><v-img class="bg-black" :src="getActorProfilePath(actor)"
              /></v-avatar>
              <!-- <p class="text-caption">{{ actor.name }}</p> -->
            </li>
          </ul>
        </div>
      </div>
    </v-card>
    <div class="w-100 h-100 text-center" v-else>loading...</div>
  </div>
  <div class="carousel">
    <v-sheet
      class="mx-auto sheet"
      elevation="0"
      max-width="710"
      color="transparent"
    >
      <h3 class="text-light-blue-lighten-5 ml-16 mt-6">Trending</h3>
      <v-slide-group v-model="model" class="pa-4" center-active show-arrows>
        <v-slide-group-item v-for="movie in remainingMovies" :key="movie.id">
          <v-card
            color="grey-lighten-1"
            class="ma-4"
            height="100"
            width="140"
            @click="selectMovie(movie)"
          >
            <v-img class="all-image" :src="getPosterPath(movie)">
              <h5 class="re-title mt-16 ml-2">{{ movie.title }}</h5>
            </v-img>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<style scoped>
.trending-movie {
  position: absolute;
  top: 0;
}
.image-container {
  width: 100%;
  height: 651px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: auto;
}
.details {
  position: absolute;
  top: 50%;
  color: white;
}

.overview {
  width: 60%;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 2));
}

.carousel {
  position: absolute;
  right: 0;
  bottom: 15%;
}

.re-title {
  color: white;
}

.ac-list {
  list-style-type: none;
}
</style>
