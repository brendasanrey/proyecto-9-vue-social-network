import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "./queries";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
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
    signinUser: ({ commit }, payload) => {
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
          // Asegurar que el metodo created en main.js se ejecute
          // router.go -> recarga la pagina
          router.go();
        })
        .catch(error => {
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
    user: state => state.user
  }
});
