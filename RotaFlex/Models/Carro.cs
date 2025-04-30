namespace RotaFlex.Models
{
    public class Carro
    {
        public int IdCarro { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public string Placa { get; set; }
        public int Ano { get; set; }
        public string Cor { get; set; }
        public Motorista Motorista { get; set; }

        public Carro()
        {
        }

        public Carro(string marca, string modelo, string placa, int ano, string cor, Motorista motorista)
        {
            Marca = marca;
            Modelo = modelo;
            Placa = placa;
            Ano = ano;
            Cor = cor;
            Motorista = motorista;
        }
    }
}
