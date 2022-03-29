import { AdminClient, ServerClient } from 'postmark'

export const API_TOKEN = process.env.POSTMARK_API_TOKEN || 'fake'

export const ADMIN_API_TOKEN = process.env.POSTMARK_ADMIN_API_TOKEN || 'fake'

export const client = new ServerClient(API_TOKEN)

export const admin = new AdminClient(ADMIN_API_TOKEN)
