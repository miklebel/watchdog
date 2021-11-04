import React from 'react'

import { Dashboard as DashboardIcon, Settings, Search } from '@mui/icons-material'

const Dashboard: React.FC = () => {
  return <h1>Home</h1>
}

const Standings: React.FC = () => {
  return <h1>Standings</h1>
}

const Teams: React.FC = () => {
  return <h1>Teams</h1>
}

const Routes = [
  {
    path: '/',
    icon: DashboardIcon,
    sidebarName: 'Dashboard',
    component: Dashboard
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
    component: Teams
  }
]

export default Routes
