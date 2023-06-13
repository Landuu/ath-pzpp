using System.Text.Json.Serialization;

namespace PZPP.Backend.Dto
{
    public class CartBase64Dto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("q")]
        public int Q { get; set; }
    }
}
