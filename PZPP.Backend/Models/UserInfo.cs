namespace PZPP.Backend.Models
{
    public class UserInfo
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? Street { get; set; }

        public string? PostCode { get; set; }

        public string? City { get; set; }
    }
}
