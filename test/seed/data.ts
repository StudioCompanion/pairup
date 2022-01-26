import { SeedData } from './index'

export const testData: SeedData = {
  users: [
    {
      email: 'josh@companion.studio',
      userId: '123',
      password: 'hello',
      role: 'PAIRER',
      verificationCode: 'yesplease',
      verificationTimeout: 'tomorrrow',
      verified: false,
    },
  ],
}
