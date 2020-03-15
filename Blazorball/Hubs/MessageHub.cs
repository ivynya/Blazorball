using Blazorball.Data;
using Microsoft.AspNetCore.Identity;
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
            await Clients.All.SendAsync(Messages.Recieve, user, message);
        }

        // Host client registers a room. Returns SetRoomID + RoomID
        public async Task Register()
        {
            var currentId = Context.ConnectionId;
            if (!hosts.ContainsKey(currentId))
            {
                // Generate room code
                int code = new Random().Next(10000, 100000);
                // Maintain lookup of hosts
                hosts.Add(currentId, code);
                // Send RoomID to host
                await Clients.Caller.SendAsync(Messages.SetRoomID, code);
                await Groups.AddToGroupAsync(Context.ConnectionId, code.ToString());
            }
        }

        // Checks if a room exists, returns true or false. Used by the client.
        public async Task VerifyRoom(int roomCode)
        {
            if (hosts.ContainsValue(roomCode))
                await Clients.Caller.SendAsync(Messages.VerifyRoom, true);
            else
                await Clients.Caller.SendAsync(Messages.VerifyRoom, false);
        }

        // Joins a client to a room
        public async Task JoinRoom(int roomCode, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomCode.ToString());
            await Clients.Group(roomCode.ToString()).SendAsync(Messages.JoinRoom, userName);
        }

        // Handles removing host or client on disconnect
        public override async Task OnDisconnectedAsync(Exception e)
        {
            Console.WriteLine($"Disconnected {e?.Message} {Context.ConnectionId}");
            // Try to get and remove lookup
            string id = Context.ConnectionId;
            if (hosts.ContainsKey(id))
                hosts.Remove(id);

            await base.OnDisconnectedAsync(e);
        }
    }
}
