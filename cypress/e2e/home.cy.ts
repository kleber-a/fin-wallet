describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Deve exibir o título principal corretamente', () => {
    cy.contains('Sua Carteira Digital Segura').should('be.visible');
  });

  it('Deve exibir os botões "Começar Agora" e "Entrar"', () => {
    cy.contains('Começar Agora').should('be.visible');
    cy.contains('Entrar').should('be.visible');
  });

  it('Deve navegar para a página de registro ao clicar em "Começar Agora"', () => {
    cy.contains('Começar Agora').click();
    cy.url().should('include', '/register');
  });

  it('Deve navegar para a página de login ao clicar em "Entrar"', () => {
    cy.contains('Entrar').click();
    cy.url().should('include', '/login');
  });

    it('Deve navegar para a página de Cadastro ao clicar em "Cadastrar"', () => {
    cy.contains('Cadastrar').click();
    cy.url().should('include', '/register');
  });

  it('Deve exibir o saldo disponível corretamente', () => {
    cy.contains('Saldo Disponível').should('be.visible');
    cy.contains('R$ 2.500,00').should('be.visible');
  });

  it('Deve exibir os cards de funcionalidades', () => {
    const cardTitles = [
      'Depósitos Fáceis',
      'Transferências Instantâneas',
      'Depósitos Fáceis' // Verifique se esse é realmente duplicado ou se foi erro no código
    ];

    cardTitles.forEach(title => {
      cy.contains(title).should('be.visible');
    });
  });

  it('Deve ter botões de ações na conta simulada', () => {
    cy.contains('Transferência').should('be.visible');
    cy.contains('Enviar').should('be.visible');
    cy.contains('Depósito').should('be.visible');
    cy.contains('Depositar').should('be.visible');
  });
});
