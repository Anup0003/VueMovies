<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchResults: [],
      searchExpanded: false,
      searchText: '',
    };
  },
  methods: {
    toggleSearch() {
      this.searchExpanded = !this.searchExpanded;
    },
    search() {
      const apiKey =
        import.meta.env.VITE_VUE_APP_API_KEY;
      const apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${this.query}`;

      axios
        .get(apiUrl)
        .then((response) => {
          this.searchResults = response.data.results;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  }
};
</script>

<template>
  <v-app-bar flat class="mt-2 mx-2 app-bar" color="transparent">
    <v-avatar><v-icon color="red-darken-2" size="40">mdi-netflix</v-icon></v-avatar>
    <v-btn color="white"><router-link to="/Movies">Home</router-link></v-btn>
    <v-btn color="white"><router-link to="/Trending">Trending</router-link></v-btn>
    <v-btn color="white"><router-link to="/Series">Series</router-link></v-btn>
    <v-spacer></v-spacer>
    <v-text-field
      bg-color="grey-lighten-2"
      rounded="s-xl"
      density="comfortable"
      flat
      class="mt-5 ml-0 search-input"
      variant="solo"
      v-if="searchExpanded"
      v-model="searchText"
      @keydown.enter="search"
      placeholder="Search Movies"
    ></v-text-field>
    <v-btn color="white" size="50" :rounded="searchExpanded?'e-xl':''" varient="text" @click="toggleSearch"><v-icon>mdi-magnify</v-icon></v-btn>
    <!-- result -->
    <div class="results" v-if="searchResults.length > 0">
      <h2>Search Results:</h2>
      <ul>
        <li v-for="result in searchResults" :key="result.id">
          <h3>{{ result.title || result.name }}</h3>
          <p>{{ result.overview }}</p>
        </li>
      </ul>
    </div>
    <!-- resutl -->
    <v-btn color="white" size="50" variant="text" icon="mdi-share-variant-outline"></v-btn>
    <v-btn color="white" size="50" variant="text" icon="mdi-bookmark-outline"></v-btn>
    <v-btn color="white" size="50" rounded variant="text" class="mr-8 pr-1"><router-link to="/Login"><v-icon>mdi-login</v-icon></router-link></v-btn>
  </v-app-bar>
</template>

<style scoped>
.search-input {
  max-width: 12%;
}

</style>
