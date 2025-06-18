import { Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";
import { PokemonStat } from "@/types";

type Props = {
  stats: PokemonStat[];
};

const MAX_STAT = 160;

const labelMap: { [key: string]: string } = {
  hp: "❤️ HP",
  attack: "⚔️ Attack",
  defense: "🛡️ Defense",
  speed: "⚡ Speed",
  "special-attack": "✨ Sp. Atk",
  "special-defense": "🛡️ Sp. Def",
};

const PokeStats = ({ stats }: Props) => {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
            📊 Base Stats
          </Typography>
        </Box>

        {stats.map((stat) => {
          const label = labelMap[stat.stat.name] || stat.stat.name;
          const percent = (stat.base_stat / MAX_STAT) * 100;

          return (
            <Box key={stat.stat.name} mb={2}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography>{label}</Typography>
                <Typography>{stat.base_stat}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "green",
                  },
                }}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PokeStats;
