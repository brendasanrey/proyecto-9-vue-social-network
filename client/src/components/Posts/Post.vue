<template>
    <v-container class="fluid">
        <h1>Post {{postId}}</h1>
    </v-container>
</template>

<script>
export default {
  name: "Post",
  // Obtner el id de la publicación de la ruta
  props: ["postId"]
};
</script>
