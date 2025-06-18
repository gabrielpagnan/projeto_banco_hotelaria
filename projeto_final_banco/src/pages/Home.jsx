import { Container, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bem-vindo ao Sistema de Gerenciamento Hoteleiro
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6">Clientes</Typography>
            <Typography>Gerencie os dados dos hóspedes</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6">Quartos</Typography>
            <Typography>Controle a disponibilidade dos quartos</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6">Reservas</Typography>
            <Typography>Gerencie as reservas e check-ins</Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 