import { PAIRER_PROFILE_STATUS } from '@pairup/shared'

export const PairerProfileBadge = (props) => {
  const { published, draft } = props

  if (
    (!published &&
      draft &&
      draft.status === PAIRER_PROFILE_STATUS.AWAITING_APPROVAL) ||
    (published && published.status === PAIRER_PROFILE_STATUS.AWAITING_APPROVAL)
  ) {
    return {
      label: 'Awaiting Approval',
      color: 'warning',
      title: 'This profile requires approval before it can be live!',
    }
  } else if (draft && draft.status === PAIRER_PROFILE_STATUS.REJECTED) {
    return {
      label: 'Rejected',
      color: 'danger',
      title: 'This profile has been rejected.',
    }
  } else {
    return {
      label: 'Approved',
      color: 'success',
      title: 'This profile has been approved and is live!',
    }
  }
}
