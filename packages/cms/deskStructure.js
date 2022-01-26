import S from '@sanity/desk-tool/structure-builder'

import { IoIosAlbums, IoIosDocument, IoIosPerson } from 'react-icons/io'

export default () => {
  // prettier-ignore
  return (
    S.list()
      .title('Menu')
      .items([
        // Parier Profiles
        S.listItem()
          .title('Pairer Profiles')
          .icon(IoIosPerson)
          .schemaType('pairerProfile')
          .child(
              S.documentTypeList('pairerProfile')
          ),
        // Abuse Reports
        S.listItem()
          .title('Abuse Reports')
          .icon(IoIosDocument)
          .child(
              S.list()
                .title('Categories')
                .items([
                S.listItem()
                  .title('Spam or Harmful')
                  .icon(IoIosAlbums)
                  .schemaType('spamOrHarmful')
                  .child(S.documentTypeList('spamOrHarmful')),
                S.listItem()
                  .title('Harassment or Bullying')
                  .icon(IoIosAlbums).schemaType('harassmentOrBullying')
                  .child(S.documentTypeList('harassmentOrBullying')),
                S.listItem()
                  .title('Pretending to be someone')
                  .icon(IoIosAlbums)
                  .schemaType('pretendingToBeSomeone')
                  .child(S.documentTypeList('pretendingToBeSomeone')),
                S.listItem()
                  .title('Something else')
                  .icon(IoIosAlbums)
                  .schemaType('somethingElse')
                  .child(S.documentTypeList('somethingElse')),
          ])
        )
      ])
  )
}
