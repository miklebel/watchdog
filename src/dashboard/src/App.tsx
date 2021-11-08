import React from 'react'

import { Switch, Route, Router } from 'react-router-dom'
import Routes from './app/router/Routes'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import NavigationBar from './app/components/NavigationBar'
import SignIn from './app/views/login/Login'
import { CssBaseline } from '@mui/material'
import { history } from './app/router/History'
import { Provider } from 'react-redux'
import { store } from './app/redux/store'

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={history}>
          <Switch>
            {Routes.map((route: any) => (
              <Route exact path={route.path} key={route.path}>
                <NavigationBar />
                <route.component />
              </Route>
            ))}
            <Route path="/login">
              <SignIn />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
