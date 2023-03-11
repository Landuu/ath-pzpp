using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Dto.Auth
{
    public class LoginDto
    {
        [MinLength(3)]
        [MaxLength(24)]
        public string Login { get; set; }

        [MinLength(5)]
        [MaxLength(32)]
        public string Password { get; set; }
    }
}
