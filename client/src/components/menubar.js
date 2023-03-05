import * as React from 'react';
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, Avatar} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../Redux/Reducers/auth';
import { useNavigate } from 'react-router-dom';

const privatePages = [
  {
    title: 'Packages',
    url: 'packages'
  }
];

const publicPages = [
    {
        title: 'Login',
        url: 'login'
    },
    {
        title: 'Register',
        url: 'register'
    }
];

function MenuBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.loginResponse);

  const { pathname } = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const HandleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setLogout());
    navigate('/');
  }

  return (
    <AppBar position="static" sx={{bgcolor: 'white', color : 'black'}}>
      <Container>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link to="/" className='linkDecoration'>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
                
              }}
            >
              LOGO
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {publicPages.map((page) => (
                <Link to={page.url} key={page.title} className='linkDecoration'>
                    <MenuItem>
                        <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
            {user ?
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'space-between'  } }} > 
                <Box sx={{ display: { md: 'flex', justifyContent: 'space-between'  } }}>
                  {privatePages.map((page) => (
                    <Link to={page.url} key={page.title} className='linkDecoration'>
                        <Button
                            className={ pathname.substring(1) === page.url ? 'activeButton' : '' }
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >              
                            {page.title}
                        </Button>
                    </Link>
                  ))}                
                </Box>           

                <Box sx={{
                      display: 'flex',
                      columnGap: '20px'
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '10px'
                  }}>
                    <Typography variant='p'>{user.username}</Typography>
                    <Avatar alt="profile image" src={user.profileImage} />
                  </Box>
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{ my: 2, color: 'black', display: 'block', borderColor:'black' }}
                    onClick={HandleLogout}
                  >
                    LOGOUT
                  </Button>
                </Box>

            </Box>
             : 
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} >            
              {publicPages.map((page) => (
                  <Link to={page.url} key={page.title} className='linkDecoration'>
                      <Button
                          className={ pathname.substring(1) === page.url ? 'activeButton' : '' }
                          sx={{ my: 2, color: 'black', display: 'block' }}
                      >              
                          {page.title}
                      </Button>
                  </Link>
              ))}
            </Box>
            }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MenuBar;