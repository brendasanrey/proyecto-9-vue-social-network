<template>
  <v-container fluid text-md-center>
    <!-- titulo  -->
    <v-layout row wrap mt-3>
      <v-flex xs12 sm8 offset-sm2>
        <h2>Crea una nueva publicación</h2>
      </v-flex>
    </v-layout>

    <!-- formulario -->
    <v-layout row wrpa mt-3>
      <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isValidForm" lazy-validation ref="form" @submit.prevent="handleaddPost">

          <v-layout row mt-3>
            <v-flex xs12>
              <v-text-field :rules="titleRules" prepend-icon="border_color" label="Título" type="text" v-model="title"></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row mt-3>
            <v-flex xs12>
              <v-text-field :rules="urlImageRules" prepend-icon="insert_link" label="URL de la imagen" type="text" v-model="urlImage"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- preview de imagen -->
          <v-layout row>
            <v-flex xs12>
              <img :src="urlImage" height="300px">
            </v-flex>
          </v-layout>

          <!-- categorias -->
          <v-layout row>
            <v-flex xs12>
              <v-select :rules="categoriesRules" v-model="categories" :items="['Vacaciones ', 'Playa ', 'Bosque', 'Familiar', 'Aniversario', 'Luna de miel', 'Paisaje', 'Relax', 'Extranjero', 'Aventura', 'Tour']" multiple label="Categorías" prepend-icon="loyalty"></v-select>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-textarea auto-grow :rules="descriptionRules" prepend-icon="notes" label="Descripción" type="text" v-model="description"></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row mt-3>
            <v-flex xs12>
              <v-btn :loading="loading" :disabled="!isValidForm || loading" color="accent" type="submit" light>
                <span slot="loader" class="custom-loader">
                  <v-icon light>loop</v-icon>
                </span>
                Publicar
              </v-btn>
            </v-flex>
          </v-layout>

        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      isValidForm: true,
      title: "",
      urlImage: "",
      categories: [],
      description: "",
      titleRules: [
        // comprobar que se ingrese un string en el input
        title => !!title || "Completa este campo",
        title =>
          title.length < 20 || "El título debe tener menos de 20 caracteres"
      ],
      descriptionRules: [
        description => !!description || "Completa este campo",
        description =>
          description.length < 200 ||
          "El título debe tener menos de 200 caracteres"
      ],
      urlImageRules: [urlImage => !!urlImage || "Completa este campo"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "Debes marcar al menos una categoría"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "error", "user"])
  }
};
</script>