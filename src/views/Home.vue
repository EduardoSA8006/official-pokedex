<template>
  <main>
    <div class="content">
      <h1>PokéDex</h1>
      <h2>
        Explore os pokémons de todas as gerações com imagens e informações
        atualizadas.
      </h2>
      <PokeSearch @search="updateSearch" style="margin-top: 20px" />
    </div>

    <v-progress-circular
      v-if="isLoading"
      indeterminate
      size="64"
      class="mx-auto my-12"
    />

    <template v-else>
      <PokeList v-if="allPokemonOnPage.length" :pokemons="allPokemonOnPage" />
      <div v-else class="text-center my-12">
        <p v-if="searchTerm">
          Nenhum Pokémon encontrado para “<strong>{{ searchTerm }}</strong
          >”.
        </p>
        <p v-else>Carregando Pokémons...</p>
      </div>

      <PokePagination
        v-if="!isSearching && allPokemonOnPage.length"
        :current-page="currentPage"
        :total="Math.ceil(totalPokemon / limit)"
        @update:modelValue="handlePageChange"
        style="margin-top: 20px"
      />
    </template>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import debounce from "lodash/debounce";
import PokeList from "../components/PokeList.vue";
import PokePagination from "../components/PokePagination.vue";
import PokeSearch from "../components/PokeSearch.vue";
import {
  getPokemonByName,
  listAllPokemonNames,
  listPokemonPage,
  type PokemonListItem,
} from "../services/pokemonService";

export default defineComponent({
  name: "HomeView",
  components: { PokeList, PokePagination, PokeSearch },

  setup() {
    const allPokemonNames = ref<string[]>([]);
    const allPokemonOnPage = ref<PokemonListItem[]>([]);
    const currentPage = ref(1);
    const totalPokemon = ref(0);
    const limit = 24;
    const searchTerm = ref("");
    const isSearching = ref(false);
    const isLoading = ref(true);
    let abortController: AbortController | null = null;

    const initNames = async () => {
      allPokemonNames.value = await listAllPokemonNames();
    };

    const loadPage = async (page: number) => {
      isLoading.value = true;
      const offset = (page - 1) * limit;
      const { items, count } = await listPokemonPage(offset, limit);
      allPokemonOnPage.value = items;
      totalPokemon.value = count;
      isLoading.value = false;
    };

    const handlePageChange = async (newPage: number) => {
      currentPage.value = newPage;
      await loadPage(newPage);
    };
    const doSearch = debounce(async (term: string) => {
      abortController?.abort();
      abortController = new AbortController();

      try {
        const filtered = allPokemonNames.value
          .filter((n) => n.includes(term))
          .slice(0, 10);

        const results = await Promise.allSettled(
          filtered.map((name) =>
            getPokemonByName(name, { signal: abortController!.signal })
          )
        );

        allPokemonOnPage.value = results
          .filter((r) => r.status === "fulfilled")
          .map((r: PromiseFulfilledResult<any>) => {
            const details = r.value;
            return {
              name: details.name,
              image: details.sprites.front_default,
              height: details.height,
              weight: details.weight,
              types: details.types.map((t: any) => t.type.name),
            } as PokemonListItem;
          });
      } catch (e: any) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        isLoading.value = false;
      }
    }, 300);

    const updateSearch = (q: string) => {
      searchTerm.value = q.trim().toLowerCase();

      if (!searchTerm.value) {
        isSearching.value = false;
        loadPage(currentPage.value);
      } else {
        isSearching.value = true;
        isLoading.value = true;
        doSearch(searchTerm.value);
      }
    };

    onMounted(async () => {
      await initNames();
      await loadPage(1);
    });

    return {
      allPokemonOnPage,
      currentPage,
      totalPokemon,
      limit,
      searchTerm,
      isSearching,
      isLoading,
      handlePageChange,
      updateSearch,
    };
  },
});
</script>

<style scoped>
.content {
  text-align: center;
  margin-bottom: 20px;
}
</style>
