<template>
  <v-container>
    <h1>Publicaciones</h1>
    <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{result: {loading, error,data}}">
        <div v-if="loading">Cargando publicaciones...</div>
        <div v-else-if="error">Error al cargar las publicaciones!</div>
        <v-container text-xs-center>
          <v-flex xs12>
            <v-carousel v-bind="{'cycle': true}" interval="3000">
              <v-carousel-item v-for="post in data.getPosts" :key="post._id" :src="post.imageUrl">
                <h1 class="pt-3 pl-3 title-carousel">{{post.title}}</h1>
              </v-carousel-item>
            </v-carousel>
          </v-flex>
        </v-container>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";

export default {
  name: "home",
  data() {
    return {
      getPostsQuery: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
            likes
          }
        }
      `
    };
  }
};
</script>

<style>
.title-carousel {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>

