import { Card, CardContent, Typography, Box } from "@mui/material";
import { PokemonDetailComp } from "@/types";
import { InfoOutlined } from "@mui/icons-material";

const PokeDetails = ({
  height,
  weight,
  capture_rate,
  abilities,
  habitat,
}: PokemonDetailComp) => {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <InfoOutlined sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Details
          </Typography>
        </Box>

        <Box mb={1}>
          <Typography>
            📏 <strong>Height:</strong> {(height / 10).toFixed(1)} m
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography>
            ⚖️ <strong>Weight:</strong> {(weight / 10).toFixed(1)} kg
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography>
            🎯 <strong>Capture Rate:</strong> {capture_rate}%
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography>
            🧠 <strong>Abilities:</strong> {abilities}
          </Typography>
        </Box>
        <Box>
          <Typography>
            🌿 <strong>Habitat:</strong> {habitat}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PokeDetails;
