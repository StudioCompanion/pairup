import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from './slices'

const store = configureStore({
  reducer: rootReducer,
})

const isProd = process.env.NODE_ENV === 'production'

export const initStore = (preloadedState = {}) => {
  const store = configureStore({
    preloadedState,
    reducer: rootReducer,
    devTools: !isProd,
  })
  return store
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
