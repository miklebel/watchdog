import React from 'react'

import { Dashboard as DashboardIcon, Settings, Search, DynamicFeed } from '@mui/icons-material'
import Spies from '../views/spies/Spies'
import Posts from '../views/feed/Feed'

const Dashboard: React.FC = () => {
  return <h1>Home</h1>
}

const Standings: React.FC = () => {
  return <h1>Standings</h1>
}

const Routes = [
  {
    path: '/',
    icon: DashboardIcon,
    sidebarName: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/posts',
    icon: DynamicFeed,
    sidebarName: 'Feed',
    component: Posts
  },
  {
    path: '/settings',
    icon: Settings,
    sidebarName: 'Settings',
    component: Standings
  },
  {
    path: '/spies',
    icon: Search,
    sidebarName: 'Spies',
    component: Spies
  }
]

export default Routes
