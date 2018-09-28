<template>
  <v-container fluid grid-list-md>
    <h1>Publicaciones</h1>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md4 v-for="post in posts" :key="post._id">
        <v-card>
          <v-img :src="post.imageUrl"></v-img>
          <v-card-title>
            <div>
              <span>{{post.title}}</span><br>
              <span>{{post.description}}</span>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
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
