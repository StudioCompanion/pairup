import { Message as PMessage } from 'postmark'
import { Message, PaireeAlias, Session, User } from '@prisma/client'
import { sendEmail } from '../postmark/sendEmail'

interface CompleteSession extends Session {
  pairer: User
  pairee: PaireeAlias
}

export const sendMessage = async (
  session: CompleteSession,
  messages: Message[]
) => {
  const [{ message, sentBy }, ...restMessages] = messages

  const isPairer = sentBy === 'PAIRER'

  const id = isPairer ? session.pairerId : session.pairee.userId

  const email: PMessage = {
    To: isPairer ? session.email : session.pairer.email,
    From: `${id}@pair-up.co.uk`,
    ReplyTo: `reply+${id}_${session.id}@pair-up.co.uk`,
    Subject: `Re: PairUp Session ${session.appointment}`,
    MessageStream: 'outbound',
    TextBody: message,
  }

  await sendEmail(email)
}
