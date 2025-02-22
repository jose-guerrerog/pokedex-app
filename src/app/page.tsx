"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import api from "../services/api";
import { Pokemon } from "../types";
import PokeCard from "../components/PokeCard";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import { savePokemons, verifyPokemons } from "../storage";
import { Box } from "@mui/material";

let pokemonsOriginal: Pokemon[] = [];
const perPage = 12;
const limit = 50;
let max = 0;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const handlerResult = (maximum: number, pokemons: Pokemon[]) => {
    max = maximum;
    setPokemons(pokemons);
  };

  const loadPokemons = async () => {
    const pokeList = await api.get(`/pokemon?limit=${limit}`);
    const all: Pokemon[] = [];

    const promises = [];

    for (let i = 0; i < pokeList.data.results.length; i++) {
      promises.push(api.get(`/pokemon/${pokeList.data.results[i].name}`))
    }

    const res = await Promise.all(promises);
    for (let i = 0; i < res.length; i++) {
      const pokeDetails = await api.get(
        `/pokemon/${pokeList.data.results[i].name}`
      );

      const obj = {
        name: pokeDetails.data.name,
        id: pokeDetails.data.id,
        types: pokeDetails.data.types,
        number: pokeDetails.data.id.toString().padStart(3, "0"),
        image:
          pokeDetails.data.sprites.versions["generation-v"]["black-white"]
            .animated.front_default,
      };
      all.push(obj);
    }

    savePokemons(all);
    pokemonsOriginal = all;
    handlerResult(all.length, all);
    setLoading(false);
  };

  function LoadMore() {
    setTimeout(() => {
      const limit = pokemons.length + perPage;
      setPokemons(pokemonsOriginal.slice(0, limit));
    }, 1000);
  }

  useEffect(() => {
    setLoading(true);
    const listLocal = verifyPokemons();
    if (listLocal === null) {
      loadPokemons();
    }

    pokemonsOriginal = listLocal;
    handlerResult(listLocal?.length, listLocal?.slice(0, perPage));
    setLoading(false);
  }, []);
  return (
    <Box>
      <Header />
      {loading || !pokemons?.length ? (
        <Box sx={{ display: "flex", justifyContent: "center" }} mt={8}>
          <CircularProgress size={30} color="secondary"/>
        </Box>
      ) : (
        <InfiniteScroll
          style={{ overflow: "none" }}
          dataLength={pokemons.length}
          next={LoadMore}
          hasMore={pokemons.length < max}
          loader={
            <div className="mb-4 d-flex justify-content-center align-item-center">
              <CircularProgress size={20} />
            </div>
          }
        >
          <Grid container mt={4} spacing={3}>
            {pokemons.map((pokemon, index) => (
              <Grid size={{ md: 4, sm: 6, xs: 12 }} key={index}>
                <PokeCard {...pokemon} key={`pokemon-${index}`} isClickable />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default Home;
