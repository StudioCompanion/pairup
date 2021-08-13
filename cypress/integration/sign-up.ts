describe('sign-up', () => {
  beforeEach(() => {
    cy.visit(`/sign-up`)
  })

  it('should allow you to create an account', () => {
    // go to account details
    cy.findByText('That’s me! Sign up').click()

    // fill in account details
    cy.findByLabelText('First Name').type('Josh')
    cy.findByLabelText('Last Name').type('Ellis')
    cy.findByLabelText('Email').type('josh@companion.studio')
    cy.findByLabelText('Password').type('apples')

    // go to personal details
    cy.findByText('Continue to Personal Details').click()

    // fill in personal details
    cy.findByLabelText('Job title').type('Developer')
    cy.findByLabelText('Company Url').type('https://www.companion.studio')
    cy.findByLabelText('Portfolio Url').type('https://www.joshellis.co.uk')
    cy.findByLabelText('Bio').type('I am a developer and I build things')
    cy.findByText('Disciplines').should('exist')
    cy.findByLabelText('Development').click()
    cy.findByLabelText('Product').click()
    cy.findByLabelText('Twitter').type('https://www.twitter.com/@_josh_ellis_')

    // go to availability
    cy.findByText('Continue to Availability').click()

    // fill in availability
    cy.findByLabelText('Timezone').select('GMT -1')
    cy.findByLabelText('monday Time start').type('12:00')
    cy.findByLabelText('monday Time end').type('18:00')

    // submit
    cy.findByText('Complete account setup').click()
  })
})
