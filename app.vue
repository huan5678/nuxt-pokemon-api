<template>
  <UContainer>
    <div class="relative flex justify-center items-center">
      <NuxtLink to="https://pokeapi.co/">
        <h1 class="text-center text-2xl p-4"><span class="text-green-500 dark:text-green-300">Nuxt</span> <span class="text-blue-500 dark:text-blue-300">PokeAPI</span> !</h1>
      </NuxtLink>
      <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      class="absolute right-0 -translate-x-0"
      @click="isDark = !isDark"
    />
    </div>
    <ul class="relative grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-8" ref="list">
      <li v-for="pokemon in pokemonList">
        <UCard class="h-full group" :key="pokemon.name">
          <template #header>
            <h2 class="text-center text-lg font-bold">{{ pokemon.name }}</h2>
            <p class="text-sm text-center text-gray-500">{{ pokemon.description }}</p>
          </template>
          <div class="grid place-content-center overflow-clip max-h-16">
            <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemon.url.split('/')[6]}.png `" class="max-h-16 group-hover:max-h-24 transition-all duration-300" :alt="pokemon.name" />
          </div>
        </UCard>
      </li>
    </ul>
    <UButton variant="link" size="md" square class="text-4xl text-gray-400 hover:text-gray-800 transition duration-300 fixed top-full right-4 -translate-x-4 -translate-y-full" @click="handleGetNext">
      <BootstrapIcon name="node-plus-fill" />
    </UButton>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const colorMode = useColorMode();
const isDark = computed({
  get()
  {
    return colorMode.value === 'dark'
  },
  set()
  {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
});

const [ list ] = useAutoAnimate();

type Pokemon = {
  name: string;
  description?: string;
  url: string;
}

const path = ref<string>('https://pokeapi.co/api/v2/pokemon/');
const pokemonList = ref<Pokemon[]>([]);
const next = ref<string | null>(null);

const { data } = await useFetch(path) as unknown as {
  data: {
    value: {
      results: Pokemon[],
      next: string | null,
      count: number,
      previous: string | null
    },
  }
};
next.value = data.value.next;
const promises = data.value.results.map(async (pokemon: Pokemon) => {
  const id = pokemon.url.split('/')[6];
  const { data: pokemonData } = await useFetch(`/api/pokemon-name?id=${id}`);
  const pokemonInfo = (pokemonData.value?.pokemon || {}) as Pokemon;
  pokemon = {
    ...pokemon,
    ...pokemonInfo
  }
  return pokemon;
})
pokemonList.value = await Promise.all(promises);

const handleGetNext = async () => {
  if (next.value) {
    const { data } = await useFetch(next.value) as unknown as {
      data: {
        value: {
          results: Pokemon[],
          next: string | null,
          count: number,
          previous: string | null
        },
      }
    };
    next.value = data.value.next;
    const promises = data.value.results.map(async (pokemon: Pokemon) => {
      const id = pokemon.url.split('/')[6];
      const { data: pokemonData } = await useFetch(`/api/pokemon-name?id=${id}`);
      const pokemonInfo = (pokemonData.value?.pokemon || {}) as Pokemon;
      pokemon = {
        ...pokemon,
        ...pokemonInfo
      }
      return pokemon;
    })
    pokemonList.value = [...pokemonList.value, ...await Promise.all(promises)];
  }
}

</script>