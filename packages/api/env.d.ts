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
    // SENTRY
    SENTRY_DNS?: string
  }
}
