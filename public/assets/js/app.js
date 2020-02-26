//app.js

var app = new Vue({
  el: '#movies-form',
  delimiters: ['${', '}'],
  data: {
    apiImg: API_IMG,
    search: '',
    movies: [],
    results: []
  },
  methods: {
    /**
     * Permet d'ajouter un film dans la liste
     * @param {*} e 
     */
    addMovie: function (e) {
      let idMovie = e.target.id;
      axios({
        method: 'get',
        url: API_MDB + '/movie/' + idMovie,
        params: {
          language: 'fr',
          api_key: TOKEN_TMDB
        }
      }).then(response => {
        let movie = response.data;
        if (movie) {
          axios({
            method: 'post',
            url: API_M2W + '/movies',
            data: {
              "titre": movie.title,
              "dateSortie": movie.release_date,
              "synopsis": movie.overview.slice(0, 300)+'...',
              "note": 0,
              "vue": false,
              "image": movie.poster_path,
              "idTmdb": movie.id
            }
          });
          this.results = [];
          this.recupererMovies();
        }
      });
    },
    /**
     * Permet de rechercher un film dans l'API de TMDB
     * @param {*} e 
     */
    searchMovie(e) {
      let query = e.target.value;
      if (query.length >= 2) {
        axios({
          method: 'get',
          url: API_MDB + '/search/movie',
          params: {
            query: query,
            language: 'fr',
            api_key: TOKEN_TMDB
          }
        }).then(response => {
          let data = response.data;
          if (data.total_results >= 1) {
            this.results = data.results;
          }
        });
      }
    },
    /**
     * Permet de récupérer les films de notre liste
     * @param {*} e 
     */
    recupererMovies() {
      axios
      .get(API_M2W + '/movies', {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(response => {        
        if (response.status == 200) {
          let data = response.data;
          let results = data['hydra:member'];
          this.movies = [];
          results.forEach(element => {
            this.movies.push({
              id: element.id,
              titre: element.titre,
              date: element.dateSortie,
              synopsis: element.synopsis,
              vue: element.vue,
              image: element.image
            });
          });
        }
      });
    },
    /**
     * Permet de mettre à jour un film
     * @param {int} id 
     * @param {int} etat 
     */
    updateMovie(id, etat) {
        if(etat == 1) {
          console.log('je l\'ai vue !');
        } else if (etat == 0) {
          console.log('je ne l\'ai pas vue !');
        }
        axios({
          method: 'put',
          url: API_M2W + '/movies/' + id,
          data: {
            "vue": (etat == 1) ? true : false
          }
        }).then(response => {
            if(response.status == 200) {
              this.recupererMovies();
            } else {
              console.log(response);
            }
        });
    }
  },
  mounted() {
    this.recupererMovies()
  }
})