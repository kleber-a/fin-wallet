import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HeaderDashBoard from './page';

describe('HeaderDashBoard', () => {
  it('deve verificar Termos de Serviço', () => {
    render(<HeaderDashBoard heading="Title" text="description" />);

    const titleSpan = screen.getByText(/Title/i);
    expect(titleSpan).toBeInTheDocument();

  });
});