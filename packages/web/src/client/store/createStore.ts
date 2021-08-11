import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from './slices'

const store = configureStore({
  reducer: rootReducer,
})

export const initStore = (preloadedState = {}) => {
  const store = configureStore({
    preloadedState,
    reducer: rootReducer,
    devTools: true,
  })
  return store
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
