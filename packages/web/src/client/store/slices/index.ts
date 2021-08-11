/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux'
import signupReducer from './signup/slice'

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export const rootReducer = combineReducers({
  signup: signupReducer,
})
