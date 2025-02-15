import { Pokemon } from "./types";

export const savePokemons = (list: Pokemon[]) => {
  localStorage.setItem("pokedex_pokemons", JSON.stringify(list));
}

export function verifyPokemons() {
  const pokemons: string = localStorage.getItem("pokedex_pokemons") || '';
  return pokemons ? JSON.parse(pokemons) : null;
}