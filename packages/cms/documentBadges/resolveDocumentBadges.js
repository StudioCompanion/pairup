import { PairerProfileBadge } from './pairerProfileStatusBadge'

export default function resolveDocumentBadges(props) {
  const { type } = props

  if (type === 'pairerProfile') {
    return [PairerProfileBadge]
  }

  return []
}
