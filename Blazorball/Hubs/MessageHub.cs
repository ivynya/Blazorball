using Blazorball.Data;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazorball.Hubs
{
    public class MessageHub : Hub
    {
        // Connection ID - Room Code
        private static readonly Dictionary<string, int> hosts = new Dictionary<string, int>();

        // Room Code - [Player Name, Team Index]
        public static readonly Dictionary<int, Dictionary<string, int>> players = new Dictionary<int, Dictionary<string, int>>();
        // Room Code - Number of Teams
        public static readonly Dictionary<int, int> teamCount = new Dictionary<int, int>();

        // Host client registers a room. Returns SetRoomID + RoomID
        public async Task Register()
        {
            var currentId = Context.ConnectionId;
            if (!hosts.ContainsKey(currentId))
            {
                // Generate room code
                int code = new Random().Next(10000, 100000);
                // Maintain lookup of rooms
                hosts.Add(currentId, code);
                players.Add(code, new Dictionary<string, int>());
                teamCount.Add(code, 0);
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

        // Joins a client to a room and returns validation.
        public async Task JoinRoom(int roomCode, string userName)
        {
            // Check if room still exists
            if (!hosts.ContainsValue(roomCode))
            {
                await Clients.Caller.SendAsync(Messages.VerifyJoin, false, "Room no longer exists!");
                return;
            }

            // Check name availability
            if (players[roomCode].ContainsKey(userName))
            {
                await Clients.Caller.SendAsync(Messages.VerifyJoin, false, "Name taken!");
                return;
            }

            // Verify connection
            await Groups.AddToGroupAsync(Context.ConnectionId, roomCode.ToString());
            await Clients.Caller.SendAsync(Messages.VerifyJoin, true, "");

            players[roomCode].Add(userName, 0);
            await Clients.Group(roomCode.ToString()).SendAsync(Messages.UpdateUsers, teamCount[roomCode], JsonConvert.SerializeObject(players[roomCode]));
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
