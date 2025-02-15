'use client'

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

let pokemonsOriginal: any[] = [];
const perPage = 25;
const limit = 151;
let max = 0;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const handlerResult = (maximum: number, pokemons: Pokemon[]) => {
    max = maximum;
    setPokemons(pokemons);
  };

  const loadPokemons = async () => {
    let pokeList = await api.get(`/pokemon?limit=${limit}`);
    console.log(pokeList)
    const all: Pokemon[] = [];
    for (var i = 0; i < pokeList.data.results.length; i++) {
      let pokeDetails = await api.get(
        `/pokemon/${pokeList.data.results[i].name}`
      );

      var obj = {
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

    console.log(all);
    savePokemons(all);
    pokemonsOriginal = all;
    handlerResult(all.length, all);
    // SavePokemons(all);
    // pokemonsOriginal = all;
    // HandlerResult(all.length, all);
    setLoading(false);
  };

  function LoadMore() {
    console.log("print");
    setTimeout(() => {
      var limit = pokemons.length + perPage;

      setPokemons(pokemonsOriginal.slice(0, limit));

      // } else {
      //   var filterPokemons = pokemonsOriginal.filter((item) => {
      //     return (
      //       item.name.includes(query.toLowerCase()) ||
      //       item.number.includes(query)
      //     );
      //   });
      //   setPokemons(filterPokemons.slice(0, limit));
      // }
    }, 1000);
  }

  // const getData = async () => {
  //     loadPokemons();
  // }

  useEffect(() => {
    setLoading(true);
    const listLocal = verifyPokemons();
    if (listLocal === null) {
      loadPokemons();
    }

    pokemonsOriginal = listLocal;
    handlerResult(listLocal?.length, listLocal?.slice(0, perPage));
    setLoading(false)
  }, []);
  // console.log(pokemons.leng)
  return (
    <Box>
      <Header />
      {loading || !(pokemons?.length) ? (
         <CircularProgress size={20} />
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
            {pokemons.map((p, index) => (
              <Grid size={{ md: 4, sm: 6, xs: 12 }}>
                <PokeCard {...p} key={index} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default Home;
