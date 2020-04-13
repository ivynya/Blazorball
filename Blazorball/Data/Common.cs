using System.Collections.Generic;

namespace Blazorball.Data
{
    public class Common
    {
        public static readonly Dictionary<int, string> PolygonNames = new Dictionary<int, string>()
        {
            { 3, "Triangle" },
            { 4, "Tetragon" },
            { 5, "Pentagon" },
            { 6, "Hexagon" },
            { 7, "Heptagon" },
            { 8, "Octagon" }
        };
    }
}
