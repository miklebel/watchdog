import React, { Component } from 'react'

import { Switch, Route, Router } from 'react-router-dom'
import Routes from './app/router/Routes'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import NavigationBar from './app/components/NavigationBar'
import SignIn from './app/views/login/Login'
import { Alert, CssBaseline, Snackbar } from '@mui/material'
import { history } from './app/router/History'
import { connect, Provider } from 'react-redux'
import { AppDispatch, RootState, store } from './app/redux/store'

import { hideError, hideSuccess } from './app/redux/alerts/alerts'

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})
interface IProps {
  state: RootState
  dispatch: AppDispatch
}

class App extends Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.hideSuccess = this.hideSuccess.bind(this)
    this.hideError = this.hideError.bind(this)
  }

  private hideSuccess() {
    this.props.dispatch(hideSuccess())
  }

  private hideError() {
    this.props.dispatch(hideError())
  }

  render() {
    return (
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
        <Snackbar
          open={this.props.state.alerts.successStatus}
          autoHideDuration={6000}
          onClose={this.hideSuccess}
        >
          <Alert onClose={this.hideSuccess} severity="success" sx={{ width: '100%' }}>
            {this.props.state.alerts.successMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.props.state.alerts.errorStatus}
          autoHideDuration={6000}
          onClose={this.hideError}
        >
          <Alert onClose={this.hideError} severity="error" sx={{ width: '100%' }}>
            {this.props.state.alerts.errorMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(App)
