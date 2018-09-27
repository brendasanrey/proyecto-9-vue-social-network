import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
// Componentes para publicaciones
import AddPost from "./components/posts/AddPost.vue";
import Posts from "./components/posts/Posts.vue";
// Componentes para sesiones de usuario
import Signin from "./components/authentications/Signin.vue";
import Signup from "./components/authentications/Signup.vue";
import Profile from "./components/authentications/Profile.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts
    },
    {
      path: "/posts/add",
      name: "AddPost",
      component: AddPost
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    }
  ]
});
