<template>
  <v-pagination
    v-model="page"
    :length="total"
    :total-visible="7"
    next-icon="mdi-menu-right"
    prev-icon="mdi-menu-left"
  />
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";

export default defineComponent({
  name: "PokePagination",
  props: {
    currentPage: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      page: this.currentPage,
    };
  },
  watch: {
    page(newPage: number) {
      this.$emit("update:modelValue", newPage);
    },
    currentPage(newVal: number) {
      this.page = newVal;
    },
  },
});
</script>
