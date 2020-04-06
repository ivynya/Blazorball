using Blazorball.Data;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blazorball.Hubs
{
    public class MessageHub : Hub
    {
        // Room Code - Room
        private static readonly Dictionary<int, Room> rooms = new Dictionary<int, Room>();

        // Host registers a room. Returns SetRoomID + RoomID to host.
        public async Task Register()
        {
            var currentId = Context.ConnectionId;
            if (!rooms.Values.Any(r => r.HostConnectionID == currentId))
            {
                // Create and register new room
                Room newRoom = new Room(currentId);
                int roomCode = new Random().Next(10000, 100000);
                rooms.Add(roomCode, newRoom);

                // Send RoomID to host and add to group
                await Clients.Caller.SendAsync(Messages.SetRoomID, roomCode);
                await Groups.AddToGroupAsync(Context.ConnectionId, roomCode.ToString());
            }
        }

        // Checks if a room exists, returns true or false. Used by the client.
        public async Task VerifyRoom(int roomCode)
        {
            if (rooms.ContainsKey(roomCode))
                await Clients.Caller.SendAsync(Messages.VerifyRoom, true);
            else
                await Clients.Caller.SendAsync(Messages.VerifyRoom, false);
        }

        // Joins a client to a room and returns validation.
        public async Task JoinRoom(int roomCode, string userName)
        {
            // Check if room still exists
            if (!rooms.ContainsKey(roomCode))
            {
                await Clients.Caller.SendAsync(Messages.VerifyJoin, false, "Room no longer exists!");
                return;
            }

            // Check name availability
            Room room = rooms[roomCode];
            if (room.Players.Any(p => p.Value.Username == userName))
            {
                await Clients.Caller.SendAsync(Messages.VerifyJoin, false, "Name taken!");
                return;
            }

            // Verify connection
            await Groups.AddToGroupAsync(Context.ConnectionId, roomCode.ToString());
            await Clients.Caller.SendAsync(Messages.VerifyJoin, true, "");

            // Add client to lookups and update information
            room.Players.Add(Context.ConnectionId, new Player(userName));
            await UpdateRoom(roomCode);
        }

        // Creates a new team in a room, and joins the client to that team
        public async Task CreateTeam(int roomCode)
        {
            Room room = rooms[roomCode];
            room.TeamCount++;
            room.Players[Context.ConnectionId].Team = room.TeamCount;

            await UpdateRoom(roomCode);
        }

        // Joins a user to a team using clients to get room ID
        public async Task JoinTeam(int roomCode, int teamID)
        {
            rooms[roomCode].Players[Context.ConnectionId].Team = teamID;
            await UpdateRoom(roomCode);
        }

        // Allows clients to see game controls, host to see game screen
        public async Task StartGame()
        {
            int room = rooms.First(r => r.Value.HostConnectionID == Context.ConnectionId).Key;
            await Clients.Group(room.ToString()).SendAsync(Messages.StartGame);
        }

        // Handles removing host or client on disconnect
        public override async Task OnDisconnectedAsync(Exception e)
        {
            Console.WriteLine($"Disconnected {e?.Message} {Context.ConnectionId}");

            // Try to get and remove lookup
            string id = Context.ConnectionId;

            // Handle if connection was host
            Room room = rooms.Values.First(r => r.HostConnectionID == Context.ConnectionId);
            if (room != null)
            {
                int code = rooms.First(r => r.Value == room).Key;
                await Groups.RemoveFromGroupAsync(id, code.ToString());
                await Clients.Group(code.ToString()).SendAsync(Messages.HostDisconnected);
                rooms.Remove(code);
            }

            // Handle if connection was player
            room = rooms.Values.First(r => r.Players.ContainsKey(Context.ConnectionId));
            if (room != null)
            {
                int code = rooms.First(r => r.Value == room).Key;
                room.Players.Remove(Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(id, code.ToString());
                await UpdateRoom(code);
            }

            await base.OnDisconnectedAsync(e);
        }

        // Updates the user list in a given room
        private async Task UpdateRoom(int roomCode)
        {
            Room room = rooms[roomCode];
            string playersJSON = JsonConvert.SerializeObject(room.Players.Values.ToList());
            await Clients.Group(roomCode.ToString()).SendAsync(Messages.UpdateUsers, room.TeamCount, playersJSON);
        }
    }
}
