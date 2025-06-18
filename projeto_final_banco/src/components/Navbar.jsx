import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema Hoteleiro
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/clientes">
          Clientes
        </Button>
        <Button color="inherit" component={RouterLink} to="/quartos">
          Quartos
        </Button>
        <Button color="inherit" component={RouterLink} to="/reservas">
          Reservas
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 