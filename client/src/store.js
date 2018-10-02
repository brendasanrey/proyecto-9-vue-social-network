import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "./main";
import { GET_POSTS } from "./queries";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    setPosts: (state, payload) => {
      // actualiza el valor de posts
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
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
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
});
