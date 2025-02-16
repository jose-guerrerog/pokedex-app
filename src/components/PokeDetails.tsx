import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { PokemonDetailComp } from "../types";
import { Card, CardContent, Typography } from "@mui/material";

const PokeDetails = ({
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
    <Card sx={{ minCard: '250px', borderRadius: 4 }}>
      <CardContent>
        <Grid container rowGap={2}>
          <Grid size={6}>
            <Typography variant="h6" fontWeight={700}>Height</Typography>
            <Typography variant="body1">{`${Math.round(height * 10) / 100} m`}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" fontWeight={700}>Capture rate</Typography>
            <Typography variant="body1">{`${
              Math.round(capture_rate * 100) / 100
            }%`}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" fontWeight={700}>Weight</Typography>
            <Typography variant="body1">{`${Math.round(weight * 10) / 100} Kg`}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" fontWeight={700}>Abilities</Typography>
            <Typography variant="body1">{abilities}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" fontWeight={700}>Habitat</Typography>
            <Typography variant="body1">{habitat}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PokeDetails;
