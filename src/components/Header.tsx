import { Box, Typography } from "@mui/material";

const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        mt: 2,
        mb: 1,
        background: "transparent",
        zIndex: 1,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontFamily: "'Luckiest Guy', cursive",
          color: "#ffcc00",
          textShadow: "2px 2px #333",
          letterSpacing: 2,
          fontSize: { xs: "2.5rem", md: "4rem" },
          textAlign: "center",
        }}
      >
        Pokédex
      </Typography>
    </Box>
  );
};

export default Header;
