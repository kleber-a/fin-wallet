import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Input from './page';
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
};

function WrapperInput() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onSubmit',
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <Input
        name="email"
        label="Email"
        placeholder="Digite seu email"
        type="email"
        register={register}
        rules={{ required: 'Campo obrigatório' }}
        error={errors.email?.message as string}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

describe('Input Component', () => {
  it('mostra mensagem de erro quando o campo é obrigatório', async () => {
    render(<WrapperInput />);

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    });
  });
});
