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
            // 1. Transporte PRIVADO com dados reais da API Google (modo driving)
            var dadosPrivado = await _mapsService.ObterRotaGoogle(rota.Origem, rota.Destino, "driving");
            var jsonPrivado = JObject.Parse(dadosPrivado);

            if (jsonPrivado["status"]?.ToString() != "OK")
                return BadRequest("Não foi possível calcular a rota privada.");

            // 2. Transporte PÚBLICO com dados da API Google (modo transit)
            var dadosPublico = await _mapsService.ObterRotaGoogle(rota.Origem, rota.Destino, "transit");
            var jsonPublico = JObject.Parse(dadosPublico);

            if (jsonPublico["status"]?.ToString() != "OK")
                return BadRequest("Não foi possível calcular a rota pública.");

            var rotaPrivada = jsonPrivado["routes"]?[0]?["legs"]?[0];
            var rotaPublica = jsonPublico["routes"]?[0]?["legs"]?[0];

            var distanciaKm = 0.0;

            if (rotaPrivada != null)
                distanciaKm = (rotaPrivada["distance"]?["value"]?.ToObject<double>() ?? 0) / 1000;

            if (distanciaKm <= 0)
                return BadRequest("Não foi possível calcular a distância.");

            var privado = new
            {
                Tipo = "Privado",
                Descricao = "Corrida com motorista parceiro",
                ValorEstimado = Math.Round(distanciaKm * 2.7, 2),
                MeiosDeTransporte = new List<string> { "Carro Particular" },
                Duracao = rotaPublica["duration"]?["text"]?.ToString(),
                DistanciaKm = Math.Round(distanciaKm, 2)
            };

            var publico = new
            {
                Tipo = "Público",
                Origem = rotaPublica["start_address"]?.ToString(),
                Destino = rotaPublica["end_address"]?.ToString(),
                Distancia = rotaPublica["distance"]?["text"]?.ToString(),
                Duracao = rotaPublica["duration"]?["text"]?.ToString(),
                Passos = rotaPublica["steps"]?.Select(s => new
                {
                    Instrucoes = s["html_instructions"]?.ToString(),
                    Modo = s["travel_mode"]?.ToString(),
                    Linha = s["transit_details"]?["line"]?["short_name"]?.ToString(),
                    Veiculo = s["transit_details"]?["line"]?["vehicle"]?["type"]?.ToString()
                }).ToList()
            };

            return Ok(new List<object> { publico, privado });
        }

    }
}
