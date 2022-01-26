export default {
  name: 'spamOrHarmful',
  title: 'Spam or Harmful',
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
