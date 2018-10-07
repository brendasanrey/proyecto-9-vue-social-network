import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
// Componentes para publicaciones
import AddPost from "./components/Posts/AddPost.vue";
import Posts from "./components/Posts/Posts.vue";
import Post from "./components/Posts/Post.vue";

// Componentes para sesiones de usuario
import Profile from "./components/Auth/Profile.vue";
import Signin from "./components/Auth/Signin.vue";
import Signup from "./components/Auth/Signup.vue";

// Archivo con la proteccion para las rutas
import AuthGuard from "./AuthGuard";

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
      component: Posts,
      beforeEnter: AuthGuard
    },
    {
      path: "/posts/add",
      name: "AddPost",
      component: AddPost,
      beforeEnter: AuthGuard
    },
    {
      path: "/posts/:postId",
      name: "Post",
      component: Post,
      props: true,
      beforeEnter: AuthGuard
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/Signup",
      name: "Signup",
      component: Signup
    }
  ]
});
