using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Dto.User
{
    public class PutAccountInfoDto
    {
        [MinLength(1), MaxLength(32)]
        public string FirstName { get; set; }

        [MinLength(1), MaxLength(32)]
        public string LastName { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }
    }
}
