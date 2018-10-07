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

    <v-container class="mt-2" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Tus publicaciones
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm3 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn color="info" small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn color="error" small dark>
              <v-icon>delete</v-icon>
            </v-btn>

            <v-card-media height="30vh" :src="post.imageUrl"></v-card-media>
            <v-card-text>{{post.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
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
    }
  }
};
</script>