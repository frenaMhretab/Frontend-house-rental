import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import {useEffect, useState} from 'react'
import { useNavigate, Route } from "react-router-dom";
import Header from '../../common/header';
import jwt_decode from "jwt-decode";
import { instance } from '../../index';

const theme = createTheme();

export default function LogIn() {

  const navigate = useNavigate();

  const [loginError, setLoginError] = useState("");

  const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    instance.post('/authentication/authenticate', {
        username : data.get('email'),
        password:data.get('password')
    }).then(response =>{
        console.log(response.data)
        let jwt = response.data.jwt
        localStorage.setItem('jwt',JSON.stringify(jwt))
        let decoded = jwt_decode(jwt)
        let user = (JSON.parse(decoded.sub));
        localStorage.setItem('user',JSON.stringify(user))
        navigate('/')
        
    }).catch(err =>{
      console.log(err)
      setLoginError('You have entered invalid username or password!')
    })
  
  };

  useEffect(() => {
    let localValue = localStorage.getItem('jwt')
    if(localValue){
      navigate("/");
    }else{
      navigate("/login");
    }
    
  },[])

  return (
    <ThemeProvider theme={theme}>
      <Header/>
      <Container component="main" maxWidth="xs" className='reg-background'>
        
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {loginError.length > 0 ? <Alert severity="error">{loginError}</Alert>: null}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
