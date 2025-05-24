import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardLayout from './layout';

describe('DashboardLayout', () => {

  it('renderiza o layout com children', () => {
    render(
      <DashboardLayout>
        <div>Conteúdo do dashboard</div>
      </DashboardLayout>
    );

    expect(screen.getByText('Navegação')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do dashboard')).toBeInTheDocument();
  });

  it('abre e fecha o menu mobile corretamente', () => {
    render(
      <DashboardLayout>
        <div>Conteúdo do dashboard</div>
      </DashboardLayout>
    );

    const openButton = screen.getByLabelText('Abrir menu');

    const aside = screen.getByRole('complementary'); // <aside>
    expect(aside).toHaveClass('-translate-x-full');

    fireEvent.click(openButton);
    expect(aside).toHaveClass('translate-x-0');

    const closeButton = screen.getByLabelText('Fechar menu');
    fireEvent.click(closeButton);
    expect(aside).toHaveClass('-translate-x-full');
  });

});
