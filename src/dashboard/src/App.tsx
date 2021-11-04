import React from 'react'

import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Routes from './app/views/Routes'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import NavigationBar from './app/components/NavigationBar'

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavigationBar />

        <Switch>
          {Routes.map((route: any) => (
            <Route exact path={route.path} key={route.path}>
              <route.component />
            </Route>
          ))}
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
