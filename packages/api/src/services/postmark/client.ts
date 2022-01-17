import { Client } from 'postmark'

export const API_TOKEN = process.env.POSTMARK_API_TOKEN || 'fake'

export const client = new Client(API_TOKEN)
