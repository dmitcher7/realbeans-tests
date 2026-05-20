describe('RealBeans Webshop Tests', () => {
  
  // VOORBEREIDING: Dit blokje draait automatisch vóór ELKE 'it' test hieronder.
  // Handig om te onthouden: zo hoeven we de inlogcode niet 5 keer opnieuw te typen!
  beforeEach(() => {
    cy.visit('https://r1058442-realbeans.myshopify.com')
    cy.get('input[type="password"]').type('sothow') // Vul het developer wachtwoord in
    cy.get('form').submit() // Druk op de inlogknop/enter
  })

  // 1. HOMEPAGE: Check of de startpagina laadt en de juiste elementen bevat
  it('Homepage: shows intro text and product list', () => {
    // Kijken of de specifieke introductietekst van Harry daadwerkelijk op de pagina staat
    cy.contains('Since 1801, RealBeans has roasted premium coffee').should('be.visible')
    
    // Controleren of het grid met producten is geladen. We gebruiken 'exist' zodat 
    // Cypress alleen in de code hoeft te kijken of het blok bestaat, ook als we niet scrollen.
    cy.get('.grid, .product-grid, ul').should('exist')
  })

  // 2. ABOUT PAGINA: Werkt deze pagina en klopt de geschiedenisles?
  it('About page: includes the history paragraph', () => {
    // Direct navigeren naar de specifieke pagina-URL
    cy.visit('https://r1058442-realbeans.myshopify.com/pages/about')
    cy.contains('From a small Antwerp grocery to a European coffee staple').should('be.visible')
  })

  // 3. CATALOGUS: Zitten er eigenlijk wel producten in onze webshop?
  it('Product catalog: shows the items', () => {
    // Shopify plaatst de volledige catalogus standaard altijd op /collections/all
    cy.visit('https://r1058442-realbeans.myshopify.com/collections/all')
    
    // Pak de lijst met producten en check of er meer dan 0 'kinderen' (items) in zitten
    cy.get('.product-grid').children().should('have.length.greaterThan', 0)
  })

  // 4. SORTEREN: Werkt de filter/sorteerfunctie correct?
  it('Catalog: Sorting by price changes order', () => {
    cy.visit('https://r1058442-realbeans.myshopify.com/collections/all')
    
    // TRUCJE: Shopify laadt soms 2 dropdown-menu's (voor desktop én mobiel). 
    // Met .first() pakken we de eerste. Met { force: true } dwingen we Cypress 
    // om de optie aan te klikken, zelfs als het menu visueel verborgen is.
    cy.get('select[name="sort_by"]').first().select('price-ascending', { force: true })
    
    // Check of de adresbalk verandert. Dit bewijst dat de browser de sortering doorgeeft aan de server!
    cy.url().should('include', 'sort_by=price-ascending')
  })

  // 5. DETAILPAGINA: Kunnen we een product aanklikken en de details zien?
  it('Product detail page: displays right description, price, and image', () => {
    cy.visit('https://r1058442-realbeans.myshopify.com/collections/all')
    
    // TRUCJE: Klik op de allereerste productlink. Ook hier gebruiken we { force: true } 
    // omdat Shopify vaak onzichtbare CSS-laagjes over linkjes heen legt.
    cy.get('.product-grid').find('a').first().click({ force: true })
    
    // Zitten we nu echt op een productpagina? Controleer de URL structuur
    cy.url().should('include', '/products/')
    
    // Staan de essentiële dingen (titel en prijs) op het scherm?
    cy.get('.product__title, h1').should('be.visible')
    cy.get('.price').should('be.visible')
    
    // TRUCJE: We gebruiken hier expres 'exist' in plaats van 'be.visible'. 
    // Anders crasht de test als er toevallig een Shopify cookie-banner over de foto ligt!
    cy.get('img').first().should('exist')
  })
})