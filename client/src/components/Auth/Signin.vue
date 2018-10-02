<template>
  <v-container fluid text-md-center>
    <!-- formulario -->
    <v-layout row wrpa mt-3>
      <v-flex xs12 sm8 offset-sm2>
        <v-card color="accent" dark>
          <v-container>
            <v-form @submit.prevent="handleSigninUser">

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-text-field prepend-icon="person_pin" label="usuario" type="text" v-model="username"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-text-field prepend-icon="vpn_key" label="contraseña" type="password" v-model="password"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-btn color="primary" type="submit">Ingresar</v-btn>
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
export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
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
