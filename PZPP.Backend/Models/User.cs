namespace PZPP.Backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Login { get; set; }

        public string PasswordHash { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime RegisterDate { get; set; }

        public DateTime? LastLogin { get; set; }

        public UserToken? UserToken { get; set; }
    }
}
