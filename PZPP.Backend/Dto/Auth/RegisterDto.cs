using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Dto.Auth
{
    public class RegisterDto
    {
        [MaxLength(32)]
        public string FirstName { get; set; }

        [MaxLength(32)]
        public string LastName { get; set; }

        [MinLength(3), MaxLength(32)]
        public string Login { get; set; }

        [MinLength(5), MaxLength(32)]
        public string Password { get; set; }
    }
}
