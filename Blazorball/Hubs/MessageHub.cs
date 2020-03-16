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
        // Connection ID - [Room Code, Player Name]
        private static readonly Dictionary<string, KeyValuePair<int, string>> clients = new Dictionary<string, KeyValuePair<int, string>>();

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

            // Add client to lookups and update information
            clients.Add(Context.ConnectionId, new KeyValuePair<int, string>(roomCode, userName));
            players[roomCode].Add(userName, 0);
            await UpdateRoom(roomCode);
        }

        // Creates a new team in a room, and joins the client to that team
        public async Task CreateTeam()
        {
            int roomCode = clients[Context.ConnectionId].Key;
            teamCount[roomCode] += 1;
            players[roomCode][clients[Context.ConnectionId].Value] = teamCount[roomCode];

            await UpdateRoom(roomCode);
        }

        public async Task JoinTeam(int teamID)
        {
            int roomCode = clients[Context.ConnectionId].Key;
            players[roomCode][clients[Context.ConnectionId].Value] = teamID;

            await UpdateRoom(roomCode);
        }

        // Handles removing host or client on disconnect
        public override async Task OnDisconnectedAsync(Exception e)
        {
            Console.WriteLine($"Disconnected {e?.Message} {Context.ConnectionId}");

            // Try to get and remove lookup
            string id = Context.ConnectionId;

            if (hosts.ContainsKey(id))
            {
                hosts.Remove(id);
                await Groups.RemoveFromGroupAsync(id, hosts[id].ToString());
            }

            if (clients.ContainsKey(id))
            {
                int roomCode = clients[id].Key;
                players[roomCode].Remove(clients[id].Value);
                await Groups.RemoveFromGroupAsync(id, roomCode.ToString());
                await UpdateRoom(roomCode);
            }

            await base.OnDisconnectedAsync(e);
        }

        // Updates the user list in a given room
        private async Task UpdateRoom(int room)
        {
            await Clients.Group(room.ToString()).SendAsync(Messages.UpdateUsers, teamCount[room], JsonConvert.SerializeObject(players[room]));
        }
    }
}
