﻿namespace PZPP.Backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Login { get; set; }

        public string PasswordHash { get; set; }

        public string? RefreshToken { get; set; }

        public DateTime RegisterDate { get; set; }

        public DateTime? LastLogin { get; set; }

        public UserInfo UserInfo { get; set; }
    }
}
