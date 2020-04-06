using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blazorball.Data
{
    public class Player
    {
        public Player(string name)
        {
            Username = name;
            Team = 0;
        }

        public string Username { get; set; }
        public int Team { get; set; }
    }
}
