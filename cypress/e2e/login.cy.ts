describe('Login e acesso à Dashboard', () => {
  it('Deve fazer login e acessar a dashboard', () => {
    // Visita a página de login
    cy.visit('/login');

    // Preenche o formulário de login
    cy.get('input[name="email"]').type('usuario@email.com');
    cy.get('input[name="password"]').type('senhaSegura123');

    // Clica no botão de login
    cy.get('button[type="submit"]').click();

    // Verifica se redirecionou para /dashboard
    cy.url().should('include', '/dashboard');

    // Valida que o header da dashboard está visível
    cy.contains('Dashboard').should('be.visible');

    // Verifica se o saldo está sendo carregado (pode ser zero ou outro valor)
    cy.get('[data-testid="wallet-balance"]').should('exist');

    // Valida se os botões de ação estão visíveis
    cy.contains('Depositar').should('be.visible');
    cy.contains('Transferir').should('be.visible');

    // Valida se existe a tabela (se aplicável)
    cy.get('table').should('exist');
  });
});
