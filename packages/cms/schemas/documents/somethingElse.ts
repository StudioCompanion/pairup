export default {
  name: 'somethingElse',
  title: 'Something else',
  type: 'document',
  fields: [
    {
      name: 'report',
      title: 'Report',
      type: 'reference',
      to: [
        {
          type: 'report',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'report.title',
    },
    prepare({ title }: { title: string }) {
      return {
        title: `${title}`,
      }
    },
  },
}
