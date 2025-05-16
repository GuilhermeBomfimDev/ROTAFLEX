using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

namespace RotaFlex.Services
{
    public class GoogleMapsService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GoogleMapsService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> ObterRotaTransportePublico(string origem, string destino)
        {
            string apiKey = "AIzaSyC-LZkV2B_6wHRtnkh-LzCisFlDxO-ft8w";
            string url = $"https://maps.googleapis.com/maps/api/directions/json?origin={Uri.EscapeDataString(origem)}&destination={Uri.EscapeDataString(destino)}&mode=transit&key={apiKey}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> ObterRotaGoogle(string origem, string destino, string modo)
        {
            var apiKey = _configuration["GoogleMaps:ApiKey"];
            var url = $"https://maps.googleapis.com/maps/api/directions/json?origin={origem}&destination={destino}&mode={modo}&key={apiKey}";

            using var client = new HttpClient();
            return await client.GetStringAsync(url);
        }
    }
}
