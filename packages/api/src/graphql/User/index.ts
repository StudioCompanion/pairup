import {
  UserType,
  UserErrorType,
  UserErrorCodesType,
  UserRoleType,
  UserMutationReturnType,
  UserAvailabilityInputType,
  UserDisciplinesType,
  UserProfileInputType,
  AvailabilityTimeInputType,
} from './types'
import { mutations } from './mutations'
import { queries } from './queries'

export default [
  UserType,
  UserErrorType,
  UserErrorCodesType,
  UserRoleType,
  UserMutationReturnType,
  UserAvailabilityInputType,
  UserDisciplinesType,
  UserProfileInputType,
  AvailabilityTimeInputType,
  mutations,
  queries,
]
