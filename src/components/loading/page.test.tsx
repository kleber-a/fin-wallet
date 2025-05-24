import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Loading from './page';

describe('Loading Component', () => {
  it('renderiza o ícone de carregamento', () => {
    render(<Loading />);

    const loaderIcon = screen.getByLabelText('Loading');

    expect(loaderIcon).toBeInTheDocument();
    expect(loaderIcon).toHaveClass('animate-spin');
    expect(loaderIcon).toHaveClass('text-amber-400');
    expect(loaderIcon).toHaveClass('w-12');
    expect(loaderIcon).toHaveClass('h-12');
  });
});
