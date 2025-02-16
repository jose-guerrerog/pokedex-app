import Grid from "@mui/material/Grid2";
import { Card, CardContent, Typography } from "@mui/material";
import { PokemonStat } from "../types";

type PokemonStatComp = {
  stats: PokemonStat[];
};

const PokeStats = ({ stats }: PokemonStatComp) => {
  return (
    <Card sx={{ borderRadius: 4, maxWidth: "500px" }}>
      <CardContent>
        {
          <Grid container>
            {stats.map((stat, index) => (
              <Grid container size={12} key={`stat-${index}`}>
                <Grid size={6}>
                  <Typography variant="h6" fontWeight={700} align="center">
                    {stat.stat.name}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body1" align="center">
                    {stat.base_stat}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        }
      </CardContent>
    </Card>
  );
};

export default PokeStats;
