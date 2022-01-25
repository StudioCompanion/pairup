import {
  UserType,
  UserErrorType,
  UserErrorCodesType,
  UserRoleType,
  UserMutationReturnType,
} from './types'
import { mutations } from './mutations'
import { queries } from './queries'

export default [
  UserType,
  UserErrorType,
  UserErrorCodesType,
  UserRoleType,
  UserMutationReturnType,
  mutations,
  queries,
]
