import * as React from 'react'

import { Container, Box, Link, TextField, Button, Typography, Divider } from '@mui/material'
import { authenticateAsync } from '../../redux/auth/token'
import { useAppDispatch } from '../../redux/hooks'

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="GrayText" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/miklebel/">
        miklebel
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function SignIn() {
  const dispatch = useAppDispatch()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const loginData = data.get('login')
    const passwordData = data.get('password')
    await dispatch(
      authenticateAsync({
        username: typeof loginData === 'string' ? loginData : '',
        password: typeof passwordData === 'string' ? passwordData : ''
      })
    )
  }

  return (
    <Container
      maxWidth="xl"
      style={{
        position: 'absolute',
        top: '50%',
        msTransform: 'translateY(-50%)',
        transform: 'translateY(-50%)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h2">Watchdog</Typography>
        <Divider />
        <Typography variant="caption">Facebook monitoring service.</Typography>

        <Typography style={{ marginTop: 50 }} variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
