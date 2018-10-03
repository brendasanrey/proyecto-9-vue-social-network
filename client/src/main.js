import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";
import FormAlert from "./components/Shared/FormAlert";

// Volver componente global
Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);

// Configuracion para el cliente Apollo,se exporta para usarlo en store.js
export const defaultClient = new ApolloClient({
  //Url donde esta corriendo el servidor, para conectarlo con el cliente
  //uri: "https://fullstack-vue-graphql-starter-naitllklzu.now.sh/graphql"
  uri: "http://localhost:4000/graphql",
  // Se incluye el token de autorización con la petición al backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // Vefica que el token exista en localStorage
    if (!localStorage.token) {
      // Si no existe, agrega el item vacio
      localStorage.setItem("token", "");
    }
    // Agregar el token al 'authorization heder' que es enviada al back
    operation.setContext({
      headers: {
        // Obtener el token almacenado en localStorage
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[netwotkError]", networkError);
    }
    if (graphQLErrors) {
      for (let error of graphQLErrors) {
        console.log(error);
        // Cuando existe una modificación en el token
        if (error.name === "AuthenticationError") {
          // establecer error para mostrar un snackbar
          store.commit("setAuthError", error);
          // cerrar sesión
          store.dispatch("singoutUser");
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  render: h => h(App),
  created() {
    // ejecuta el query getCurrentUser cuando la aplicación es creada
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
