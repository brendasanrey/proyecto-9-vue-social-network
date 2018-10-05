<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm4 v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover>
          <v-card-media :src="post.imageUrl" height="30vh" lazy @click.native="goToPost(post._id)"></v-card-media>
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comentarios</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
          </v-card-actions>
          <v-divider light></v-divider>
          <v-card-actions class="pa-3">
            <img :src="post.createdBy.avatar" height="30">
            <span class="grey--text ml-2">{{post.createdBy.username}}</span>
            <!-- <span class="grey--text">{{post.createdDate}}</span> -->
            <v-spacer></v-spacer>
            <v-btn icon ripple>
              <v-icon color="grey lighten-1">info</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="showMoreEnabled" column>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn color="primary" @click="showMorePosts">Cargar más</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";
const pageSize = 3;
export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    showMorePosts() {
      this.pageNum += 1;
      // Se hace otro 'fetch' para traer más posts
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // Se incrementa el numero de pagina en 1
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          console.log("previous result", prevResult.infiniteScrollPosts.posts);
          console.log("fetch more result", fetchMoreResult);
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;
          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Se unen los post anteriores con los siguientes
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    }
  }
};
</script>
