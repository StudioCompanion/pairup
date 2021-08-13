export enum SIGNUP_STAGE {
  START = 'START',
  ACCOUNT_DETAILS = 'ACCOUNT_DETAILS',
  PERSONAL_DETAILS = 'PERSONAL_DETAILS',
  AVAILABILITY = 'AVAILABILITY',
}

export enum SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  password = 'password',
}

export enum SIGNUP_PERSONAL_DETAIL_FIELD_NAMES {
  jobTitle = 'jobTitle',
  companyUrl = 'companyUrl',
  portfolioUrl = 'portfolioUrl',
  bio = 'bio',
  disciplines = 'disciplines',
  twitter = 'twitter',
  instagram = 'instagram',
  linkedin = 'linkedin',
  github = 'github',
}

export enum SIGNUP_AVAILABILITY_FIELD_NAMES {
  timezone = 'timezone',
  startTime = 'startTime',
  endTime = 'endTime',
}
