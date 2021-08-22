import { SeedData } from './index'

export const testData: SeedData = {
  users: [
    {
      firstName: 'Josh',
      lastName: 'Ellis',
      email: 'josh@companion.studio',
      hashedPassword: 'test',
      salt: 'hello',
      role: 'PAIRER',
      userId: 'f981adbe-991f-4c60-a807-ab574912f223',
      pairerDetails: {
        create: {
          jobTitle: 'Developer',
          companyUrl: 'https://www.companion.studio',
          portfolioUrl: 'www.joshellis.co.uk',
          bio: 'I am a developer and I build things',
          disciplines: ['Development', '3D', 'Product'],
          twitter: '_josh_ellis_',
          instagram: '',
          linkedin: '',
          github: 'joshuaellis',
          userId: 'f981adbe-991f-4c60-a807-ab574912f223',
          availability: {
            create: {
              // id: '1',
              // createdAt: '2021-08-22T17:46:27.720Z' as unknown as Date,
              // modifiedAt: '2021-08-22T17:46:27.720Z' as unknown as Date,
              timezone: 'GMT',
              monday: [
                {
                  startTime: '09:00',
                  endTime: '18:00',
                },
              ],
              tuesday: [
                {
                  startTime: '12:00',
                  endTime: '16:00',
                },
              ],
              wednesday: [
                {
                  startTime: '00:00',
                  endTime: '00:00',
                },
              ],
              thursday: [
                {
                  startTime: '00:00',
                  endTime: '00:00',
                },
              ],
              friday: [
                {
                  startTime: '00:00',
                  endTime: '00:00',
                },
              ],
              saturday: [
                {
                  startTime: '10:00',
                  endTime: '12:00',
                },
              ],
              sunday: [
                {
                  startTime: '15:00',
                  endTime: '18:00',
                },
              ],
              userId: 'f981adbe-991f-4c60-a807-ab574912f223',
            },
          },
        },
      },
    },
  ],
}
