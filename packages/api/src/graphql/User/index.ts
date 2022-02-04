import {
  UserType,
  // UserErrorType,
  UserCreateAccountPayloadType,
  UserCreateTokenPayloadType,
  UserAccessTokenType,
  UserUpdateAccountPayloadType,
  UserRecoverPayloadType,
} from './types'
import { ErrorType } from '../types'
import {
  UserAvailabilityInputType,
  UserProfileInputType,
  AvailabilityTimeInputType,
} from './inputs'
import { UserRoleType, UserDisciplinesType } from './enums'
import { ErrorCodesType } from '../enums'
import { mutations } from './mutations'
import { queries } from './queries'

export default [
  UserType,
  // UserErrorType,
  // UserErrorCodesType,
  UserRoleType,
  UserCreateAccountPayloadType,
  UserCreateTokenPayloadType,
  UserAvailabilityInputType,
  UserDisciplinesType,
  UserProfileInputType,
  AvailabilityTimeInputType,
  UserAccessTokenType,
  UserUpdateAccountPayloadType,
  UserRecoverPayloadType,
  mutations,
  queries,
  ErrorType,
  ErrorCodesType,
]
