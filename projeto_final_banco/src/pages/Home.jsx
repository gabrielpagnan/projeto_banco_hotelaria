import { Box, Typography, Grid, Card, CardContent, CardActionArea, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';

function StatCard({ icon, title, value, description, onClick }) {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{ 
          height: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            p: 1,
            borderRadius: 2,
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" color="primary" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

function Home() {
  const navigate = useNavigate();
  
  const stats = [
    {
      icon: <PeopleIcon />,
      title: 'Clientes',
      value: '150+',
      description: 'Clientes cadastrados em nosso sistema',
      path: '/clientes'
    },
    {
      icon: <HotelIcon />,
      title: 'Quartos',
      value: '50',
      description: 'Quartos disponíveis para reserva',
      path: '/quartos'
    },
    {
      icon: <EventIcon />,
      title: 'Reservas',
      value: '300+',
      description: 'Reservas realizadas este mês',
      path: '/reservas'
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Taxa de Ocupação',
      value: '85%',
      description: 'Média de ocupação mensal',
      path: '/reservas'
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Bem-vindo ao Sistema Hoteleiro
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Gerencie seus clientes, quartos e reservas de forma simples e eficiente
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              onClick={() => navigate(stat.path)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Home; 