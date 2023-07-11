<script>
import axios from 'axios';
import tmdb from '../plugins/tmdb';

export default {
  data() {
    return {
      model: null,
      topSeries: [],
      currentSeries: null,
      genres: [
        {
          "id": 28,
          "name": "Action"
        },
        {
          "id": 12,
          "name": "Adventure"
        },
        {
          "id": 16,
          "name": "Animation"
        },
        {
          "id": 35,
          "name": "Comedy"
        },
        {
          "id": 80,
          "name": "Crime"
        },
        {
          "id": 99,
          "name": "Documentary"
        },
        {
          "id": 18,
          "name": "Drama"
        },
        {
          "id": 10751,
          "name": "Family"
        },
        {
          "id": 14,
          "name": "Fantasy"
        },
        {
          "id": 36,
          "name": "History"
        },
        {
          "id": 27,
          "name": "Horror"
        },
        {
          "id": 10402,
          "name": "Music"
        },
        {
          "id": 9648,
          "name": "Mystery"
        },
        {
          "id": 10749,
          "name": "Romance"
        },
        {
          "id": 878,
          "name": "Science Fiction"
        },
        {
          "id": 10770,
          "name": "TV Movie"
        },
        {
          "id": 53,
          "name": "Thriller"
        },
        {
          "id": 10752,
          "name": "War"
        },
        {
          "id": 37,
          "name": "Western"
        }
      ],
    };
  },
  beforeMount() {
    this.fetchTopSeries();
  },
  methods: {
    async fetchTopSeries() {
      try {
        const response = await tmdb.getTopSeries();
        this.topSeries = response.map(e => ({
          ...e, episode: null
        }));
        this.fetchSeriesEpisode();
        this.fetchMovieActors();
        this.currentSeries = this.topSeries[0];
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSeriesEpisode() {
      const apiKey =
        import.meta.env.VITE_VUE_APP_API_KEY;
      const promises = this.topSeries.map(async (series) => {
        const url = `https://api.themoviedb.org/3/tv/${series.id}?api_key=${apiKey}`;
        const response = await axios.get(url);
        console.log(response);
        series.episode = response.data.number_of_episodes;
      });

      try {
        await Promise.all(promises);
        this.topSeries.forEach((series) => {
          console.log(`Series: ${series.name}, Episode: ${series.episode}`);
        });
      } catch (error) {
        console.error(error);
      }
    },
    async fetchMovieActors() {
      const apiKey =
        import.meta.env.VITE_VUE_APP_API_KEY;
      const promises = this.topSeries.map(async (series) => {
        const url = `https://api.themoviedb.org/3/movie/${series.id}/credits?api_key=${apiKey}`;
        const response = await axios.get(url);
        series.actors = response.data.cast.slice(0, 6);
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
    getBackdropPath(series) {
      return 'https://image.tmdb.org/t/p/original' + series.backdrop_path;
    },
    getPosterPath(series) {
      return 'https://image.tmdb.org/t/p/original' + series.poster_path;
    },
    getActorProfilePath(actor) {
      return 'https://image.tmdb.org/t/p/original' + actor.profile_path;
    },
    getAverageVote(series) {
      return Math.round(series.vote_average * 10) / 10;
    },
    getTotalVoteCount(series) {
      return series.vote_count.toLocaleString();
    },
    getgenreText(gs) {
      let text = '';
      gs.forEach(g => {
        const genre = this.genres.find(genre => genre.id === g)
        if (genre) text += `${genre.name}, `
      })
      return text
    },
    getAirDate(series) {
      const airDate = series.first_air_date;
      if (airDate) {
        const date = new Date(airDate);
        const options = { year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
      return '';
    },
    getOverview(overview) {
      const maxLength = 150;
      if (overview.length > maxLength) {
        return overview.substring(0, maxLength) + '...';
      }
      return overview;
    },
    selectSeries(series) {
      this.currentSeries = series
    }
  },
  computed: {
    remainingSeries() {
      return this.topSeries.filter(series => series !== this.currentSeries)
    },
  },
};
</script>

<template>
  <div class="top-series">
    <v-card v-if="currentSeries">
      <div class="image-container">
        <v-img class="image" :src="getBackdropPath(currentSeries)"></v-img>
      </div>
      <div class="gradient-overlay"></div>
      <div class="details ml-14">
        <v-card-title class="title">
          <h1>{{ currentSeries.name }}</h1>
        </v-card-title>
        <v-card-text>
          <div class="d-flex mb-4 mt-4">
            <v-icon color="yellow" class="pb-1 mr-1">mdi-star</v-icon>
            <p class="vote"> {{ getAverageVote(currentSeries) }}</p>
            <v-icon>mdi-drag-vertical-variant</v-icon>
            <p class="total-vote mr-5"> {{ getTotalVoteCount(currentSeries) }}</p>
            <p class="episode"> Ep {{ currentSeries.episode }}</p>
            <v-icon>mdi-circle-small</v-icon>
            <p class="genre"> {{ getgenreText(currentSeries.genre_ids) }}</p>
            <v-icon>mdi-circle-small</v-icon>
            <p class="rel-date mr-2"> {{ getAirDate(currentSeries) }}</p>
          </div>
          <p class="overview font-weight-medium"> {{ getOverview(currentSeries.overview) }}</p>
        </v-card-text>
        <div class="actors">
          <v-card-title>Actors</v-card-title>
          <ul class="d-flex ac-list ml-3">
            <li v-for="actor in currentSeries.actors" :key="actor.id" class="pr-3">
              <v-avatar><v-img class="bg-black" :src="getActorProfilePath(actor)" /></v-avatar>
              <!-- <p class="text-caption">{{ actor.name }}</p> -->
            </li>
          </ul>
        </div>
      </div>
    </v-card>
    <div class="w-100 h-100 text-center" v-else>
      loading...
    </div>
  </div>
  <div class="carousel">
    <v-sheet class="mx-auto sheet" elevation="0" max-width="710" color="transparent">
      <v-slide-group v-model="model" class="pa-4" center-active show-arrows>
        <v-slide-group-item v-for="series in remainingSeries" :key="series.id">
          <v-card color="grey-lighten-1" class="ma-4" height="100" width="140" @click="selectSeries(series)">
            <v-img class="all-image" :src="getPosterPath(series)">
              <h5 class="re-title mt-16 ml-2">{{ series.name}}</h5>
            </v-img>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<style scoped>
.top-series {
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
