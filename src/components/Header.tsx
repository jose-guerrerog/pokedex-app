import { Box } from "@mui/material"

const Header = () => {
  return (
    <Box
      component='div'
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <img
        src="/assets/logo_pokedex.png"
        height='100'
      />
    </Box>
  )
}

export default Header