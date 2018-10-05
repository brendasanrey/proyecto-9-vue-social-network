<template>
  <v-container fluid grid-list-md>
    <h1>Inicio</h1>
    <v-layout row>
      <v-dialog persistent fullscreen v-model="loading">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="50" :width="6" color="accent"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
    <v-layout row wrap v-if="!loading && posts.length > 0">
      <v-flex d-flex xs12 sm6 md4 v-for="post in posts" :key="post._id">
        <v-card class="mt-3" hover>
          <img :src="post.imageUrl" height="200px" width="100%">
          <v-card-title>
            <div>
              <strong>{{post.title}}</strong><br>
              <span>{{post.description}}</span>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";

export default {
  name: "home",
  created() {
    this.handleHomePosts();
  },
  computed: {
    posts() {
      return this.$store.getters.posts;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    handleHomePosts() {
      // traer el metodo desde el archivo store
      this.$store.dispatch("getPosts");
    }
  }
};
</script>
