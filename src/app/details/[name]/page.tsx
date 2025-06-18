"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import PokeCard from "@/components/PokeCard";
import PokeDetails from "@/components/PokeDetails";
import PokeStats from "@/components/PokeStats";
import { Box, Grid, CircularProgress } from "@mui/material";
import { PokemonDetails } from "@/types";

type Item = {
  ability: {
    name: string;
  };
};

const DetailsPokemon = () => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>();
  const params = useParams();
  const name = params.name;

  const loadPokemon = async () => {
    try {
      const pokemonData = await api.get(`/pokemon/${name}`);
      const dataPokemonData = pokemonData.data;
      const pokemonAddDetails = await api.get(`/pokemon-species/${name}`);
      const dataPokemonAddDetails = pokemonAddDetails.data;

      let abilities = "";
      dataPokemonData.abilities.map((item: Item, index: number) => {
        abilities += `${item.ability.name}${
          dataPokemonData.abilities.length === index + 1 ? "" : ", "
        }`;
      });

      const details: PokemonDetails = {
        id: dataPokemonData.id,
        name: dataPokemonData.name,
        types: dataPokemonData.types,
        height: dataPokemonData.height,
        weight: dataPokemonData.weight,
        stats: dataPokemonData.stats,
        image: dataPokemonData.sprites.front_default,
        gender_rate: dataPokemonAddDetails.gender_rate,
        capture_rate: dataPokemonAddDetails.capture_rate,
        habitat: dataPokemonAddDetails.habitat?.name,
        abilities,
      };

      setPokemonDetails(details);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  if (!pokemonDetails) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={30} color="secondary" />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
          pb: 6,
        }}
      >
        {/* Pokémon Card */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <PokeCard
            name={pokemonDetails.name}
            id={pokemonDetails.id}
            types={pokemonDetails.types}
            image={pokemonDetails.image}
            number={pokemonDetails.id.toString().padStart(3, "0")}
          />
        </Box>

        {/* Details + Stats side-by-side */}
        <Grid container spacing={4} justifyContent="center" maxWidth="md">
          <Grid item xs={12} md={6}>
            <PokeDetails
              id={pokemonDetails.id}
              height={pokemonDetails.height}
              weight={pokemonDetails.weight}
              capture_rate={pokemonDetails.capture_rate}
              abilities={pokemonDetails.abilities}
              habitat={pokemonDetails.habitat}
              name={pokemonDetails.name}
              types={pokemonDetails.types}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PokeStats stats={pokemonDetails.stats} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DetailsPokemon;
