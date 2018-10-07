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
          <v-icon center class="mr-2">{{item.icon}}</v-icon>{{item.title}}
        </v-btn>
        <!-- boton perfil -->
        <v-btn flat to="/profile" v-if="user">
          <v-icon center class="mr-2">account_box</v-icon>
          <v-badge right color="info" class="mr-3">
            <span slot="badge" v-if="userFavorites.length" :class="{'bounce': badgeAnimated}">{{userFavorites.length}}</span>perfil
          </v-badge>
        </v-btn>
      </v-toolbar-items>
      <!-- busqueda -->
      <v-text-field v-if="user" prepend-icon="search" flex placeholder="Buscar publicaciones" color="accent" single-line hide-details></v-text-field>
      <!-- boton salir -->
      <v-toolbar-items class="mr-md-4 mr-0 hidden-xs-only">
        <v-btn flat v-if="user" @click="handleSignOutUser">
          <v-icon center class="mr-2">exit_to_app</v-icon>salir
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Contenido de la app -->
    <main>
      <v-container class="fluid mt-5">
        <transition name="fade">
          <router-view/>
        </transition>
        <!-- snackbar de inicio de sesión (notificaciones emergentes) -->
        <v-snackbar v-model="authSnackbar" color="success" bottom left :timeout="5000">
          <v-icon class="mt5">check_circle</v-icon>
          <h3>Ha ingresado exitosamente</h3>
          <v-btn dark flat @click="authSnackbar = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-snackbar>

        <!-- snackbar de error en autentificación-->
        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="error" bottom left :timeout="5000">
          <v-icon class="mt5">cancel</v-icon>
          <h3>Tu sesión ha expirado, inicia sesión para continuar</h3>
          <v-btn dark flat to="/signin">
            Ingresar
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
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    };
  },
  watch: {
    user(newValue, oldValue) {
      // valida que no exista un valor anterior para 'user', para mostrar el snackbar solo una vez (al iniciar sesión)
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      // valida que el value sea diferente de null, para mostrar el snackbar
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => {
          this.badgeAnimated = false;
        }, 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["authError", "user", "userFavorites"]),
    itemsOfNav() {
      let iconOfNav = [
        { icon: "input", title: "Ingresar", link: "/signin" },
        { icon: "person_add", title: "Registrarse", link: "/signup" }
      ];
      // Si existe un usuario activo, cambia los iconos de la barra
      if (this.user) {
        iconOfNav = [
          { icon: "photo_library", title: "Inicio", link: "/posts" },
          {
            icon: "add_photo_alternate",
            title: "Publicar",
            link: "/posts/add"
          }
        ];
      }
      return iconOfNav;
    },
    itemsOfSideNav() {
      let iconOfNav = [
        { icon: "input", title: "Ingresar", link: "/signin" },
        { icon: "person_add", title: "Registrarse", link: "/signup" }
      ];
      if (this.user) {
        iconOfNav = iconOfNav = [
          { icon: "photo_library", title: "Inicio", link: "/posts" },
          {
            icon: "add_photo_alternate",
            title: "Publicar",
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
/* Animacion para badge con numero de favoritos */
.bounce {
  animation: bounce 1s both;
}
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  45% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>