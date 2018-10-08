import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";
import {
  GET_POSTS,
  SIGNIN_USER,
  GET_CURRENT_USER,
  SIGNUP_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from "./queries";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    searchResults: [],
    userPosts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      // actualiza el valor de posts
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    clearSearchResults: state => {
      state.searchResults = [];
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    clearUser: state => {
      state.user = null;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: state => {
      state.error = null;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    }
  },
  actions: {
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Agregar la data(estado) a 'user'
          commit("setUser", data.getCurrentUser);
        })
        .catch(error => {
          commit("setLoading", false);
          console.log(error);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // Usando el cliente Apollo para ejecutar el query getPost
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // actualizar el estado. Obtiene la data en 'actions' y la pasa a 'state' a traves de mutaciones
          // Commit pasa la data a la mutacion
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(error => {
          commit("setLoading", false);
          console.log(error);
        });
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // Leer el query de donde se obtienen los datos a actualizar
            const data = cache.readQuery({ query: GET_POSTS });
            // Actualizar la data
            // console.log(data);
            data.getPosts.unshift(addPost);
            cache.writeQuery({ query: GET_POSTS, data });
          },
          // Asegura que la data sea agregada inmediatamente como se especifica en la función de 'update'
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
          // ejecutar queries especificados despues de que la mutación se complete
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          //console.log(data.addPost);
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPost = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPost);
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(error => {
          console.log(error);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // Asegurar que el metodo created en main.js se ejecute
          // router.go -> recarga la pagina
          router.go();
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // Asegurar que el metodo created en main.js se ejecute
          // router.go -> recarga la pagina
          router.go();
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    signoutUser: async ({ commit }) => {
      // limpiar estado de 'user'
      commit("clearUser");
      // Eliminar toke de localStorage
      localStorage.setItem("token", "");
      // Terminar la sesión
      await apolloClient.resetStore();
      // Redireccionar al home page
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    searchResults: state => state.searchResults,
    userPosts: state => state.userPosts,
    loading: state => state.loading,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError
  }
});
