<template>
  <div class="poke-list">
    <div
      class="poke-card"
      v-for="pokemon in pokemons"
      :key="pokemon.name"
      :style="getCardStyle(pokemon.types[0])"
      @click="playCry(pokemon.id)"
    >
      <v-card flat>
        <v-img :src="pokemon.image" class="poke-img" />
        <div class="info">
          <v-card-title class="text-capitalize">
            {{ pokemon.name }}
          </v-card-title>
          <div class="stats">
            <div class="altura">
              <p>Altura</p>
              <p class="t">{{ (pokemon.height / 10).toFixed(1) }} m</p>
            </div>
            <div class="separacao"></div>
            <div class="peso">
              <p>Peso</p>
              <p class="t">{{ (pokemon.weight / 10).toFixed(1) }} kg</p>
            </div>
          </div>
          <div class="types">
            <span
              v-for="type in pokemon.types"
              :key="type"
              class="type-badge"
              :class="type"
            >
              {{ type }}
            </span>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { PokemonListItem } from "../services/pokemonService";

function playCry(pokemonId: number) {
  const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`);
  audio.play().catch((e) => {
    console.warn("Som não pôde ser reproduzido:", e);
  });
}

export default defineComponent({
  name: "PokeList",
  props: {
    pokemons: {
      type: Array as PropType<PokemonListItem[]>,
      required: true,
    },
  },
  setup() {
    const typeColors: Record<string, string> = {
      normal: "#A8A77A",
      fire: "#EE8130",
      water: "#6390F0",
      electric: "#F7D02C",
      grass: "#7AC74C",
      ice: "#96D9D6",
      fighting: "#C22E28",
      poison: "#A33EA1",
      ground: "#E2BF65",
      flying: "#A98FF3",
      psychic: "#F95587",
      bug: "#A6B91A",
      rock: "#B6A136",
      ghost: "#735797",
      dragon: "#6F35FC",
      dark: "#705746",
      steel: "#B7B7CE",
      fairy: "#D685AD",
    };

    function getCardStyle(type: string) {
      const color = typeColors[type] || "#999";
      return {
        borderRadius: "1rem",
        boxShadow: `0 0 6px 1.3px ${color}`,
        transition: "box-shadow 0.3s ease",
      };
    }

    return {
      getCardStyle,
      playCry,
    };
  },
});
</script>

<style scoped>
.poke-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.poke-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-card);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
}

.poke-card:hover {
  transform: translateY(-6px);
}

.poke-img {
  width: 100%;
  object-fit: cover;
}

.info {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;

  align-items: center;
}

.info .v-card-title {
  margin-bottom: 0.5rem;
  color: var(--text-highlight);
}
.poke-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 10px 3px var(--hover-glow-color);
}

.types {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 13px;
  padding-right: 13px;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  gap: 0.5rem;
}

.type-badge {
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-highlight);
  text-transform: capitalize;
}
.altura,
.peso {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.separacao {
  width: 1px;
  height: 30px;
  background-color: var(--text-secondary);
}

.type-badge.fire {
  background-color: var(--type-fire);
}
.type-badge.water {
  background-color: var(--type-water);
}
.type-badge.grass {
  background-color: var(--type-grass);
}
.type-badge.electric {
  background-color: var(--type-electric);
}
.type-badge.ice {
  background-color: var(--type-ice);
}
.type-badge.fighting {
  background-color: var(--type-fighting);
}
.type-badge.poison {
  background-color: var(--type-poison);
}
.type-badge.ground {
  background-color: var(--type-ground);
}
.type-badge.flying {
  background: linear-gradient(to bottom, var(--type-flying) 50%, #97b5cb 50%);
}
.type-badge.psychic {
  background-color: var(--type-psychic);
}
.type-badge.bug {
  background-color: var(--type-bug);
}
.type-badge.rock {
  background-color: var(--type-rock);
}
.type-badge.ghost {
  background-color: var(--type-ghost);
}
.type-badge.dragon {
  background-color: var(--type-dragon);
}
.type-badge.steel {
  background-color: var(--type-steel);
}
.type-badge.dark {
  background-color: var(--type-dark);
}
.type-badge.fairy {
  background-color: var(--type-fairy);
}
.type-badge.normal {
  background-color: var(--type-normal);
}
.t {
  color: var(--text-highlight);
}
</style>
