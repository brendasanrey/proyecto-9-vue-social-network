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
      </v-list>
    </v-navigation-drawer>

    <!-- Barra de navegación -->
    <v-toolbar fixed color="primary" dark>
      <!-- titulo -->
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-sm-only hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">Red social</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- busqueda -->
      <v-text-field prepend-icon="search" flex placeholder="Buscar publicaciones" color="accent" single-line hide-details class="hidden-xs-only"></v-text-field>
      <v-spacer></v-spacer>
      <!-- iconos -->
      <v-toolbar-items>
        <v-btn flat v-for="item in itemsOfNav" :key="item.title" :to="item.link">
          <v-icon center>{{item.icon}}</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Contenido de la app -->
    <main>
      <v-container class=" mt-5 ">
        <transition name="fade ">
          <router-view/>
        </transition>
      </v-container>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sideNav: false
    };
  },
  computed: {
    itemsOfNav() {
      return [
        { icon: "photo_library", title: "Publicaciones", link: "/posts" },
        { icon: "input", title: "Ingresar", link: "/signin" },
        { icon: "person_add", title: "Registrarse", link: "/signup" }
      ];
    },
    itemsOfSideNav() {
      return [
        { icon: "photo_library", title: "Publicaciones", link: "/posts" },
        { icon: "input", title: "Ingresar", link: "/signin" },
        { icon: "person_add", title: "Registrarse", link: "/signup" }
      ];
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
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
  transform: translate(-25px);
}
</style>