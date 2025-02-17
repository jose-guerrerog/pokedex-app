"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Grid from "@mui/material/Grid2";
import { PokemonDetails } from "@/types";
import { Box, CircularProgress } from "@mui/material";
import PokeCard from "@/components/PokeCard";
import PokeDetails from "@/components/PokeDetails";
import PokeStats from "@/components/PokeStats";
import { useParams } from "next/navigation";
import Header from "@/components/Header";

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

      const pokemonDetails = {
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
      setPokemonDetails(pokemonDetails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  if (!pokemonDetails) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }} mt={8}>
        <CircularProgress size={30} color="secondary" />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
        mt={5}
      >
        <Grid container sx={{ maxWidth: "800px" }} spacing={2}>
          <Grid container sx={{ alignItems: "center" }}>
            <Grid size={{ sm: 6, xs: 12 }}>
              <PokeCard
                name={pokemonDetails?.name || ""}
                id={pokemonDetails?.id || 0}
                types={pokemonDetails?.types}
                image={pokemonDetails.image}
                number="2"
              />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <PokeDetails
                name={pokemonDetails?.name || ""}
                id={pokemonDetails?.id || 0}
                types={pokemonDetails?.types}
                capture_rate={pokemonDetails.capture_rate}
                height={pokemonDetails.height}
                weight={pokemonDetails.weight}
                abilities={pokemonDetails.abilities}
                habitat={pokemonDetails.habitat}
              />
            </Grid>
          </Grid>
          <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <PokeStats stats={pokemonDetails.stats} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DetailsPokemon;
