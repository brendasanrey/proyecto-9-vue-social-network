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
            <v-form v-model="isValidForm" lazy-validation ref="form" @submit.prevent="handleSigninUser">

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" prepend-icon="person_pin" label="Usuario" type="text" v-model="username"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" prepend-icon="vpn_key" label="Contraseña" type="password" v-model="password"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-btn :loading="loading" :disabled="!isValidForm" color="primary" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>loop</v-icon>
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
      isValidForm: true,
      username: "",
      password: "",
      // Validación de campos de formulario
      usernameRules: [
        // comprobar que se ingrese un string en el input
        username => !!username || "Completa este campo",
        // Nombre de usuario menor a 15 caracteres
        username =>
          username.length < 15 || "El usuario debe tener menos de 15 caracteres"
      ],
      passwordRules: [
        password => !!password || "Completa este campo",
        password =>
          password.length > 5 || "La contraseña debe tener más de 5 caracteres"
      ]
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
      // Si no se validan los campos del formulario, no se realiza la petición de la mutación signinUser
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
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