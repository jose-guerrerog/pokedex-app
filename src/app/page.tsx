"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";
import { Pokemon } from "../types";
import PokeCard from "../components/PokeCard";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { Box, TextField, Typography } from "@mui/material";
import debounce from "lodash/debounce";

const perPage = 24;

const Home = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(`/pokemon?limit=${perPage}`);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allPokemonList, setAllPokemonList] = useState<{ name: string; url: string }[]>([]);

  const handleDebouncedSearch = debounce((value: string) => {
    setDebouncedSearch(value.toLowerCase());
  }, 300);

  useEffect(() => {
    handleDebouncedSearch(searchTerm);
  }, [searchTerm]);

  const fetchPokemons = async () => {
    if (!nextUrl) return;
    setLoading(true);
    try {
      const pokeList = await api.get(nextUrl);
      setNextUrl(pokeList.data.next?.replace("https://pokeapi.co/api/v2", "") || null);

      const promises = pokeList.data.results.map((item: { name: string; url: string }) =>
        api.get(`/pokemon/${item.name}`)
      );

      const res = await Promise.all(promises);
      const newPokemons = res
        .map(({ data }) => {
          const image =
            data.sprites.versions["generation-v"]["black-white"].animated.front_default ??
            data.sprites.front_default;

          if (!image) return null;

          return {
            name: data.name,
            id: data.id,
            types: data.types,
            number: data.id.toString().padStart(3, "0"),
            image,
          };
        })
        .filter(Boolean) as Pokemon[];

      setPokemons((prev) => [...prev, ...newPokemons]);
    } catch (err) {
      console.error("Failed to fetch Pokémon", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get(`/pokemon?limit=1010`).then((res) => {
      setAllPokemonList(res.data.results);
    });

    fetchPokemons();
  }, []);

  const searchResults =
    debouncedSearch.length >= 2
      ? allPokemonList.filter((p) => p.name.includes(debouncedSearch))
      : [];

  const showNoResults =
    debouncedSearch.length >= 2 && searchResults.length === 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #fdfbfb, #ebedee)",
        pb: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background bubbles */}
      <Box sx={{
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "rgba(255, 204, 0, 0.2)",
        top: "10%",
        left: "5%",
        filter: "blur(80px)",
        zIndex: 0,
      }} />
      <Box sx={{
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "rgba(0, 100, 255, 0.15)",
        bottom: "5%",
        right: "10%",
        filter: "blur(100px)",
        zIndex: 0,
      }} />

      <Header />

      {/* Search Input */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          mb: 2,
          px: 2,
          zIndex: 1,
          position: "relative",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "500px" }}>
          <TextField
            fullWidth
            label="Search Pokémon by name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 1,
                px: 1,
              },
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      {debouncedSearch.length >= 2 ? (
        <>
          {showNoResults ? (
            <Box mt={4} px={2} textAlign="center">
              <Typography variant="h6" color="textSecondary">
                No Pokémon found
              </Typography>
            </Box>
          ) : (
            <Box px={2} py={2} sx={{ maxWidth: "1200px", margin: "0 auto", zIndex: 1, position: "relative" }}>
              <Grid container spacing={3}>
                {searchResults.slice(0, 12).map((result) => (
                  <Grid item key={`search-${result.name}`} xs={12} sm={6} md={4}>
                    <SinglePokemon name={result.name} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      ) : (
        <>
          {pokemons.length === 0 && loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
              <CircularProgress size={30} color="secondary" />
            </Box>
          ) : (
            <InfiniteScroll
              dataLength={pokemons.length}
              next={fetchPokemons}
              hasMore={!!nextUrl}
              loader={
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                  <CircularProgress size={20} />
                </Box>
              }
            >
              <Box px={2} py={2} sx={{ maxWidth: "1200px", margin: "0 auto", zIndex: 1, position: "relative" }}>
                <Grid container spacing={3}>
                  {pokemons.map((pokemon) => (
                    <Grid item key={`infinite-${pokemon.id}`} xs={12} sm={6} md={4}>
                      <PokeCard {...pokemon} isClickable />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </InfiniteScroll>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;

const SinglePokemon = ({ name }: { name: string }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    api.get(`/pokemon/${name}`).then(({ data }) => {
      const image =
        data.sprites.versions["generation-v"]["black-white"].animated.front_default ??
        data.sprites.front_default;

      if (!image) return;

      setPokemon({
        name: data.name,
        id: data.id,
        types: data.types,
        number: data.id.toString().padStart(3, "0"),
        image,
      });
    });
  }, [name]);

  return pokemon ? <PokeCard {...pokemon} isClickable /> : <CircularProgress size={20} />;
};
