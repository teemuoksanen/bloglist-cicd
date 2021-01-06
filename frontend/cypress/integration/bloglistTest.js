describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testaaja',
      username: 'testi',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login page is opened first', function() {
    cy.contains('Log in to application')
  })

  it('user can login', function() {
    cy.get('#username').type('testi')
    cy.get('#password').type('salainen')
    cy.get('#loginbutton').click()

    cy.contains('Testaaja logged in')
  })

  it('login fails with incorrect password', function() {
    cy.get('#username').type('testi')
    cy.get('#password').type('virhe')
    cy.get('#loginbutton').click()

    cy.contains('Wrong username or password')
  })

})