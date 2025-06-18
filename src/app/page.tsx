"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import api from "../services/api";
import { Pokemon } from "../types";
import PokeCard from "../components/PokeCard";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { Box, TextField, Typography } from "@mui/material";
import debounce from "lodash/debounce";

const perPage = 80;

const Home = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allPokemonList, setAllPokemonList] = useState<{ name: string; url: string }[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const handleDebouncedSearch = debounce((value: string) => {
    setDebouncedSearch(value.toLowerCase());
  }, 300);

  useEffect(() => {
    handleDebouncedSearch(searchTerm);
  }, [searchTerm]);

  // Use useCallback to prevent unnecessary re-renders and ensure stable reference
  const fetchPokemons = useCallback(async () => {
    // Prevent multiple simultaneous requests and check if we've reached the end
    if (loading || !hasMore || (totalCount > 0 && offset >= totalCount)) {
      return;
    }
    
    setLoading(true);
    try {
      const pokeList = await api.get(`/pokemon?limit=${perPage}&offset=${offset}`);
      
      // Set total count on first load
      if (totalCount === 0) {
        setTotalCount(pokeList.data.count);
      }
      
      // Check if we've reached the end
      const newOffset = offset + perPage;
      const reachedEnd = newOffset >= pokeList.data.count || !pokeList.data.results.length;
      
      if (reachedEnd) {
        setHasMore(false);
      } else {
        setOffset(newOffset);
      }

      const promises = pokeList.data.results.map((item: { name: string }) =>
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

      // Only add new Pokemon if we actually got results
      if (newPokemons.length > 0) {
        setPokemons((prev) => [...prev, ...newPokemons]);
      } else {
        // If no new Pokemon, we've reached the end
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch Pokémon", err);
      // On error, stop trying to fetch more
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore, totalCount]); // Dependencies for useCallback

  useEffect(() => {
    // Fetch all Pokemon list for search
    api.get(`/pokemon?limit=1010`).then((res) => {
      setAllPokemonList(res.data.results);
    });

    // Initial fetch
    fetchPokemons();
  }, []); // Empty dependency array for initial fetch only

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
        background: "transparent",
        pb: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
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
          mt: 1,
          mb: 4,
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
      <Box px={2} py={2} sx={{ maxWidth: "1200px", margin: "0 auto", zIndex: 1, position: "relative" }}>
        {debouncedSearch.length >= 2 ? (
          <>
            {showNoResults ? (
              <Box mt={4} textAlign="center">
                <Typography variant="h6" color="textSecondary">
                  No Pokémon found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {searchResults.slice(0, 12).map((result) => (
                  <Grid item key={`search-${result.name}`} xs={12} sm={6} md={4}>
                    <SinglePokemon name={result.name} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          <InfiniteScroll
            dataLength={pokemons.length}
            next={fetchPokemons}
            hasMore={hasMore}
            scrollThreshold={0.7}
            loader={
              loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : null
            }
            endMessage={
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  You've seen all {totalCount} Pokémon!
                </Typography>
              </Box>
            }
          >
            <Grid container spacing={3}>
              {pokemons.map((pokemon, index) => (
                <Grid item key={`${pokemon.id}-${index}`} xs={12} sm={6} md={4}>
                  <PokeCard {...pokemon} isClickable />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Box>
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