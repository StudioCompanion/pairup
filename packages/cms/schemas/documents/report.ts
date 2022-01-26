export default {
  name: 'report',
  title: 'Report',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    {
      name: 'reportUserType',
      title: 'Are you a Pairer or a Pairee?',
      type: 'string',
      options: { list: ['Pairer', 'Pairee'] },
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title: string }) {
      return {
        title: `${title}`,
      }
    },
  },
}
