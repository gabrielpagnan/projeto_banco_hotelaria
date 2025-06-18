import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import theme from './theme';
import './App.css';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Quartos from './pages/Quartos';
import Reservas from './pages/Reservas';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Navbar />
          <Container 
            maxWidth="lg" 
            sx={{ 
              flex: 1,
              py: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/quartos" element={<Quartos />} />
              <Route path="/reservas" element={<Reservas />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
