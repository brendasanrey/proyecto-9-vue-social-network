<template>
  <v-container class="text-xs-center" fluid>

    <!-- Pefil de usuario -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="accent">
        <v-layout>
          <v-flex xs5>
            <v-card-media height="125px" contain :src="user.avatar"></v-card-media>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{user.joinDate}}</div>
                <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}} Favoritos</div>
                <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} publicaciones</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Favoritos -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>No tienes ningún favorito aún!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Favoritos
          <span class="font-weight-regular">({{userFavorites.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm3 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-card-media height="30vh" :src="favorite.imageUrl"></v-card-media>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- publicaciones del usuario -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>No tienes ninguna publicación aún!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-1" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Tus publicaciones
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm3 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-card-media height="30vh" :src="post.imageUrl"></v-card-media>
            <v-card-text>{{post.title}}</v-card-text>
            <v-btn color="accent" small dark class="mb-3" @click="editPostDialog = true">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn color="error" small dark class="mb-3">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- modal para editar publicación -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Editar publicación</v-card-title>
        <v-container>
          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleUpdateUserPost">
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="titleRules" v-model="title" label="Post Título" type="text" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="urlImageRules" v-model="imageUrl" label="URL de la imagen" type="text" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px">
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-select v-model="categories" :rules="categoriesRules" :items="['Vacaciones ', 'Playa ', 'Bosque', 'Familiar', 'Aniversario', 'Luna de miel', 'Paisaje', 'Relax', 'Extranjero', 'Aventura', 'Tour']" multiple label="Categorías"></v-select>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-textarea :rules="descriptionRules" v-model="description" label="Descripción" type="text" required></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" class="success--text" flat>Guardar</v-btn>
              <v-btn class="error--text" flat @click="editPostDialog = false">Cancel</v-btn>
            </v-card-actions>

          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Completa este campo",
        title =>
          title.length < 30 || "El título debe tener menos de 30 caracteres"
      ],
      descriptionRules: [
        description => !!description || "Completa este campo",
        description =>
          description.length < 200 ||
          "La descripción debe tener menos de 200 caracteres"
      ],
      urlImageRules: [urlImage => !!urlImage || "Completa este campo"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "Debes marcar al menos una categoría"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {}
  }
};
</script>