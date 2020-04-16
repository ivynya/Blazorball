using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blazorball.Data
{
    public static class Messages
    {
        // Host setup methods
        public const string Register = "Register";

        public const string SetRoomID = "SetRoomID";

        // Client setup methods
        public const string VerifyRoom = "VerifyRoom";

        public const string JoinRoom = "JoinRoom";

        public const string VerifyJoin = "VerifyJoin";

        public const string VerifySettings = "VerifySettings";

        public const string CreateTeam = "CreateTeam";

        public const string JoinTeam = "JoinTeam";

        // Client game methods
        public const string PushVector = "PushVector";

        // Host game methods
        public const string ApplyVector = "ApplyVector";

        // Generic user methods
        public const string UpdateUsers = "UpdateUsers";

        public const string HostDisconnected = "HostDisconnected";

        // Game methods
        public const string StartGame = "StartGame";

        public const string UpdateScore = "UpdateScore";
    }
}
