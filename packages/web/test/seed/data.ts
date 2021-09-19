import { SeedData } from './index'

export const testData: SeedData = {
  users: [
    {
      verificationCode: '',
      verificationTimeout: '',
      verified: false,
      email: 'josh@companion.studio',
      hashedPassword: 'test',
      salt: 'hello',
      role: 'PAIRER',
      userId: 'f981adbe-991f-4c60-a807-ab574912f223',
    },
  ],
}
