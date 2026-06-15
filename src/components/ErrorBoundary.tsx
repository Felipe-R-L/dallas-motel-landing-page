import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Erro nao tratado na aplicacao:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-velvet-950 text-white min-h-screen flex items-center justify-center px-6 text-center">
          <div>
            <h1 className="font-playfair text-2xl font-bold text-gold-400 mb-3">
              Algo deu errado
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Ocorreu um erro inesperado. Tente recarregar a pagina.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold-400 hover:bg-gold-300 text-velvet-900 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
