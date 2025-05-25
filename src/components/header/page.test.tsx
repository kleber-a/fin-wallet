import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionProvider, signOut } from 'next-auth/react';
import Header from './page';

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    ...originalModule,
    signOut: jest.fn(),
  };
});

describe('Header', () => {
  it('deve chamar signOut ao clicar no botão Sair', () => {
    const fakeSession = {
      user: {
        id: '1',
        name: 'João',
        email: 'joao@email.com',
        image: null,
        wallet: 1000,
      },
      expires: 'fake-date',
    };

    render(
      <SessionProvider session={fakeSession}>
        <Header />
      </SessionProvider>
    );

    const signOutButton = screen.getByRole('button', { name: /sair/i });
    expect(signOutButton).toBeInTheDocument();

    fireEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalled();
  });

    it('deve renderizar caso !session', () => {
    render(
      <SessionProvider session={null}>
        <Header />
      </SessionProvider>
    );

    const depositLink = screen.getByRole('link', { name: /Entrar/i });
    expect(depositLink).toBeInTheDocument();
  });
});
