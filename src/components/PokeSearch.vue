<template>
  <v-text-field
    v-model="searchTerm"
    label="Buscar Pokémon"
    prepend-inner-icon="mdi-magnify"
    @update:modelValue="onInput"
    variant="outlined"
    clearable
    hide-details
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const emit = defineEmits<{
  (e: "search", term: string): void;
}>();

const searchTerm = ref("");

function onInput() {
  emit("search", searchTerm.value);
}
</script>
