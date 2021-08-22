describe('Dashboard', () => {
  it('should redirect to /sign-up for unauthenticated users', () => {
    cy.visit(`/app`)
    cy.url().should('include', 'sign-up')
  })
})
