<template>
  <v-container v-if="getPost" class="mt-3" flexbox center fluid>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1>
        <v-card hover>
          <v-tooltip right>
            <v-icon dark>zoom_out_map</v-icon>
            <v-card-media @click="toggleImageDialog" slot="activator" :src="getPost.imageUrl" id="post__image"></v-card-media>
          </v-tooltip>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn large icon v-if="user">
              <v-icon large color="grey" class="mx-2">stars</v-icon>
            </v-btn>
            <v-icon large color="grey">thumb_up</v-icon>
            <h2 class="mx-2 font-weight-medium grey--text">{{getPost.likes}}</h2>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="grey" large>arrow_back</v-icon>
          </v-card-title>
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-media :src="getPost.imageUrl" height="80vh"></v-card-media>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">
                <v-icon left small>loyalty</v-icon>{{category}}
              </v-chip>
            </span>
            <h3 class="font-weight-medium">{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Comentarios -->
    <div class="mt-3">
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12 sm8 offset-sm1>
          <v-form @submit.prevent="handleAddPostMessage">
            <v-layout row>
              <v-flex xs12>
                <v-text-field v-model="messageBody" clearable :append-outer-icon="messageBody && 'send'" label="Comentar" type="text" @click:append-outer="handleAddPostMessage" prepend-icon="rate_review" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm8 offset-sm1>
          <v-list subheader two-line>
            <v-subheader>Comentarios ({{getPost.messages.length}})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-tile avatar inset :key="message.title">
                <v-list-tile-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{message.messageBody}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{message.messageUser.username}}
                    <span class="grey--text text--lighten-1 hidden-xs-only">{{message.messageDate}}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action class='hidden-xs-only'>
                  <v-icon color="grey">textsms</v-icon>
                </v-list-tile-action>

              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>

    </div>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_POST, ADD_POST_MESSAGE } from "../../queries";

export default {
  name: "Post",
  //Obtener el id de la publicacion desde la ruta
  props: ["postId"],
  data() {
    return {
      dialog: false,
      messageBody: ""
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    handleAddPostMessage() {
      const variables = {
        messageBody: this.messageBody,
        userId: this.user._id,
        postId: this.postId
      };
      this.$apollo
        .mutate({
          mutation: ADD_POST_MESSAGE,
          variables,
          update: (cache, { data: { addPostMessage } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.messages.unshift(addPostMessage);
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          console.log(data.addPostMessage);
        })
        .catch(err => console.error(err));
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
