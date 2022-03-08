import React from 'react'

import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Search,
  DynamicFeed,
  ManageAccounts
} from '@mui/icons-material'
import Spies from '../views/spies/Spies'
import Posts from '../views/feed/Feed'
import FollowerProfilers from '../views/followerProfilers/FollowerProfilers'
import Settings from '../views/settings/Settings'

const Dashboard: React.FC = () => {
  return <h1>Home</h1>
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
    icon: SettingsIcon,
    sidebarName: 'Settings',
    component: Settings
  },
  {
    path: '/spies',
    icon: Search,
    sidebarName: 'Spies',
    component: Spies
  },
  {
    path: '/followerProfilers',
    icon: ManageAccounts,
    sidebarName: 'Follower Profilers',
    component: FollowerProfilers
  }
]

export default Routes
