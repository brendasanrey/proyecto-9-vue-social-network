<template>
    <v-alert type="error" :value="true" dismissible transition="scale-transition">
        <h4>{{message}}</h4>
    </v-alert>
</template>

<script>
export default {
  props: ["message"]
};
</script>