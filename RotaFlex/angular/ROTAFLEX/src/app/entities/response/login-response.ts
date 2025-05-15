export interface LoginResponse {
  mensagem: string;
  usuario: {
    nome: string;
    email: string;
    estado: string;
    cidade: string;
  };
}
