
namespace Blazorball.Data
{
    public class Player
    {
        public Player(int id, string name)
        {
            Id = id;
            Username = name;
            Team = 0;
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public int Team { get; set; }
    }
}
