<template>
  <main>
    <div class="content">
      <h1>PokéDex</h1>
      <h2>
        Explore os pokémons de todas as gerações com imagens e informações
        atualizadas.
        <br>
        (Clique em um card para ouvir o som do Pokémon.)
      </h2>

      <PokeSearch @search="updateSearch" style="margin-top: 20px" />
      <PokeFilterType @filter="updateFilterType" style="margin-top: 10px" />
    </div>

    <div v-if="isLoading" class="loading-wrapper">
      <v-progress-circular indeterminate size="64" />
    </div>

    <template v-else>
      <PokeList v-if="allPokemonOnPage.length" :pokemons="allPokemonOnPage" />
      <div v-else class="text-center my-12">
        <p v-if="searchTerm || selectedType">
          Nenhum Pokémon encontrado
          <span v-if="searchTerm"
            >para “<strong>{{ searchTerm }}</strong
            >”</span
          >.
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
import PokeFilterType from "../components/PokeFilterType.vue";
import api from "../services/api";
import {
  getPokemonByName,
  listAllPokemonNames,
  listPokemonPage,
  type PokemonListItem,
} from "../services/pokemonService";

export default defineComponent({
  name: "HomeView",
  components: { PokeList, PokePagination, PokeSearch, PokeFilterType },

  setup() {
    const allPokemonNames = ref<string[]>([]);
    const allPokemonOnPage = ref<PokemonListItem[]>([]);
    const currentPage = ref(1);
    const totalPokemon = ref(0);
    const limit = 24;
    const searchTerm = ref("");
    const selectedType = ref("");
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
      if (selectedType.value) {
        await filterByType(selectedType.value);
      } else {
        await loadPage(newPage);
      }
    };

    const doSearch = debounce(async (term: string) => {
      abortController?.abort();
      abortController = new AbortController();

      try {
        let names = allPokemonNames.value;

        if (selectedType.value) {
          const res = await api.get(`/type/${selectedType.value}`);
          names = res.data.pokemon.map((p: any) => p.pokemon.name);
        }

        const filtered = names
          .filter((n) => n.toLowerCase().includes(term))
          .slice(0, limit);

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
            };
          });

        totalPokemon.value = filtered.length;
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
        if (selectedType.value) {
          filterByType(selectedType.value);
        } else {
          loadPage(currentPage.value);
        }
      } else {
        isSearching.value = true;
        isLoading.value = true;
        doSearch(searchTerm.value);
      }
    };

    const updateFilterType = async (type: string) => {
      selectedType.value = type;

      if (searchTerm.value) {
        updateSearch(searchTerm.value);
        return;
      }

      if (!type) {
        isSearching.value = false;
        await loadPage(currentPage.value);
        return;
      }

      await filterByType(type);
    };

    const filterByType = async (type: string) => {
      isLoading.value = true;
      try {
        const res = await api.get(`/type/${type}`);
        const names: string[] = res.data.pokemon.map(
          (p: any) => p.pokemon.name
        );

        const paginatedNames = names.slice(0, limit);

        const results = await Promise.allSettled(
          paginatedNames.map((name: string) =>
            getPokemonByName(name, { signal: abortController?.signal })
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
            };
          });

        totalPokemon.value = names.length;
      } catch (e: any) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        isLoading.value = false;
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
      selectedType,
      isSearching,
      isLoading,
      handlePageChange,
      updateSearch,
      updateFilterType,
    };
  },
});
</script>

<style scoped>
.content {
  text-align: center;
  margin-bottom: 20px;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}
</style>
