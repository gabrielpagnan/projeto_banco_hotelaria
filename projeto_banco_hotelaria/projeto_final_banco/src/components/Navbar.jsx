import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import EventIcon from '@mui/icons-material/Event';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
    { text: 'Quartos', path: '/quartos', icon: <HotelIcon /> },
    { text: 'Reservas', path: '/reservas', icon: <EventIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            sx={{
              color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
              bgcolor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.12)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: 'text.primary',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <HotelIcon sx={{ color: theme.palette.primary.main }} />
          Sistema Hoteleiro
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                color="inherit"
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                  },
                  px: 2,
                }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar; 