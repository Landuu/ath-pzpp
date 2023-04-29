namespace PZPP.Backend.Services.Auth
{
    public class TokenPair
    {
        public required string Access { get; set; }

        public required string Refresh { get; set; }
    }
}
