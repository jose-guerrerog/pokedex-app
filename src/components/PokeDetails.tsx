import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../utils";
import Grid from "@mui/material/Grid2";
import { PokemonDetailComp } from "../types";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";

const PokeDetails = ({
  name,
  id,
  height,
  weight,
  abilities,
  capture_rate,
  habitat,
}: PokemonDetailComp) => {
  const [, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [id]);

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid size={6}>
            <Typography variant="h5">Height</Typography>
            <Typography variant="h6">{`${Math.round(height * 10) / 100} m`}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h5">Capture rate</Typography>
            <Typography variant="h6">{`${
              Math.round(capture_rate * 100) / 100
            }%`}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h5">Weight</Typography>
            <Typography variant="h6">{`${Math.round(weight * 10) / 100} Kg`}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h5">Abilities</Typography>
            <Typography variant="h6">{abilities}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h5">Habitat</Typography>
            <Typography variant="h6">{habitat}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PokeDetails;
