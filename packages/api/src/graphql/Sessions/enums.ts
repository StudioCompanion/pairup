import { enumType } from 'nexus'
import { SessionStatus } from 'nexus-prisma'

export const SessionStatusType = enumType({
  ...SessionStatus,
  description: 'Possible status a session can have within the database',
})
