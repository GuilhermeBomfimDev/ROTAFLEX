using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using RotaFlex.Models;
using RotaFlex.Models.DTO;
using RotaFlex.Services;

namespace RotaFlex.Controllers
{
    [ApiController]
    [Route("api/rota")]
    public class ViagemController : ControllerBase
    {
        private readonly GeoLocalizacaoService _geoService;
        private readonly GoogleMapsService _mapsService;

        public ViagemController(GeoLocalizacaoService geoService, GoogleMapsService mapsService)
        {
            _geoService = geoService;
            _mapsService = mapsService;
        }

        [HttpPost("calcular")]
        public async Task<IActionResult> CalcularRota([FromBody] RotaDTO rota)
        {
            // 1. Transporte PRIVADO (ORS)
            var distanciaKm = await _geoService.CalcularDistanciaAsync(rota.Origem, rota.Destino);

            if (distanciaKm <= 0)
                return BadRequest("Não foi possível calcular a distância privada.");

            // ⚠️ Como você removeu o Google Maps, vamos criar uma rota pública fictícia,
            // apenas para manter a estrutura que o Angular espera.
            var rotaPublica = new
            {
                Origem = rota.Origem,
                Destino = rota.Destino,
                Distancia = new { text = $"{distanciaKm:F2} km" },
                Duracao = new { text = $"{(distanciaKm * 2):F0} min" },
                Passos = new List<object>
                {
                    new {
                        Instrucoes = "Caminhe até a estação de metrô mais próxima.",
                        Modo = "",
                        Linha = "",
                        Veiculo = ""
                    },
                    new {
                        Instrucoes = "Pegue o metrô sentido Tucuruvi e desembarque na Estação Portuguesa–Tietê.",
                        Modo = "TRANSIT",
                        Linha = "Linha 1 - Azul",
                        Veiculo = "METRO"
                    },
                    new {
                        Instrucoes = "Siga até o Terminal Rodoviário do Tietê.",
                        Modo = "",
                        Linha = "",
                        Veiculo = ""
                    },
                    new {
                        Instrucoes = "Pegue um ônibus interestadual com destino ao Rio de Janeiro.",
                        Modo = "TRANSIT",
                        Linha = "Viação Cometa / 1001",
                        Veiculo = "Ônibus"
                    },
                    new {
                        Instrucoes = "Desembarque na Rodoviária Novo Rio.",
                        Modo = "TRANSIT",
                        Linha = "",
                        Veiculo = "Ônibus"
                    },
                    new {
                        Instrucoes = "Caminhe ou utilize um transporte local até o destino final.",
                        Modo = "",
                        Linha = "",
                        Veiculo = ""
                    }
                }
            };


            // OBJETO PRIVADO (mantendo estrutura)
            var privado = new
            {
                Tipo = "Privado",
                Descricao = "Corrida com motorista parceiro",
                ValorEstimado = Math.Round(distanciaKm * 2.7, 2),
                MeiosDeTransporte = new List<string> { "Carro Particular" },
                Duracao = rotaPublica.Duracao.text, // mantém estrutura
                DistanciaKm = Math.Round(distanciaKm, 2)
            };

            // OBJETO PÚBLICO (mantendo estrutura)
            var publico = new
            {
                Tipo = "Público",
                Origem = rotaPublica.Origem,
                Destino = rotaPublica.Destino,
                Distancia = rotaPublica.Distancia.text,
                Duracao = rotaPublica.Duracao.text,
                Passos = rotaPublica.Passos
            };

            return Ok(new List<object> { publico, privado,  });
        }
    }
}
