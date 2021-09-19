import S from '@sanity/desk-tool/structure-builder'

import { IoIosPerson } from 'react-icons/io'

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
      ])
  )
}
