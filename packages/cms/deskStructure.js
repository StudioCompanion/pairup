import S from '@sanity/desk-tool/structure-builder'

import { UserList, UserCircleMinus } from 'phosphor-react'

export default () => {
  // prettier-ignore
  return (
    S.list()
      .title('Menu')
      .items([
        // Pairer Profiles
        S.listItem()
          .title('Pairer Profiles')
          .icon(UserList)
          .schemaType('pairerProfile')
          .child(
              S.documentTypeList('pairerProfile')
          ),
        // Blacklisted Emails
        S.listItem()
        .title('Blacklisted Emails')
        .icon(UserCircleMinus)
        .schemaType('blacklistedEmails')
        .child(
          S.documentTypeList('blacklistedEmails')
        ),
      ])
  )
}
