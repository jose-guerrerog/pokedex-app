import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../utils";
import Link from "next/link";
import { PokemonCard } from "../types";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
} from "@mui/material";
import { mapTypeBackground, mapTypeColor } from "../constants";

const PokeCard = ({
  name,
  id,
  types,
  image,
  isClickable = false,
}: PokemonCard) => {
  const [, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [id]);

  return (
    <Link
      href={{
        pathname: `/details/${name}`,
      }}
      {...(!isClickable && {
        style: {
          cursor: "default",
        },
      })}
    >
      <Card
        sx={{
          height: "250px",
          background: mapTypeBackground.get(types[0].type.name),
          borderRadius: 4,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h4" sx={{ color: "#FFFFFF" }}>
                {capitalizeFirstLetter(name)}
              </Typography>
              <Typography variant="h4" sx={{ color: "#FFFFFF" }}>
                {`# ${id.toString().padStart(3, "0")}`}
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <img
            onError={() => setError(true)}
            className="animation-up-down"
            alt={name}
            title={name}
            src={image}
            width="80"
            height="80"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 0.5,
              mt: 3,
            }}
          >
            {types.map((item, index) => {
              console.log(item.type.name);
              return (
                <Chip
                  label={
                    <Typography variant="body1" color="#FFF">
                      {capitalizeFirstLetter(item.type.name)}
                    </Typography>
                  }
                  key={index}
                  sx={{
                    background: mapTypeColor.get(item.type.name),
                  }}
                />
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PokeCard;
