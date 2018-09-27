<template>
  <v-app>
    <!-- Barra de navegación -->
    <v-toolbar fixed color="primary" dark>
      <!-- titulo -->
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-sm-only hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          Red social
        </router-link>

      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- busqueda -->
      <v-text-field prepend-icon="search" flex placeholder="Buscar publicaciones" color="accent" single-line hide-details class="hidden-xs-only"></v-text-field>
      <v-spacer></v-spacer>
      <!-- iconos -->
      <v-toolbar-items>
        <v-btn flat v-for="item in itemsOfNav" :key="item.title" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Contenido de la app -->
    <main>
      <v-container class="mt-5">
        <router-view/>
      </v-container>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    itemsOfNav() {
      return [
        { icon: "photo_library", title: "Publicaciones", link: "/posts" },
        { icon: "input", title: "Ingresar", link: "/signin" },
        { icon: "person_add", title: "Registrarse", link: "/signup" }
      ];
    }
  }
};
</script>

