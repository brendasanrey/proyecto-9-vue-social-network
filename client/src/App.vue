<template>
  <v-app style="background: #EAEAEA">
    <!-- barra lateral -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">
            Red social
          </h1>
        </router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <!-- iconos/enlaces -->
      <v-list>
        <v-list-tile ripple v-for="item in itemsOfSideNav" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{item.title}}</v-list-tile-content>
        </v-list-tile>
        <!-- boton salir -->
        <v-list-tile v-if="user" @click="handleSignOutUser">
          <v-list-tile-action>
            <v-icon center>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Salir</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Barra de navegación -->
    <v-toolbar fixed color="primary" dark>
      <!-- titulo -->
      <v-toolbar-side-icon @click="toggleSideNav" class="hidden-md-only hidden-lg-only"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-sm-only hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">Red social</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- iconos -->
      <v-toolbar-items class="mr-md-4 mr-0 hidden-xs-only">
        <v-btn flat v-for="item in itemsOfNav" :key="item.title" :to="item.link">
          <v-icon center>{{item.icon}}</v-icon>
        </v-btn>
        <!-- boton perfil -->
        <v-btn flat to="/profile" v-if="user">
          <v-icon center>account_box</v-icon>
          <v-badge right color="blue darken-2">
            <!-- <span slot="badge">1</span> -->
          </v-badge>
        </v-btn>
      </v-toolbar-items>
      <!-- busqueda -->
      <v-text-field prepend-icon="search" flex placeholder="Buscar publicaciones" color="accent" single-line hide-details></v-text-field>
      <!-- boton salir -->
      <v-toolbar-items class="mr-md-4 mr-0 hidden-xs-only">
        <v-btn flat v-if="user" @click="handleSignOutUser">
          <v-icon center>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Contenido de la app -->
    <main>
      <v-container class="fluid mt-5">
        <transition name="fade">
          <router-view/>
        </transition>
        <!-- snackbar (notificaciones emergentes) -->
        <v-snackbar v-model="authSnackbar" color="success" bottom left :timeout="5000">
          <v-icon class="mt5">check_circle</v-icon>
          <h3>Ha ingresado exitosamente</h3>
          <v-btn dark flat @click="authSnackbar = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      authSnackbar: false
    };
  },
  watch: {
    user(newValue, oldValue) {
      // valida que no existiera un valor anterior para user, para mostrar el snackbar solo una vez (al iniciar sesión)
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    }
  },
  computed: {
    ...mapGetters(["user"]),
    itemsOfNav() {
      let iconOfNav = [
        { icon: "photo_library", title: "Publicaciones", link: "/posts" },
        { icon: "input", title: "Ingresar", link: "/signin" },
        { icon: "person_add", title: "Registrarse", link: "/signup" }
      ];
      // Si existe un usuario activo, cambia los iconos de la barra
      if (this.user) {
        iconOfNav = [
          { icon: "photo_library", title: "Publicaciones", link: "/posts" },
          {
            icon: "add_photo_alternate",
            title: "Nueva publicación",
            link: "/posts/add"
          }
        ];
      }
      return iconOfNav;
    },
    itemsOfSideNav() {
      let iconOfNav = [
        { icon: "photo_library", title: "Publicaciones", link: "/posts" },
        { icon: "input", title: "Ingresar", link: "/signin" },
        { icon: "person_add", title: "Registrarse", link: "/signup" }
      ];
      if (this.user) {
        iconOfNav = iconOfNav = [
          { icon: "photo_library", title: "Publicaciones", link: "/posts" },
          {
            icon: "add_photo_alternate",
            title: "Nueva publicación",
            link: "/posts/add"
          },
          { icon: "account_circle", title: "Perfil", link: "/profile" }
        ];
      }
      return iconOfNav;
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSignOutUser() {
      this.$store.dispatch("signoutUser");
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translate(-20px);
}
</style>