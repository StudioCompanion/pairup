import S from '@sanity/desk-tool/structure-builder'

import { UserList } from 'phosphor-react'

export default () => {
  // prettier-ignore
  return (
    S.list()
      .title('Menu')
      .items([
        // Parier Profiles
        S.listItem()
          .title('Pairer Profiles')
          .icon(UserList)
          .schemaType('pairerProfile')
          .child(
              S.documentTypeList('pairerProfile')
          ),
      ])
  )
}
