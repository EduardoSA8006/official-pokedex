<template>
  <v-select
    v-model="selectedType"
    :items="types"
    label="Filtrar por tipo"
    clearable
    @update:modelValue="emitFilter"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import api from "../services/api";

export default defineComponent({
  emits: ["filter"],
  setup(_, { emit }) {
    const selectedType = ref("");
    const types = ref<string[]>([]);

    onMounted(async () => {
      const response = await api.get("/type");
      types.value = response.data.results.map((t: any) => t.name);
    });

    const emitFilter = () => {
      emit("filter", selectedType.value);
    };

    return {
      selectedType,
      types,
      emitFilter,
    };
  },
});
</script>
