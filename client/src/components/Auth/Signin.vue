<template>
  <v-container fluid text-md-center>
    <!-- alerta de error -->
    <v-layout row wrap v-if="error">
      <v-flex xs12 sm8 offset-sm2>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- formulario -->
    <v-layout row wrpa mt-3>
      <v-flex xs12 sm8 offset-sm2>
        <v-card color="accent" dark>
          <v-container>
            <v-form @submit.prevent="handleSigninUser">

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-text-field prepend-icon="person_pin" label="Usuario" type="text" v-model="username"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-text-field prepend-icon="vpn_key" label="Contraseña" type="password" v-model="password"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-btn :loading="loading" color="primary" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Ingresar
                  </v-btn>
                  <p class="mt-2">¿No tienes cuenta?
                    <router-link to="/signup">Regístrate</router-link>
                  </p>
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["loading", "user", "error"])
  },
  watch: {
    user(value) {
      // Si el value de user cambia, redirecciona al home page
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSigninUser() {
      this.$store.dispatch("signinUser", {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>