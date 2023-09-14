export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  const pokemon = await pokemonName(parseInt(id as string, 10));
  return {pokemon};
});

interface PokemonMap {
  [key: string]: {
    name: string;
    description?: string;
  };
}

function resultMap(data: string, index: number) {
  const id = data.split('\n').map((name: string) => name.split(',')[0]);
  const language = data.split('\n').map((name: string) => name.split(',')[1]);
  const name = data.split('\n').map((name: string) => name.split(',')[2]);
  const description = data.split('\n').map((name: string) => name.split(',')[3]);
  const map: PokemonMap = name.reduce((acc: PokemonMap, cur: string, index: number) => {
    if (language[index] === '4') {
      if (description[index] !== undefined) {
        acc[id[index]] = {name: cur, description: description[index]};
      } else {
        acc[id[index]] = cur;
      }
    }
    return acc;
  }, {});
  return map[index];
}

export async function pokemonName(id: number) {
  const nameRes = await fetch(
    'https://github.com/PokeAPI/pokeapi/raw/master/data/v2/csv/pokemon_species_names.csv'
  );
  const nameData = await nameRes.text();
  const nameMap = resultMap(nameData, id);
  return nameMap;
}
