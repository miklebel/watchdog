import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import tokenReducer from './auth/token'
import userReducer from './user/user'
import spiesReducer from './spies/spies'
import feedSlice from './feed/feed'

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    user: userReducer,
    spies: spiesReducer,
    feed: feedSlice
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
