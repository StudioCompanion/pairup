import { testData } from 'test/seed/data'

describe('Dashboard', () => {
  it('should redirect to /login for unauthenticated users', () => {
    cy.visit(`/app`)
    cy.url().should('include', 'login')
  })

  it('should show the dashboard for authenticated users', () => {
    const userId = testData.users[0].id

    cy.auth(userId)
    cy.visit('/app')
    cy.contains('Hello Tester').should('be.visible')
  })
})
