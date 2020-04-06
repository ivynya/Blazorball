using System;
using System.Collections.Generic;

namespace Blazorball.Data
{
    public class Room
    {
        public Room(string hostConnectionID)
        {
            HostConnectionID = hostConnectionID;
            Players = new Dictionary<string, Player>();
            TeamCount = 0;
        }

        public string HostConnectionID { get; set; }

        // Connection ID - Player
        public Dictionary<string, Player> Players { get; set; }
        public int TeamCount { get; set; }
    }
}
