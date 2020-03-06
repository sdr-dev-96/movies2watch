//app.js

Vue.filter('formatSynopsis', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.slice(0, 150)
})

Vue.filter('formatDate', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.slice(0, 4)
})

var app = new Vue({
  el: '#movies-form',
  delimiters: ['${', '}'],
  data: {
    apiImg: API_IMG,
    search: '',
    loading: true,
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
      if(idUser != 0) {
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
            let data = {
              "titre": movie.title,
              "dateSortie": movie.release_date.slice(0, 4),
              "synopsis": movie.overview.slice(0, 150) + '...',
              "note": 0,
              "vue": false,
              "image": movie.poster_path,
              "idTmdb": movie.id,
              "dateAjout": getTodayIso()
            };
            console.log(data);
            axios({
              method: 'post',
              url: API_M2W + '/movies',
              data: {
                "titre": movie.title,
                "dateSortie": movie.release_date,
                "synopsis": movie.overview.slice(0, 150) + '...',
                "note": 0,
                "vue": false,
                "image": movie.poster_path,
                "idTmdb": movie.id,
                "dateAjout": getDateFormatIso(),
                "idUser": idUser
              }
            });
            this.results = [];
            this.recupererMovies();
          }
        });
      } else {
        window.location.replace('//127.0.0.1:8000/login');
      }
    },
    /**
     * Permet de rechercher un film dans l'API de TMDB
     * @param {Event} e 
     */
    searchMovie: function(e) {
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
            this.results = data.results.slice(0, 9);
          }
        });
      } else if(query.length == 0) {
        this.results = [];
      }
    },
    /**
     * Permet de récupérer les films de notre liste
     * @param {*} e 
     */
    recupererMovies: function() {
      idUser = parseInt(idUser);
      if(idUser != 0) {
        axios
        .get(API_M2W + '/users/' + idUser, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          if (response.status == 200) {
            let data = response.data;
            let results = [];
            //console.log(data.movies);
            /*let results = data['hydra:member'];
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
            });*/
          }
        }).finally(() => this.loading = false);
      }
      /*axios
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
        }).finally(() => this.loading = false);*/
    },
    /**
     * Permet de mettre à jour un film
     * @param {int} id 
     * @param {int} etat 
     */
    updateMovie: function(id, etat, e) {
      axios({
        method: 'put',
        url: API_M2W + '/movies/' + id,
        data: {
          "vue": (etat == 1) ? true : false
        }
      }).then(response => {
        if (response.status == 200) {
          this.recupererMovies();
        } else {
          console.log(response);
        }
      });
    },

    deleteMovie: function(id) {
      if(confirm('Etes-vous sûr de vouloir supprimer ce film ?')) {
        axios({
          method: 'delete',
          url: API_M2W + '/movies/' + id
        }).then(response => {
          if (response.status == 204) {
            this.recupererMovies();
            alert('Film bien supprimé !');
          } else {
            console.log(response);
          }
        });
      }      
    }
  },
  created() {
    this.recupererMovies();
  }
})