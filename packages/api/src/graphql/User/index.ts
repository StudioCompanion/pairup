import {
  UserType,
  UserErrorType,
  UserCreateAccountMutationReturnType,
  UserCreateTokenMutationReturnType,
  UserAccessTokenType,
} from './types'
import {
  UserAvailabilityInputType,
  UserProfileInputType,
  AvailabilityTimeInputType,
} from './inputs'
import { UserErrorCodesType, UserRoleType, UserDisciplinesType } from './enums'
import { mutations } from './mutations'
import { queries } from './queries'

export default [
  UserType,
  UserErrorType,
  UserErrorCodesType,
  UserRoleType,
  UserCreateAccountMutationReturnType,
  UserCreateTokenMutationReturnType,
  UserAvailabilityInputType,
  UserDisciplinesType,
  UserProfileInputType,
  AvailabilityTimeInputType,
  UserAccessTokenType,
  mutations,
  queries,
]
