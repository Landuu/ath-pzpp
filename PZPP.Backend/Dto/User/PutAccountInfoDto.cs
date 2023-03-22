using System.ComponentModel.DataAnnotations;

namespace PZPP.Backend.Dto.User
{
    public class PutAccountInfoDto
    {
        [MinLength(1), MaxLength(32)]
        public string FirstName { get; set; }

        [MinLength(1), MaxLength(32)]
        public string LastName { get; set; }

        [MinLength(1), MaxLength(255)]
        public string Email { get; set; }

        [MinLength(9), MaxLength(9)]
        public string Phone { get; set; }
    }
}
