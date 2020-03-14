using Blazorball.Data;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blazorball.Hubs
{
    public class MessageHub : Hub
    {
        private static readonly Dictionary<string, int> hosts = new Dictionary<string, int>();

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Register()
        {
            var currentId = Context.ConnectionId;
            if (!hosts.ContainsKey(currentId))
            {
                // Generate room code
                int code = new Random().Next(10000, 100000);
                // maintain a lookup of connectionId-to-username
                hosts.Add(currentId, code);
                // re-use existing message for now
                await Clients.Caller.SendAsync("SetRoomID", code);
            }
        }
    }
}
