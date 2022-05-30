/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'

import { NavLink, withRouter } from 'react-router-dom'
import Routes from '../router/Routes'

import { createStyles, makeStyles } from '@mui/styles'

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material'
import { Menu, Logout } from '@mui/icons-material'
import { connect } from 'react-redux'
import { RootState } from '../redux/store'
import { getUserAsync } from '../redux/user/user'
import { logout } from '../redux/auth/token'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: 2
    },
    title: {
      flexGrow: 1,
      paddingLeft: 20
    },
    drawer: {
      width: 300
    },
    fullList: {
      width: 'auto'
    }
  })
)

const NavigationBar: React.FC = (props: any) => {
  const classes = useStyles()
  useEffect(() => {
    props.dispatch(getUserAsync(props.state))
  }, [])
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setIsOpen(open)
  }

  const activeRoute = (routeName: any) => {
    return props.location.pathname === routeName ? true : false
  }

  const logoutAction = () => {
    props.dispatch(logout())
  }

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <Menu />
            </IconButton>
            <Typography variant="h5" className={classes.title}>
              {Routes.find(route => route.path === props.location.pathname)?.sidebarName}
            </Typography>
            {props?.state?.user?.user?.username}
            <Button onClick={logoutAction} color="inherit">
              <Logout />
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer classes={{ paper: classes.drawer }} open={isOpen} onClose={toggleDrawer(false)}>
        <div
          className={classes.fullList}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {Routes.map((prop, key) => {
              return (
                <NavLink style={{ textDecoration: 'none' }} to={prop.path} key={key}>
                  <ListItem
                    button
                    key={key}
                    style={{ color: 'Menu' }}
                    selected={activeRoute(prop.path)}
                  >
                    <ListItemIcon>
                      <prop.icon />
                    </ListItemIcon>
                    <ListItemText>{prop.sidebarName}</ListItemText>
                  </ListItem>
                </NavLink>
              )
            })}
          </List>
        </div>
      </Drawer>
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  return { state }
}

export default connect(mapStateToProps)(withRouter(NavigationBar))
