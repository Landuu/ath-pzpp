﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PZPP.Backend.Models
{
    public class UserToken
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string RefreshToken { get; set; }
    }
}