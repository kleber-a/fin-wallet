import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Card from './page';
import { Banknote } from 'lucide-react';

describe('Card', () => {

    const mock = {
      title: "Depósitos Fáceis",
      description: "Adicione saldo à sua conta de forma rápida e segura.",
      icon: <Banknote className="h-8 w-8 text-green-600" />,
    }

  it('deve renderizar card com título Depósitos Fáceis', () => {
    render(<Card title={mock.title} description={mock.description} icon={mock.icon} />);
    
    const divComTexto = screen.getByText('Depósitos Fáceis');
    expect(divComTexto).toBeInTheDocument();
  });
});