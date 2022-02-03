import { inputObjectType } from 'nexus'

export const AvailabilityTimeInputType = inputObjectType({
  name: 'AvailabilityTimeInput',
  description:
    "Defines a start & end time for a section of a Parier's availability during a day",
  definition(t) {
    t.string('startTime')
    t.string('endTime')
  },
})

export const UserAvailabilityInputType = inputObjectType({
  name: 'UserAvailabilityInput',
  description: "A Pairer's availability related to their profile",
  definition(t) {
    t.list.nullable.field({
      name: 'monday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'tuesday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'wednesday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'thursday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'friday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'saturday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'sunday',
      type: 'AvailabilityTimeInput',
    })
  },
})

export const UserProfileInputType = inputObjectType({
  name: 'UserProfileInput',
  description: "A Pairer's profile that is submitted to the CMS",
  definition(t) {
    t.string('firstName', {
      description: "Pairer's first name",
    })
    t.string('lastName', {
      description: "Pairer's last name",
    })
    t.string('jobTitle', {
      description: "Pairer's job title",
    })
    t.string('companyUrl', {
      description: "Pairer's company url",
    })
    t.string('portfolioUrl', {
      description: "Pairer's portfoli url",
    })
    t.string('bio', {
      description: "Pairer's biography",
    })
    t.list.field({
      name: 'disciplines',
      type: 'UserDisciplines',
      description: "Pairer's disciplines",
    })
    t.string('twitter', {
      description: "Pairer's twitter url",
    })
    t.string('instagram', {
      description: "Pairer's instagram url",
    })
    t.string('linkedin', {
      description: "Pairer's linkedin url",
    })
    t.string('github', {
      description: "Pairer's github url",
    })
    /**
     * TODO: This probably needs to be an Enum
     */
    t.string('timezone', {
      description: "Pairer's timezeon",
    })
    t.field({
      name: 'availability',
      description: "Pairer's availability",
      type: 'UserAvailabilityInput',
    })
  },
})
