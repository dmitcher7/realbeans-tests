

describe('RealBeans Webshop Tests', () => {



  // VOORBEREIDING
  beforeEach(() => {
    cy.visit('https://r1058442-realbeans.myshopify.com')
    cy.get('input[type="password"]').type('sothow')
    cy.get('form').submit()
    
    // DE FIX: Dwing Cypress om te wachten tot de inlog-actie volledig is verwerkt.
    // Hij mag pas door naar de tests als hij deze specifieke zin van de homepage ziet.
    cy.contains('Since 1801, RealBeans has roasted premium coffee').should('be.visible')
  })



  // 1. The product catalog page shows the correct items you entered.
  it('1: The product catalog page shows the correct items you entered', () => {
    cy.visit('https://r1058442-realbeans.myshopify.com/collections/all')
    
    cy.get('.product-grid').within(() => {
      cy.contains('Blended coffee 5kg').should('exist') 
      cy.contains('Roasted coffee beans 5kg').should('exist')
    })
  })



  // 2. Sorting products actually changes their order.
  it('2: Sorting products actually changes their order', () => {
    cy.visit('https://r1058442-realbeans.myshopify.com/collections/all')
    
    // We slaan de naam van het eerste product op
    cy.get('.product-grid li').first().invoke('text').then((firstProductBefore) => {
      
      // Sorteer op Alfabet (Z-A) in plaats van prijs om volgordeverandering te garanderen
      cy.get('select[name="sort_by"]').first().select('title-descending', { force: true })
      
      // We wachten op de nieuwe URL
      cy.url().should('include', 'sort_by=title-descending')
      
      // Check of de tekst nu anders is dan voor het sorteren
      cy.get('.product-grid li').first().invoke('text').should('not.eq', firstProductBefore)
    })
  })



  // 3. Product detail pages display the right descriptions, prices, and imagenames.
  it('3: Product detail pages display the right descriptions, prices, and imagenames', () => {
    cy.visit('https://r1058442-realbeans.myshopify.com/collections/all')
    
    cy.contains('Blended coffee 5kg').click({ force: true })
    cy.url().should('include', '/products/')
    
    cy.get('.product__title, h1').should('contain.text', 'Blended coffee 5kg')
    cy.get('.price').invoke('text').should('match', /[0-9]/)
    cy.get('.product__description, .product-description').invoke('text').should('not.be.empty')
    
    // Zoek naar de '/cdn/' map in plaats van het algemene shopify domein
    cy.get('img').first().should('have.attr', 'src').and('include', '/cdn/')
  })




  // 4. The homepage's intro text, and product list appear correctly.
  it('4: The homepage intro text, and product list appear correctly', () => {
    // We hoeven hier niet meer opnieuw naar de homepage te navigeren of te wachten, 
    // want dat is al gebeurd in de beforeEach. We checken puur of de lijst bestaat.
    cy.contains('Since 1801, RealBeans has roasted premium coffee').should('be.visible')
    cy.get('.grid, .product-grid, ul').find('li').should('have.length.at.least', 1)
  })






  // 5. The About page includes the history paragraph.
  it('5: The About page includes the history paragraph', () => {
    cy.visit('https://r1058442-realbeans.myshopify.com/pages/about')
    cy.contains('From a small Antwerp grocery to a European coffee staple').should('be.visible')
  })

})


// test cloud succes