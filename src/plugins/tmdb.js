import axios from 'axios';

const API_KEY =
    import.meta.env.VITE_VUE_APP_API_KEY;

export default {
    searchMovies(query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

        return axios.get(url)
            .then(response => response.data.results)
            .catch(error => {
                console.error('Error searching movies:', error);
                return [];
            });
    },
    getMovieDetails(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;

        return axios.get(url)
            .then(response => response.data)
            .catch(error => {
                console.error('Error retrieving movie details:', error);
                return null;
            });
    },
    getTrendingMovies() {
        const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

        return axios.get(url)
            .then(response => response.data.results)
            .catch(error => {
                console.error('Error retrieving trending movies:', error);
                return [];
            });
    },
    getTopMovies() {
        const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

        return axios.get(url)
            .then(response => response.data.results)
            .catch(error => {
                console.error('Error retrieving top movies:', error);
                return [];
            });
    },
    getTopSeries() {
        const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

        return axios.get(url)
            .then(response => response.data.results)
            .catch(error => {
                console.error('Error retrieving top series:', error);
                return [];
            });
    },
    // getActorsImages() {
    //     const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

    //     return axios.get(url)
    //         .then(response => {
    //             const actors = response.data.cast.slice(0, 4);
    //             const actorImages = actors.map(actor => `${imageBaseUrl}${actor.profile_path}`);
    //             return actorImages;
    //         })
    //         .catch(error => {
    //             console.error('Error retrieving actor images:', error);
    //             return [];
    //         });
    // },
};