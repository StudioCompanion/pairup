declare namespace NodeJS {
  export interface ProcessEnv {
    // ENV
    PORT?: string
    DATABASE_URL?: string
    ENV?: string
    // SANITY
    SANITY_DATASET?: string
    SANITY_PROJECT_ID?: string
    SANITY_API_KEY?: string
    SANITY_SECRET?: string
    // SENTRY
    SENTRY_DNS?: string
    // POSTMARK
    POSTMARK_API_TOKEN?: string
    POSTMARK_FROM_EMAIL?: string
    POSTMARK_ADMIN_EMAIL?: string
    POSTMARK_TEMPLATE_ID_VERIFY?: string
    POSTMARK_TEMPLATE_NEW_USER?: string
    POSTMARK_TEMPLATE_ID_LIVE_PROFILE?: string
    POSTMARK_TEMPLATE_ID_NEW_SESSION?: string
    POSTMARK_TEMPLATE_ID_CANCELLED_SESSION?: string
    POSTMARK_TEMPLATE_ID_NEW_REPORT?: string
    // JWT
    JWT_SECRET?: string
    // AIRTABLE
    AIRTABLE_API_KEY?: string
    AIRTABLE_REPORTS_ID?: string
  }
}
