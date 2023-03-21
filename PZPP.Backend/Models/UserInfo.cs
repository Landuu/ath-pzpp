namespace PZPP.Backend.Models
{
    public class UserInfo
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? Street { get; set; }

        public string? PostCode { get; set; }

        public string? City { get; set; }
    }
}
