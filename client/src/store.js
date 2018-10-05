import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";
import {
  GET_POSTS,
  SIGNIN_USER,
  GET_CURRENT_USER,
  SIGNUP_USER,
  ADD_POST
} from "./queries";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
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
    setUser: (state, payload) => {
      state.user = payload;
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
            const data = cache.readQuery({ query: GET_POST });
            // Actualizar la data
            data.getPosts.unshift(addPost);
            cache.readQuery({ query: GET_POSTS, data });
          },
          // Asegura que la data sea agregada inmediatamente como se especifica en la función de 'update'
          optimisticResponse: {
            __typename: "Mutation",
            _id: -1,
            ...payload
          }
        })
        .then(({ data }) => {
          console.log(data.addPost);
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
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});
