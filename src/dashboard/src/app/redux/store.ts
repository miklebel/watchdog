import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import tokenReducer from './auth/token'
import userReducer from './user/user'
import spiesReducer from './spies/spies'
import feedSlice from './feed/feed'
import followerProfilersSlice from './followerProfilers/followerProfilers'
import accountsSlice from './accounts/accounts'
import alerts from './alerts/alerts'

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    user: userReducer,
    spies: spiesReducer,
    feed: feedSlice,
    followerProfilers: followerProfilersSlice,
    accounts: accountsSlice,
    alerts: alerts
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
