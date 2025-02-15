export type TypePokemon = {
  type: {
    name: string,
    url: string, 
  },
}

export type Pokemon = {
  id: number,
  name: string,
  types: [TypePokemon],
  number: string,
  image: string,
}

export type PokemonData = {
  id: number,
  name: string,
  types: [TypePokemon],
  height: number,
  weight: number,
  stats: [string],
  sprites: {
    front_default: string,
  }
}

export type PokemonDetails = {
  id: number,
  name: string,
  types: [TypePokemon],
  height: number,
  weight: number,
  stats: [string],
  gender_rate: number,
  image: string,
  capture_rate: number,
  habitat: string,
  abilities: string,
}

export type PokemonDetailComp = {
  id: number,
  name: string,
  types: [TypePokemon],
  height: number,
  weight: number,
  capture_rate: number,
  abilities: string,
  habitat: string,
}