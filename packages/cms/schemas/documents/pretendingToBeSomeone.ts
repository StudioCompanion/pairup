export default {
  name: 'pretendingToBeSomeone',
  title: 'Pretending to be Someone',
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
