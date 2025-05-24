import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDialog from "./page";

describe("ConfirmDialog", () => {

  const defaultProps = {
    open: true,
    title: "Confirmar ação",
    description: "Tem certeza que deseja prosseguir?",
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    loading: false,
    confirmText: "Confirmar",
    cancelText: "Cancelar",
  };


  afterEach(() => {
    jest.clearAllMocks();
  });


  it("não deve renderizar quando open for false", () => {
    const { container } = render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(container.firstChild).toBeNull();
  });


  it("deve renderizar título e descrição", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Confirmar ação")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza que deseja prosseguir?")).toBeInTheDocument();
  });

  it("deve renderizar os botões de confirmar e cancelar", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });


  it("deve chamar onCancel ao clicar no botão cancelar", () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });


  it("deve chamar onConfirm ao clicar no botão confirmar", () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Confirmar"));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });


  it("deve mostrar estado de loading quando loading for true", () => {
    render(<ConfirmDialog {...defaultProps} loading={true} />);
    const loadingButton = screen.getByText("Processando...");
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
    expect(screen.getByText("Cancelar")).toBeDisabled();
  });
});
