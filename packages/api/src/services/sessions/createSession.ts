import { FieldResolver } from 'nexus'
import { z } from 'zod'

export const createSession: FieldResolver<'Mutation', 'sessionCreate'> = (
  _,
  args,
  ctx
) => null
