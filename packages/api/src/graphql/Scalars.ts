import { GraphQLDate } from 'graphql-iso-date'
import { asNexusMethod } from 'nexus'

export const DateTime = asNexusMethod(GraphQLDate, 'date')
