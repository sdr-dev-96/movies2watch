//app.js

/**
 * Filtre Vue afin de render le synopsis à un format plus court
 */
Vue.filter('formatSynopsis', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.slice(0, 150)
})

/**
 * Filtre Vue afin de render la date à un format dd/mm/YYYY
 */
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
    results: [],
    filtre: 0
  },
  methods: {

    /**
     * Permet d'ajouter un film dans la liste
     * @param {*} e 
     */
    addMovie: function (e) {
      let idMovie = e.target.id;
      searchExistantMovie(idMovie);
      return false;
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
              "dateAjout": getTodayIso(),
              "idUser": "api/users/" + idUser.toString()
            };
            axios({
              method: 'post',
              url: API_M2W + '/movies',
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
              },
              data: data
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
     * Permet de regarder si un film existe dans notre base
     * @param   {int}     id 
     * @returns {boolean} 
     */
    searchExistantMovie: function(id)
    {
      let exists = false;
      axios.get(API_M2W + '/movies/' + id,
      {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).then(response => {
        console.log(response);
      }).catch(error => {
        console.log(error);
      })
      ;
      return exists;
    },

    /**
     * Permet de récupérer les films de notre liste
     * @param {*} e 
     */
    recupererMovies: function() {
      idUser = parseInt(idUser);
      if(idUser != 0) {
        this.loading = false;
        axios
        .get(API_M2W + '/users/' + idUser, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          
          if (response.status == 200) {
            let data = response.data;
            let userMovies = data.movies;
            console.log(userMovies);
            if(userMovies) {
              this.movies = [];
              userMovies.forEach(element => {
                if(element.idUser = idUser) {
                  this.movies.push({
                    id: element.id,
                    titre: element.titre,
                    date: element.dateSortie,
                    synopsis: element.synopsis,
                    vue: element.vue,
                    image: element.image
                  });
                }
              });
            }
          }
        }).finally(() => this.loading = false);
      } else {
        this.loading = false
      }
    },

    /**
     * Permet de filtrer les films déjà vus, non vus
     * @param {int} option 
     */
    filtrerMovies: function(option) {
      console.log(option);
    },

    /**
     * Permet de mettre à jour un film
     * @param {int}     id 
     * @param {int}     etat 
     * @param {object}  event
     */
    updateMovie: function(id, etat, event) {
      if (event) {
        event.preventDefault()
      }
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

    /**
     * Permet de supprimer un film de son compte
     * @param {int} id 
     */
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