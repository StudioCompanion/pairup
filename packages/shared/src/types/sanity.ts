import { PairerProfile, SanityDocument } from './sanity.generated'

export type PairerProfileCreationDocument = Omit<
  PairerProfile,
  keyof Omit<SanityDocument, '_id'>
>
